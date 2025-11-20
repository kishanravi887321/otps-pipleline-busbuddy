/**
 * SMS delivery service (mock implementation)
 * Replace with actual provider (Twilio, AWS SNS, etc.) as needed
 */
class SMSService {
    constructor(config) {
        this.config = config;
    }

    /**
     * Initialize SMS service
     */
    async init() {
        console.log(`SMS service initialized with provider: ${this.config.provider}`);
    }

    /**
     * Send OTP via SMS
     * @param {string} to - Recipient phone number
     * @param {string} otp - OTP code
     * @returns {Promise<void>}
     */
    async send(to, otp) {
        // Mock implementation - log to console
        console.log(`[SMS Mock] Sending OTP to ${to}: ${otp}`);

        // TODO: Integrate actual SMS provider
        // Example for Twilio:
        // const client = require('twilio')(accountSid, authToken);
        // await client.messages.create({
        //   body: `Your OTP code is: ${otp}`,
        //   from: this.config.fromNumber,
        //   to: to
        // });

        return Promise.resolve();
    }
}

export default SMSService;
