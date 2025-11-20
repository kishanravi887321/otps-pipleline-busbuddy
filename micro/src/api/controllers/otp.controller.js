import { isValidEmail, isValidPhone, sanitizeInput } from '../../utils/validation.js';

/**
 * OTP Controller handling API requests
 */
class OTPController {
    constructor(otpService, rateLimiter, logger) {
        this.otpService = otpService;
        this.rateLimiter = rateLimiter;
        this.logger = logger;
    }

    /**
     * Generate and send OTP
     */
    async generate(req, res) {
        try {
            const { identifier, channel = 'email' } = req.body;

            // Validate input
            if (!identifier) {
                return res.status(400).json({
                    success: false,
                    message: 'Identifier (email or phone) is required',
                });
            }

            const sanitized = sanitizeInput(identifier);

            // Validate format based on channel
            if (channel === 'email' && !isValidEmail(sanitized)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format',
                });
            }

            if (channel === 'sms' && !isValidPhone(sanitized)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid phone number format',
                });
            }

            // Check rate limit
            const rateLimitCheck = await this.rateLimiter.checkLimit(sanitized, 'generate');
            if (!rateLimitCheck.allowed) {
                this.logger.warn('Rate limit exceeded', { identifier: sanitized });
                return res.status(429).json({
                    success: false,
                    message: 'Too many requests. Please try again later.',
                });
            }

            // Generate and send OTP
            const result = await this.otpService.generateAndSend(sanitized, channel);

            this.logger.info('OTP generated', { identifier: sanitized, channel });

            return res.status(result.success ? 200 : 500).json({
                success: result.success,
                message: result.message,
                remaining: rateLimitCheck.remaining,
            });
        } catch (error) {
            this.logger.error('Error generating OTP', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred while generating OTP',
            });
        }
    }

    /**
     * Validate OTP
     */
    async validate(req, res) {
        try {
            const { identifier, otp } = req.body;

            // Validate input
            if (!identifier || !otp) {
                return res.status(400).json({
                    success: false,
                    message: 'Identifier and OTP are required',
                });
            }

            const sanitizedIdentifier = sanitizeInput(identifier);
            const sanitizedOTP = sanitizeInput(otp);

            // Check rate limit
            const rateLimitCheck = await this.rateLimiter.checkLimit(sanitizedIdentifier, 'validate');
            if (!rateLimitCheck.allowed) {
                this.logger.warn('Rate limit exceeded for validation', { identifier: sanitizedIdentifier });
                return res.status(429).json({
                    success: false,
                    message: 'Too many validation attempts. Please try again later.',
                });
            }

            // Validate OTP
            const result = await this.otpService.validate(sanitizedIdentifier, sanitizedOTP);

            this.logger.info('OTP validation attempt', {
                identifier: sanitizedIdentifier,
                success: result.success,
            });

            return res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            this.logger.error('Error validating OTP', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred while validating OTP',
            });
        }
    }

    /**
     * Health check
     */
    async health(req, res) {
        return res.status(200).json({
            success: true,
            message: 'OTP service is running',
            timestamp: new Date().toISOString(),
        });
    }
}

export default OTPController;
