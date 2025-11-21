import SibApiV3Sdk from 'sib-api-v3-sdk';
import EmailProvider from './EmailProvider.js';

/**
 * Brevo (Sendinblue) Email Provider
 */
class BrevoProvider extends EmailProvider {
    constructor(config, emailConfig, logger) {
        super();
        this.config = config;
        this.emailConfig = emailConfig;
        this.logger = logger;
        this.apiInstance = null;
    }

    async init() {
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = this.config.apiKey;

        this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        this.logger.info('Brevo provider ready');
    }

    async send(to, subject, html) {
        if (!this.apiInstance) {
            await this.init();
        }

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.sender = {
            name: 'BusBuddy',
            email: this.emailConfig.from
        };
        sendSmtpEmail.to = [{ email: to }];
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = html;

        try {
            const data = await this.apiInstance.sendTransacEmail(sendSmtpEmail);

            this.logger.info('Email sent via Brevo', {
                to,
                subject,
                messageId: data.messageId
            });

            return {
                success: true,
                message: 'Email sent successfully via Brevo',
                messageId: data.messageId,
            };
        } catch (error) {
            this.logger.error('Brevo send failed', {
                to,
                subject,
                error: error.message
            });

            return {
                success: false,
                message: error.message,
            };
        }
    }

    getName() {
        return 'Brevo';
    }
}

export default BrevoProvider;
