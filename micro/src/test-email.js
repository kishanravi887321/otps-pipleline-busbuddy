import express from 'express';
import { createEmailProvider } from './modules/providers/index.js';
import EmailService from './modules/delivery/email.js';
import { renderTemplate } from './modules/templates/index.js';
import config from './config/index.js';
import logger from './utils/logger.js';

const router = express.Router();

// Test endpoint to send email
router.post('/test-send', async (req, res) => {
    try {
        // Create email provider
        const provider = createEmailProvider(config, logger);
        const emailService = new EmailService(provider, logger);
        await emailService.init();

        // Render OTP template
        const emailContent = renderTemplate('otp', {
            otp: '123456',
            userName: 'Kishan',
            companyName: 'BusBuddy',
            expiryMinutes: 5
        });

        // Send email
        const result = await emailService.send(
            'kishanravi887321@gmail.com',
            emailContent.subject,
            emailContent.html
        );

        res.json({
            success: result.success,
            message: result.message,
            provider: emailService.getProviderName(),
            messageId: result.messageId
        });
    } catch (error) {
        logger.error('Test email failed', { error: error.message });
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
