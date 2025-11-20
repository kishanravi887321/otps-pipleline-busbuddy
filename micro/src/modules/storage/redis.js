import redis from 'redis';

/**
 * Redis storage implementation
 */
class RedisStorage {
    constructor(config) {
        this.config = config;
        this.client = null;
    }

    /**
     * Connect to Redis
     */
    async connect() {
        try {
            this.client = redis.createClient({
                socket: {
                    host: this.config.host,
                    port: this.config.port,
                },
                password: this.config.password,
            });

            this.client.on('error', (err) => {
                console.error('Redis Client Error:', err);
            });

            await this.client.connect();
            console.log('Connected to Redis');
            return true;
        } catch (error) {
            console.error('Failed to connect to Redis:', error.message);
            return false;
        }
    }

    /**
     * Set a value with optional TTL
     * @param {string} key - Storage key
     * @param {string} value - Value to store
     * @param {number} ttl - Time to live in seconds
     */
    async set(key, value, ttl) {
        if (!this.client) {
            throw new Error('Redis client not connected');
        }

        if (ttl) {
            await this.client.setEx(key, ttl, value);
        } else {
            await this.client.set(key, value);
        }
    }

    /**
     * Get a value
     * @param {string} key - Storage key
     * @returns {Promise<string|null>}
     */
    async get(key) {
        if (!this.client) {
            throw new Error('Redis client not connected');
        }
        return await this.client.get(key);
    }

    /**
     * Delete a value
     * @param {string} key - Storage key
     */
    async delete(key) {
        if (!this.client) {
            throw new Error('Redis client not connected');
        }
        await this.client.del(key);
    }

    /**
     * Disconnect from Redis
     */
    async disconnect() {
        if (this.client) {
            await this.client.quit();
            console.log('Disconnected from Redis');
        }
    }
}

export default RedisStorage;
