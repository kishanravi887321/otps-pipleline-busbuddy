import { generateOTP } from './generator.js';
import { validateOTP } from './validator.js';

/**
 * High-level OTP service orchestrating generation, storage, and delivery
 */
class OTPService {
    constructor(storage, deliveryService, config) {
        this.storage = storage;
        this.deliveryService = deliveryService;
        this.config = config;
    }

    /**
     * Generate and send OTP
     * @param {string} identifier - User identifier (email or phone)
     * @param {string} channel - Delivery channel ('email' or 'sms')
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async generateAndSend(identifier, channel = 'email') {
        try {
            // Generate OTP
            const otp = generateOTP(this.config.otp.length);

            // Store OTP with expiry
            const expiresAt = Date.now() + (this.config.otp.expiryMinutes * 60 * 1000);
            const otpData = JSON.stringify({ otp, expiresAt });
            const key = `otp:${identifier}`;

            await this.storage.set(key, otpData, this.config.otp.expiryMinutes * 60);

            // Send OTP via selected channel
            await this.deliveryService.send(identifier, otp, channel);

            return {
                success: true,
                message: `OTP sent successfully via ${channel}`,
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to send OTP: ${error.message}`,
            };
        }
    }

    /**
     * Validate OTP
     * @param {string} identifier - User identifier
     * @param {string} otp - OTP to validate
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async validate(identifier, otp) {
        return validateOTP(this.storage, identifier, otp, this.config.otp.maxAttempts);
    }
}

export default OTPService;
