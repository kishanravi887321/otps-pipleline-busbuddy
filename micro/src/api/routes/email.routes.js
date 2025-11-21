import express from 'express';
import { apiKeyAuth } from '../../middleware/auth.js';

const router = express.Router();

/**
 * Initialize routes with controller
 * @param {EmailController} controller - Email controller instance
 */
export function initializeRoutes(controller) {
    // Apply API key authentication to all routes
    router.use(apiKeyAuth);

    // Send email with template
    router.post('/send', (req, res) => controller.send(req, res));

    // Health check
    router.get('/health', (req, res) => controller.health(req, res));

    return router;
}

export default router;
