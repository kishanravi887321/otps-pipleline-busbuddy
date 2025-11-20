import crypto from 'crypto';

/**
 * Generate a cryptographically secure OTP
 * @param {number} length - Length of the OTP
 * @param {boolean} alphanumeric - Whether to include letters (default: false, numbers only)
 * @returns {string} Generated OTP
 */
export function generateOTP(length = 6, alphanumeric = false) {
    if (alphanumeric) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let otp = '';
        const randomBytes = crypto.randomBytes(length);

        for (let i = 0; i < length; i++) {
            otp += chars[randomBytes[i] % chars.length];
        }

        return otp;
    } else {
        // Generate numeric OTP
        const max = Math.pow(10, length);
        const min = Math.pow(10, length - 1);
        const randomNum = crypto.randomInt(min, max);
        return randomNum.toString();
    }
}
