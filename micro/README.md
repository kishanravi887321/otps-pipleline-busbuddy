# OTP Pipeline Microservice

A modular and scalable OTP (One-Time Password) pipeline microservice built with Node.js and Express using ES Modules. This service handles OTP generation, validation, and delivery through multiple channels (email/SMS) with built-in rate limiting and caching.

## Features

- 🔐 **Secure OTP Generation**: Cryptographically secure random OTP generation
- 📧 **Multi-Channel Delivery**: Email and SMS support (SMS ready for integration)
- ⚡ **Rate Limiting**: Sliding window rate limiting to prevent abuse
- 💾 **Flexible Storage**: Redis for production, in-memory for development
- 🔄 **Automatic Expiry**: Configurable OTP expiration and cleanup
- 🛡️ **Security**: Helmet.js security headers, CORS support
- 📊 **Logging**: Structured logging with configurable levels
- 🎯 **Attempt Limiting**: Configurable maximum validation attempts
- 🚀 **Production Ready**: Graceful shutdown, error handling
- ⚙️ **ES Modules**: Modern JavaScript with import/export syntax

## Project Structure

```
micro/  (microservice root)
├── src/
│   ├── config/              # Configuration management
│   │   └── index.js
│   ├── modules/             # Core business logic
│   │   ├── otp/            # OTP generation & validation
│   │   │   ├── generator.js
│   │   │   ├── validator.js
│   │   │   └── service.js
│   │   ├── storage/        # Storage abstraction
│   │   │   ├── redis.js
│   │   │   ├── memory.js
│   │   │   └── index.js
│   │   ├── delivery/       # Delivery services
│   │   │   ├── email.js
│   │   │   ├── sms.js
│   │   │   └── index.js
│   │   └── ratelimit/      # Rate limiting
│   │       └── index.js
│   ├── api/                # API layer
│   │   ├── controllers/
│   │   │   └── otp.controller.js
│   │   └── routes/
│   │       └── otp.routes.js
│   ├── middleware/         # Express middleware
│   │   └── errorHandler.js
│   ├── utils/              # Utilities
│   │   ├── logger.js
│   │   └── validation.js
│   └── server.js           # Application entry point
├── .env.example            # Environment template
├── .gitignore
├── package.json
└── README.md
```

## Installation

1. **Navigate to the micro directory**

```bash
cd micro
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=3000
HOST=localhost

# Use Redis (set to true for production)
USE_REDIS=false
REDIS_HOST=localhost
REDIS_PORT=6379

# OTP Configuration
OTP_LENGTH=6
OTP_EXPIRY_MINUTES=5
OTP_MAX_ATTEMPTS=3

# Rate Limiting
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=5

# Email (use Ethereal for testing)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your-email@ethereal.email
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@otpservice.com
```

### Setting up Email (Ethereal for Testing)

For development, use [Ethereal Email](https://ethereal.email/):

1. Visit https://ethereal.email/
2. Click "Create Ethereal Account"
3. Copy the SMTP credentials to your `.env` file
4. View sent emails in the Ethereal inbox

## Usage

### Development Mode

```bash
npm run dev
```

This starts the server with nodemon for auto-restart on file changes.

### Production Mode

```bash
npm start
```

## API Endpoints

### 1. Generate OTP

**POST** `/api/otp/generate`

Generate and send an OTP to the specified identifier.

**Request Body:**
```json
{
  "identifier": "user@example.com",
  "channel": "email"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully via email",
  "remaining": 4
}
```

### 2. Validate OTP

**POST** `/api/otp/validate`

Validate an OTP against the stored value.

**Request Body:**
```json
{
  "identifier": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP validated successfully"
}
```

### 3. Health Check

**GET** `/api/otp/health`

Check if the service is running.

**Response:**
```json
{
  "success": true,
  "message": "OTP service is running",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

## Configuration

All configuration is managed through environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `HOST` | Server host | localhost |
| `USE_REDIS` | Use Redis for storage | false |
| `REDIS_HOST` | Redis hostname | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `OTP_LENGTH` | OTP length | 6 |
| `OTP_EXPIRY_MINUTES` | OTP expiry time | 5 |
| `OTP_MAX_ATTEMPTS` | Max validation attempts | 3 |
| `RATE_LIMIT_WINDOW_MINUTES` | Rate limit window | 15 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 5 |
| `EMAIL_HOST` | SMTP host | smtp.ethereal.email |
| `EMAIL_PORT` | SMTP port | 587 |
| `EMAIL_USER` | SMTP username | - |
| `EMAIL_PASSWORD` | SMTP password | - |
| `EMAIL_FROM` | From email address | noreply@otpservice.com |

## Testing

### Manual Testing with cURL

**Generate OTP:**
```bash
curl -X POST http://localhost:3000/api/otp/generate \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","channel":"email"}'
```

**Validate OTP:**
```bash
curl -X POST http://localhost:3000/api/otp/validate \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","otp":"123456"}'
```

**Health Check:**
```bash
curl http://localhost:3000/api/otp/health
```

## Production Deployment

For production deployment:

1. **Set up Redis**
```bash
# Install Redis (Ubuntu/Debian)
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis
```

2. **Update environment variables**
```env
NODE_ENV=production
USE_REDIS=true
REDIS_HOST=your-redis-host
REDIS_PORT=6379
```

3. **Configure email provider**

Update email settings with your production SMTP provider (SendGrid, AWS SES, etc.)

4. **Start the service**
```bash
npm start
```

Consider using PM2 for process management:
```bash
npm install -g pm2
pm2 start src/server.js --name otp-service
```

## Architecture

### Modular Design

The service is built with a modular architecture:

- **Config Layer**: Centralized configuration management
- **Storage Layer**: Abstracted storage (Redis/Memory) with same interface
- **OTP Module**: Generation and validation logic
- **Delivery Module**: Multi-channel delivery (email/SMS)
- **Rate Limit Module**: Sliding window rate limiting
- **API Layer**: RESTful API with Express
- **Middleware**: Validation, error handling, security

### Scalability

- **Horizontal Scaling**: Stateless design allows multiple instances
- **Redis Backend**: Shared state across instances
- **Rate Limiting**: Per-user rate limiting prevents abuse
- **Graceful Shutdown**: Proper cleanup on termination

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
