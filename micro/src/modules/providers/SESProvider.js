import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import EmailProvider from './EmailProvider.js';

/**
 * AWS SES Email Provider
 */
class SESProvider extends EmailProvider {
    constructor(config, emailConfig, logger) {
        super();
        this.config = config;
        this.emailConfig = emailConfig;
        this.logger = logger;
        this.client = null;
    }

    async init() {
        this.client = new SESClient({
            region: this.config.region,
            credentials: {
                accessKeyId: this.config.accessKeyId,
                secretAccessKey: this.config.secretAccessKey,
            },
        });

        this.logger.info('AWS SES provider ready');
    }

    async send(to, subject, html) {
        if (!this.client) {
            await this.init();
        }

        const command = new SendEmailCommand({
            Source: this.emailConfig.from,
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Subject: {
                    Data: subject,
                    Charset: 'UTF-8',
                },
                Body: {
                    Html: {
                        Data: html,
                        Charset: 'UTF-8',
                    },
                },
            },
        });

        try {
            const response = await this.client.send(command);

            this.logger.info('Email sent via AWS SES', {
                to,
                subject,
                messageId: response.MessageId
            });

            return {
                success: true,
                message: 'Email sent successfully via AWS SES',
                messageId: response.MessageId,
            };
        } catch (error) {
            this.logger.error('AWS SES send failed', {
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
        return 'AWS SES';
    }
}

export default SESProvider;
