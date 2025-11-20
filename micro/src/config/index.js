import dotenv from 'dotenv';

dotenv.config();

const config = {
    env: process.env.NODE_ENV || 'development',
    server: {
        port: parseInt(process.env.PORT || '3000', 10),
        host: process.env.HOST || 'localhost',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD,
        useRedis: process.env.USE_REDIS === 'true',
    },
    otp: {
        length: parseInt(process.env.OTP_LENGTH || '6', 10),
        expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10),
        maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10),
    },
    rateLimit: {
        windowMinutes: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10),
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10),
    },
    email: {
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: process.env.EMAIL_SECURE === 'true',
        user: process.env.EMAIL_USER || '',
        password: process.env.EMAIL_PASSWORD || '',
        from: process.env.EMAIL_FROM || 'noreply@otpservice.com',
    },
    sms: {
        provider: process.env.SMS_PROVIDER || 'mock',
        apiKey: process.env.SMS_API_KEY,
        apiSecret: process.env.SMS_API_SECRET,
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
    },
};

export default config;
