/**
 * Logger utility for structured logging
 */
class Logger {
    constructor(level = 'info') {
        this.level = level;
        this.levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3,
        };
    }

    /**
     * Log an info message
     */
    info(message, meta = {}) {
        if (this.levels[this.level] >= this.levels.info) {
            console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta);
        }
    }

    /**
     * Log a warning message
     */
    warn(message, meta = {}) {
        if (this.levels[this.level] >= this.levels.warn) {
            console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta);
        }
    }

    /**
     * Log an error message
     */
    error(message, error = {}) {
        if (this.levels[this.level] >= this.levels.error) {
            console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
        }
    }

    /**
     * Log a debug message
     */
    debug(message, meta = {}) {
        if (this.levels[this.level] >= this.levels.debug) {
            console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta);
        }
    }
}

// Create and export logger instance
const logger = new Logger(process.env.LOG_LEVEL || 'info');

export default logger;
