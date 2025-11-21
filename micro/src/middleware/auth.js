/**
 * API Key Authentication Middleware
 */
export function apiKeyAuth(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;

    // Check if API key is provided
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key is required. Provide X-API-KEY header.',
        });
    }

    // Validate API key
    if (apiKey !== validApiKey) {
        return res.status(401).json({
            success: false,
            message: 'Invalid API key.',
        });
    }

    // API key is valid, proceed
    next();
}
