/**
 * Validation utilities
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format (basic)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export function isValidPhone(phone) {
    // Basic phone validation - accepts +, digits, spaces, hyphens
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
}

/**
 * Sanitize input string
 * @param {string} input - Input to sanitize
 * @returns {string}
 */
export function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>]/g, '');
}
