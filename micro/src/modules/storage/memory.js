/**
 * In-memory storage implementation (for development/testing)
 */
class MemoryStorage {
    constructor() {
        this.store = new Map();
        this.timers = new Map();
    }

    /**
     * Set a value with optional TTL
     * @param {string} key - Storage key
     * @param {string} value - Value to store
     * @param {number} ttl - Time to live in seconds
     */
    async set(key, value, ttl) {
        this.store.set(key, value);

        // Clear existing timer if any
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }

        // Set expiry timer
        if (ttl) {
            const timer = setTimeout(() => {
                this.store.delete(key);
                this.timers.delete(key);
            }, ttl * 1000);

            this.timers.set(key, timer);
        }
    }

    /**
     * Get a value
     * @param {string} key - Storage key
     * @returns {Promise<string|null>}
     */
    async get(key) {
        return this.store.get(key) || null;
    }

    /**
     * Delete a value
     * @param {string} key - Storage key
     */
    async delete(key) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
            this.timers.delete(key);
        }
        this.store.delete(key);
    }

    /**
     * Clear all data
     */
    async clear() {
        this.timers.forEach(timer => clearTimeout(timer));
        this.store.clear();
        this.timers.clear();
    }

    /**
     * Check connection (always true for memory storage)
     */
    async connect() {
        return true;
    }

    /**
     * Disconnect (cleanup)
     */
    async disconnect() {
        await this.clear();
    }
}

export default MemoryStorage;
