import nodemailer from 'nodemailer';

/**
 * Email delivery service using Nodemailer
 */
```javascript
import nodemailer from 'nodemailer';

/**
 * Email delivery service using Nodemailer
 */
class EmailService {
    constructor(config) {

        const mailOptions = {
            from: this.config.from,
            to: to,
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
```
