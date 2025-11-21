import dotenv from 'dotenv';

dotenv.config();

const config = {
    // Environment
    env: process.env.NODE_ENV || 'development',

    // Security
    apiKey: process.env.API_KEY || 'default-api-key-change-in-production',

    // Server
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || 'localhost',

    // Redis
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD,
        useRedis: process.env.USE_REDIS === 'true',
    },

    // Rate Limiting
    rateLimit: {
        windowMinutes: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 10) || 15,
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 5,
    },

    // Email Configuration
    email: {
        provider: process.env.EMAIL_PROVIDER || 'smtp', // smtp, brevo, ses
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.EMAIL_PORT, 10) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        user: process.env.EMAIL_USER || '',
        password: process.env.EMAIL_PASSWORD || '',
        from: process.env.EMAIL_FROM || 'noreply@busbuddy.com',
    },

    // Brevo Configuration
    brevo: {
        apiKey: process.env.BREVO_API_KEY || '',
    },

    // AWS SES Configuration
    ses: {
        region: process.env.AWS_REGION || 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },

    // Logging
    logging: {
        level: process.env.LOG_LEVEL || 'info',
    },
};

export default config;
