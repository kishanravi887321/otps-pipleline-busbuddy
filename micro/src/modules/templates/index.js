/**
 * Email Template Registry
 * Manages and renders email templates with dynamic data
 */
import otpTemplate from './otp.template.js';
import bookingTemplate from './booking.template.js';
import welcomeTemplate from './welcome.template.js';
import customTemplate from './custom.template.js';

const templates = {
    otp: otpTemplate,
    booking: bookingTemplate,
    welcome: welcomeTemplate,
    custom: customTemplate,
};

/**
 * Get template by name
 * @param {string} name - Template name
 * @returns {Function} Template renderer function
 */
export function getTemplate(name) {
    const template = templates[name];

    if (!template) {
        throw new Error(`Template '${name}' not found. Available: ${Object.keys(templates).join(', ')}`);
    }

    return template;
}

/**
 * Render template with data
 * @param {string} templateName - Template name
 * @param {Object} data - Template data
 * @returns {Object} { subject, html }
 */
export function renderTemplate(templateName, data) {
    const template = getTemplate(templateName);
    return template(data);
}

/**
 * List available templates
 * @returns {Array<string>} Template names
 */
export function listTemplates() {
    return Object.keys(templates);
}
