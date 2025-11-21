import SMTPProvider from './SMTPProvider.js';
import BrevoProvider from './BrevoProvider.js';
import SESProvider from './SESProvider.js';

/**
 * Email Provider Factory
 * Creates the appropriate email provider based on configuration
 */
export function createEmailProvider(config, logger) {
    const providerType = config.email.provider.toLowerCase();

    logger.info(`Initializing email provider: ${providerType}`);

    switch (providerType) {
        case 'brevo':
        case 'sendinblue':
            return new BrevoProvider(config.brevo, config.email, logger);

        case 'ses':
        case 'aws-ses':
            return new SESProvider(config.ses, config.email, logger);

        case 'smtp':
        default:
            return new SMTPProvider(config.email, logger);
    }
}

export { SMTPProvider, BrevoProvider, SESProvider };
