/**
 * OTP Email Template
 * @param {Object} data - { otp, userName, companyName, expiryMinutes }
 * @returns {Object} { subject, html }
 */
export default function otpTemplate(data) {
    const { otp, userName = 'User', companyName = 'BusBuddy', expiryMinutes = 5 } = data;

    const subject = `Your ${companyName} Verification Code`;

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
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 40px 30px;
        }
        .otp-box {
            background: #f8f9fa;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        .info {
            color: #666;
            font-size: 14px;
            margin-top: 10px;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #888;
            font-size: 12px;
        }
        .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            color: #856404;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚌 ${companyName}</h1>
        </div>
        <div class="content">
            <h2>Hi ${userName}! 👋</h2>
            <p>You requested a verification code. Here it is:</p>
            
            <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="info">Expires in ${expiryMinutes} minutes</div>
            </div>
            
            <p>Enter this code to complete your verification.</p>
            
            <div class="warning">
                ⚠️ <strong>Security Notice:</strong> Never share this code with anyone. ${companyName} will never ask for your OTP.
            </div>
            
            <p>If you didn't request this code, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>© 2025 ${companyName}. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>
    `;

    return { subject, html };
}
