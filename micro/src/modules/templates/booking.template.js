/**
 * Booking Confirmation Email Template
 * @param {Object} data - Booking details
 * @returns {Object} { subject, html }
 */
export default function bookingTemplate(data) {
    const {
        bookingId,
        userName = 'Customer',
        route,
        date,
        seats,
        price,
        companyName = 'BusBuddy'
    } = data;

    const subject = `Booking Confirmed - ${bookingId}`;

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
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .success-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .content {
            padding: 40px 30px;
        }
        .booking-details {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            color: #666;
            font-weight: 500;
        }
        .value {
            color: #333;
            font-weight: bold;
        }
        .total {
            background: #11998e;
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            font-size: 20px;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #888;
            font-size: 12px;
        }
        .cta-button {
            display: inline-block;
            background: #11998e;
            color: white;
            padding: 12px 30px;
            border-radius: 5px;
            text-decoration: none;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">✅</div>
            <h1>Booking Confirmed!</h1>
            <p>Your journey is booked</p>
        </div>
        <div class="content">
            <h2>Hi ${userName}! 🚌</h2>
            <p>Your booking has been confirmed successfully!</p>
            
            <div class="booking-details">
                <div class="detail-row">
                    <span class="label">Booking ID:</span>
                    <span class="value">${bookingId}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Route:</span>
                    <span class="value">${route}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Date:</span>
                    <span class="value">${date}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Seats:</span>
                    <span class="value">${seats}</span>
                </div>
            </div>
            
            <div class="total">
                <strong>Total Amount: ${price}</strong>
            </div>
            
            <p style="text-align: center;">
                <a href="#" class="cta-button">View Booking Details</a>
            </p>
            
            <p style="color: #666; font-size: 14px;">
                📧 Keep this email for your records.<br>
                🎫 Show your booking ID at the boarding point.
            </p>
        </div>
        <div class="footer">
            <p>© 2025 ${companyName}. All rights reserved.</p>
            <p>Travel safe! 🚌</p>
        </div>
    </div>
</body>
</html>
    `;

    return { subject, html };
}
