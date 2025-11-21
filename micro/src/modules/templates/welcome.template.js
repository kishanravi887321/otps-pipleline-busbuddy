/**
 * Welcome Email Template
 * @param {Object} data - { userName, companyName }
 * @returns {Object} { subject, html }
 */
export default function welcomeTemplate(data) {
    const { userName = 'User', companyName = 'BusBuddy' } = data;

    const subject = `Welcome to ${companyName}! 🎉`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
        }
        .content {
            padding: 40px 30px;
        }
        .features {
            margin: 30px 0;
        }
        .feature {
            padding: 15px;
            margin: 10px 0;
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            border-radius: 4px;
        }
        .cta-button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 15px 40px;
            border-radius: 5px;
            text-decoration: none;
            margin: 20px 0;
            font-weight: bold;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #888;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome Aboard!</h1>
        </div>
        <div class="content">
            <h2>Hi ${userName}! 👋</h2>
            <p>Welcome to <strong>${companyName}</strong> - your trusted bus booking partner!</p>
            
            <p>We're excited to have you with us. Here's what you can do:</p>
            
            <div class="features">
                <div class="feature">
                    🔍 <strong>Browse Routes:</strong> Explore buses to your favorite destinations
                </div>
                <div class="feature">
                    💺 <strong>Book Seats:</strong> Choose your preferred seats with ease
                </div>
                <div class="feature">
                    📱 <strong>Track Bookings:</strong> Manage all your trips in one place
                </div>
                <div class="feature">
                    🎫 <strong>E-Tickets:</strong> Get instant digital tickets
                </div>
            </div>
            
            <p style="text-align: center;">
                <a href="#" class="cta-button">Start Booking Now →</a>
            </p>
            
            <p style="color: #666; margin-top: 30px;">
                Need help? Our support team is here for you 24/7!
            </p>
        </div>
        <div class="footer">
            <p>© 2025 ${companyName}. All rights reserved.</p>
            <p>Happy Travelling! 🚌</p>
        </div>
    </div>
</body>
</html>
    `;

    return { subject, html };
}
