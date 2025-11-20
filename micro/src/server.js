import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/index.js';
import { createStorage } from './modules/storage/index.js';
import DeliveryService from './modules/delivery/index.js';
import OTPService from './modules/otp/service.js';
import RateLimiter from './modules/ratelimit/index.js';
import OTPController from './api/controllers/otp.controller.js';
import createOTPRoutes from './api/routes/otp.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import Logger from './utils/logger.js';

/**
 * Initialize and start the OTP microservice
 */
async function startServer() {
    const logger = new Logger(config.logging.level);

    try {
        // Initialize storage
        logger.info('Initializing storage...');
        const storage = await createStorage(config);

        // Initialize delivery service
        logger.info('Initializing delivery services...');
        const deliveryService = new DeliveryService({
            email: { ...config.email, expiryMinutes: config.otp.expiryMinutes },
            sms: config.sms,
        });
        await deliveryService.init();

        // Initialize OTP service
        logger.info('Initializing OTP service...');
        const otpService = new OTPService(storage, deliveryService, config);

        // Initialize rate limiter
        logger.info('Initializing rate limiter...');
        const rateLimiter = new RateLimiter(storage, config);

        // Initialize controller
        const otpController = new OTPController(otpService, rateLimiter, logger);

        // Create Express app
        const app = express();

        // Middleware
        app.use(helmet()); // Security headers
        app.use(cors()); // CORS
        app.use(express.json()); // JSON body parser
        app.use(express.urlencoded({ extended: true })); // URL-encoded body parser
        app.use(morgan('combined')); // HTTP request logging

        // Routes
        app.use('/api/otp', createOTPRoutes(otpController));

        // Error handling
        app.use(notFoundHandler);
        app.use(errorHandler);

        // Start server
        const server = app.listen(config.server.port, config.server.host, () => {
            logger.info(
                `OTP Pipeline Microservice running on http://${config.server.host}:${config.server.port}`
            );
            logger.info(`Environment: ${config.env}`);
            logger.info(`Storage: ${config.redis.useRedis ? 'Redis' : 'Memory'}`);
        });

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            logger.info('SIGTERM signal received, shutting down gracefully...');
            server.close(async () => {
                await storage.disconnect();
                logger.info('Server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', async () => {
            logger.info('SIGINT signal received, shutting down gracefully...');
            server.close(async () => {
                await storage.disconnect();
                logger.info('Server closed');
                process.exit(0);
            });
        });
    } catch (error) {
        logger.error('Failed to start server', error);
        process.exit(1);
    }
}

// Start the server
startServer();
