import nodemailer from 'nodemailer';

/**
 * Email delivery service using Nodemailer
 */
class EmailService {
    constructor(config) {
        this.config = config;
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
            console.log('Email service ready');
        } catch (error) {
            console.error('Email service verification failed:', error.message);
        }
    }

    /**
     * Send OTP via email
     * @param {string} to - Recipient email address
     * @param {string} otp - OTP code
     * @returns {Promise<void>}
     */
    async send(to, otp) {
        if (!this.transporter) {
            await this.init();
        }

        const mailOptions = {
            from: this.config.from,
            to: to,
            subject: 'Your OTP Code',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">OTP Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666;">This code will expire in ${this.config.expiryMinutes || 5} minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent:', info.messageId);
        } catch (error) {
            console.error('Failed to send email:', error.message);
            throw error;
        }
    }
}

export default EmailService;
