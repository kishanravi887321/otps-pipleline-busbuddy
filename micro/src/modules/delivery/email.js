import nodemailer from 'nodemailer';

/**
 * Email delivery service using Nodemailer
 */
class EmailService {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
        this.transporter = null;
    }

    /**
     * Initialize email transporter
     */
    async init() {
        this.transporter = nodemailer.createTransport({
            host: this.config.host,
            port: this.config.port,
            secure: this.config.secure,
            auth: {
                user: this.config.user,
                pass: this.config.password,
            },
        });

        // Verify connection
        try {
            await this.transporter.verify();
            this.logger.info('Email service ready');
        } catch (error) {
            this.logger.error('Email service verification failed', { error: error.message });
        }
    }

    /**
     * Send email
     * @param {string} to - Recipient email
     * @param {string} subject - Email subject
     * @param {string} html - Email HTML content
     */
    async send(to, subject, html) {
        if (!this.transporter) {
            await this.init();
        }

        try {
            await this.transporter.sendMail({
                from: this.config.from,
                to,
                subject,
                html,
            });

            this.logger.info('Email sent successfully', { to, subject });

            return {
                success: true,
                message: 'Email sent successfully',
            };
        } catch (error) {
            this.logger.error('Failed to send email', { to, subject, error: error.message });
            return {
                success: false,
                message: 'Failed to send email',
            };
        }
    }
}

export default EmailService;
