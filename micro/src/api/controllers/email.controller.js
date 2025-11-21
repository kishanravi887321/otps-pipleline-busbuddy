import { renderTemplate, listTemplates } from '../modules/templates/index.js';

/**
 * Email Controller handling API requests
 */
class EmailController {
    constructor(emailService, rateLimiter, logger) {
        this.emailService = emailService;
        this.rateLimiter = rateLimiter;
        this.logger = logger;
    }

    /**
     * Send email with template
     */
    async send(req, res) {
        try {
            const { to, template, data, subject } = req.body;

            // Validate input
            if (!to || !template || !data) {
                return res.status(400).json({
                    success: false,
                    message: 'Required fields: to (email), template (name), data (object)',
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(to)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email address',
                });
            }

            // Check rate limit
            const rateLimitCheck = await this.rateLimiter.checkLimit(to, 'send_email');
            if (!rateLimitCheck.allowed) {
                this.logger.warn('Rate limit exceeded', { email: to });
                return res.status(429).json({
                    success: false,
                    message: 'Too many email requests. Please try again later.',
                    remaining: 0,
                });
            }

            // Render template
            let emailContent;
            try {
                emailContent = renderTemplate(template, data);
            } catch (error) {
                this.logger.error('Template rendering failed', { template, error: error.message });
                return res.status(400).json({
                    success: false,
                    message: error.message,
                    availableTemplates: listTemplates(),
                });
            }

            // Override subject if provided
            if (subject) {
                emailContent.subject = subject;
            }

            // Send email
            const result = await this.emailService.send(to, emailContent.subject, emailContent.html);

            this.logger.info('Email sent', { email: to, template, success: result.success });

            return res.status(result.success ? 200 : 500).json({
                success: result.success,
                message: result.message,
                remaining: rateLimitCheck.remaining,
            });
        } catch (error) {
            this.logger.error('Error sending email', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred while sending email',
            });
        }
    }

    /**
     * Health check
     */
    async health(req, res) {
        return res.status(200).json({
            success: true,
            message: 'Email service is running',
            timestamp: new Date().toISOString(),
            availableTemplates: listTemplates(),
        });
    }
}

export default EmailController;
