import EmailService from './email.js';
import SMSService from './sms.js';

/**
 * Unified delivery service handling multiple channels
 */
class DeliveryService {
    constructor(config) {
        this.emailService = new EmailService(config.email);
        this.smsService = new SMSService(config.sms);
    }

    /**
     * Initialize all delivery services
     */
    async init() {
        await this.emailService.init();
        await this.smsService.init();
    }

    /**
     * Send OTP via specified channel
     * @param {string} identifier - Recipient (email or phone)
     * @param {string} otp - OTP code
     * @param {string} channel - Delivery channel ('email' or 'sms')
     * @returns {Promise<void>}
     */
    async send(identifier, otp, channel = 'email') {
        switch (channel.toLowerCase()) {
            case 'email':
                await this.emailService.send(identifier, otp);
                break;
            case 'sms':
                await this.smsService.send(identifier, otp);
                break;
            default:
                throw new Error(`Unsupported delivery channel: ${channel}`);
        }
    }
}

export default DeliveryService;
