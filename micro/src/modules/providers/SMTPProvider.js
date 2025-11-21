import nodemailer from 'nodemailer';
import EmailProvider from './EmailProvider.js';

/**
 * SMTP Email Provider using Nodemailer
 */
class SMTPProvider extends EmailProvider {
    constructor(config, logger) {
        super();
        this.config = config;
        this.logger = logger;
        this.transporter = null;
    }

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

        try {
            await this.transporter.verify();
            this.logger.info('SMTP provider ready');
        } catch (error) {
            this.logger.warn('SMTP verification failed', { error: error.message });
        }
    }

    async send(to, subject, html) {
        if (!this.transporter) {
            await this.init();
        }

        try {
            const info = await this.transporter.sendMail({
                from: this.config.from,
                to,
                subject,
                html,
            });

            this.logger.info('Email sent via SMTP', { to, subject, messageId: info.messageId });

            return {
                success: true,
                message: 'Email sent successfully',
                messageId: info.messageId,
            };
        } catch (error) {
            this.logger.error('SMTP send failed', { to, subject, error: error.message });
            return {
                success: false,
                message: error.message,
            };
        }
    }

    getName() {
        return 'SMTP';
    }
}

export default SMTPProvider;
