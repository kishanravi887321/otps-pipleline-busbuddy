import express from 'express';

/**
 * Create OTP routes
 * @param {OTPController} otpController - OTP controller instance
 * @returns {express.Router}
 */
export default function createOTPRoutes(otpController) {
    const router = express.Router();

    // Generate OTP
    router.post('/generate', (req, res) => otpController.generate(req, res));

    // Validate OTP
    router.post('/validate', (req, res) => otpController.validate(req, res));

    // Health check
    router.get('/health', (req, res) => otpController.health(req, res));

    return router;
}
