/**
 * Rate limiter using sliding window algorithm
 */
class RateLimiter {
    constructor(storage, config) {
        this.storage = storage;
        this.windowMinutes = config.rateLimit.windowMinutes;
        this.maxRequests = config.rateLimit.maxRequests;
    }

    /**
     * Check if request is allowed for the given identifier
     * @param {string} identifier - User identifier (email, phone, or IP)
     * @param {string} action - Action type (e.g., 'generate', 'validate')
     * @returns {Promise<{allowed: boolean, remaining: number}>}
     */
    async checkLimit(identifier, action = 'generate') {
        const key = `ratelimit:${action}:${identifier}`;
        const now = Date.now();
        const windowMs = this.windowMinutes * 60 * 1000;
        const windowStart = now - windowMs;

        // Get existing requests
        const data = await this.storage.get(key);
        let requests = data ? JSON.parse(data) : [];

        // Filter requests within the current window
        requests = requests.filter(timestamp => timestamp > windowStart);

        // Check if limit exceeded
        if (requests.length >= this.maxRequests) {
            return {
                allowed: false,
                remaining: 0,
            };
        }

        // Add current request
        requests.push(now);
        await this.storage.set(key, JSON.stringify(requests), this.windowMinutes * 60);

        return {
            allowed: true,
            remaining: this.maxRequests - requests.length,
        };
    }

    /**
     * Get current request count for identifier
     * @param {string} identifier - User identifier
     * @param {string} action - Action type
     * @returns {Promise<number>}
     */
    async getCount(identifier, action = 'generate') {
        const key = `ratelimit:${action}:${identifier}`;
        const now = Date.now();
        const windowMs = this.windowMinutes * 60 * 1000;
        const windowStart = now - windowMs;

        const data = await this.storage.get(key);
        if (!data) return 0;

        const requests = JSON.parse(data);
        return requests.filter(timestamp => timestamp > windowStart).length;
    }
}

export default RateLimiter;
