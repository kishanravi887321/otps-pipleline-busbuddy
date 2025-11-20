import RedisStorage from './redis.js';
import MemoryStorage from './memory.js';

/**
 * Factory function to create appropriate storage instance
 * @param {Object} config - Storage configuration
 * @returns {Promise<RedisStorage|MemoryStorage>}
 */
export async function createStorage(config) {
    if (config.redis.useRedis) {
        const storage = new RedisStorage(config.redis);
        const connected = await storage.connect();

        if (connected) {
            return storage;
        } else {
            console.warn('Redis connection failed, falling back to memory storage');
            return new MemoryStorage();
        }
    } else {
        console.log('Using in-memory storage');
        return new MemoryStorage();
    }
}

export { RedisStorage, MemoryStorage };
