/**
 * Base Email Provider Interface
 * All email providers must implement this interface
 */
class EmailProvider {
    /**
     * Initialize the provider
     */
    async init() {
        throw new Error('init() must be implemented');
    }

    /**
     * Send email
     * @param {string} to - Recipient email
     * @param {string} subject - Email subject
     * @param {string} html - Email HTML content
     * @returns {Promise<{success: boolean, message: string, messageId?: string}>}
     */
    async send(to, subject, html) {
        throw new Error('send() must be implemented');
    }

    /**
     * Get provider name
     * @returns {string}
     */
    getName() {
        throw new Error('getName() must be implemented');
    }
}

export default EmailProvider;
