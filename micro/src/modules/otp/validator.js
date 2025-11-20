/**
 * Validate OTP against stored value
 * @param {Object} storage - Storage instance
 * @param {string} identifier - User identifier (email/phone)
 * @param {string} otp - OTP to validate
 * @param {number} maxAttempts - Maximum validation attempts allowed
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function validateOTP(storage, identifier, otp, maxAttempts = 3) {
    const key = `otp:${identifier}`;
    const attemptsKey = `otp:attempts:${identifier}`;

    // Check if OTP exists
    const storedData = await storage.get(key);
    if (!storedData) {
        return {
            success: false,
            message: 'OTP not found or expired',
        };
    }

    const { otp: storedOTP, expiresAt } = JSON.parse(storedData);

    // Check expiry
    if (Date.now() > expiresAt) {
        await storage.delete(key);
        await storage.delete(attemptsKey);
        return {
            success: false,
            message: 'OTP has expired',
        };
    }

    // Check attempts
    const attemptsData = await storage.get(attemptsKey);
    const attempts = attemptsData ? parseInt(attemptsData, 10) : 0;

    if (attempts >= maxAttempts) {
        await storage.delete(key);
        await storage.delete(attemptsKey);
        return {
            success: false,
            message: 'Maximum validation attempts exceeded',
        };
    }

    // Validate OTP
    if (otp === storedOTP) {
        // Success - cleanup
        await storage.delete(key);
        await storage.delete(attemptsKey);
        return {
            success: true,
            message: 'OTP validated successfully',
        };
    } else {
        // Increment attempts
        await storage.set(attemptsKey, (attempts + 1).toString(), 300); // 5 min TTL
        return {
            success: false,
            message: `Invalid OTP. ${maxAttempts - attempts - 1} attempts remaining`,
        };
    }
}
