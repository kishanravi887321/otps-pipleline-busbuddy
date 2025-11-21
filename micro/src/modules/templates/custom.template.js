/**
 * Custom Email Template
 * For sending custom HTML emails
 * @param {Object} data - { htmlContent, subject }
 * @returns {Object} { subject, html }
 */
export default function customTemplate(data) {
    const { htmlContent, subject = 'Custom Email' } = data;

    return { subject, html: htmlContent };
}
