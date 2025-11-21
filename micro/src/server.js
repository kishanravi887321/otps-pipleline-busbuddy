import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/index.js';
import { initializeStorage } from './modules/storage/index.js';
import EmailService from './modules/delivery/email.js';
import RateLimiter from './modules/ratelimit/index.js';
import EmailController from './api/controllers/email.controller.js';
import { initializeRoutes } from './api/routes/email.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Initialize services
let storage;
let emailService;
let rateLimiter;
let emailController;

async function initializeServices() {
    try {
        // Initialize storage (for rate limiting)
        logger.info('Initializing storage...');
        storage = await initializeStorage(config);

        // Initialize email service
        logger.info('Initializing email service...');
        emailService = new EmailService(config.email, logger);
        await emailService.init();

        // Initialize rate limiter
        logger.info('Initializing rate limiter...');
        rateLimiter = new RateLimiter(storage, config.rateLimit, logger);

        // Initialize controller
        emailController = new EmailController(emailService, rateLimiter, logger);

        logger.info('All services initialized successfully');
    } catch (error) {
        logger.error('Failed to initialize services', error);
        process.exit(1);
    }
}

// Routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Email Microservice API',
        version: '1.0.0',
        endpoints: {
            send: 'POST /api/email/send',
            health: 'GET /api/email/health',
        },
    });
});

// API routes
app.use('/api/email', (req, res, next) => {
    const router = initializeRoutes(emailController);
    router(req, res, next);
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});

// Error handler
app.use(errorHandler);

// Start server
async function startServer() {
    await initializeServices();

    const server = app.listen(config.port, config.host, () => {
        logger.info(`🚀 Email service running on http://${config.host}:${config.port}`);
        logger.info(`Environment: ${config.env}`);
        logger.info(`Storage: ${config.redis.useRedis ? 'Redis' : 'Memory'}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
        logger.info(`${signal} received, shutting down gracefully...`);

        server.close(async () => {
            logger.info('HTTP server closed');

            // Close storage connection
            if (storage && storage.disconnect) {
                await storage.disconnect();
            }

            logger.info('Shutdown complete');
            process.exit(0);
        });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

// Start the server
startServer().catch((error) => {
    logger.error('Failed to start server', error);
    process.exit(1);
});

export default app;
