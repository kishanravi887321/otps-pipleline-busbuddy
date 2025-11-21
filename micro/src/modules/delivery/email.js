/**
 * Email Service
 * Uses provider pattern to support multiple email providers
 */
class EmailService {
    constructor(provider, logger) {
        this.provider = provider;
        this.logger = logger;
    }

    /**
     * Initialize email service
     */
    async init() {
        await this.provider.init();
        this.logger.info(`Email service initialized with ${this.provider.getName()} provider`);
    }

    /**
     * Send email
     * @param {string} to - Recipient email
     * @param {string} subject - Email subject
     * @param {string} html - Email HTML content
     */
    async send(to, subject, html) {
        return await this.provider.send(to, subject, html);
    }

    /**
     * Get current provider name
     */
    getProviderName() {
        return this.provider.getName();
    }
}

export default EmailService;
