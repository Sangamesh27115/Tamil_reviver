# Tamil Reviver - Deployment Guide

## Prerequisites
1. Docker and Docker Compose installed
2. MongoDB (if not using Docker)
3. Node.js 18+ (if running without Docker)

## Environment Setup
1. Copy `.env.example` to `.env`
2. Update the environment variables:
   - Set strong `JWT_SECRET`
   - Configure `MONGO_URL`
   - Set proper `WEB_URL` and `MOBILE_URL` for CORS
   - Update Cloudinary credentials if using image uploads

## Deployment Steps

### Using Docker (Recommended)
1. Build and run the containers:
   ```bash
   docker-compose up --build -d
   ```

2. Check the logs:
   ```bash
   docker-compose logs -f
   ```

3. Stop the services:
   ```bash
   docker-compose down
   ```

### Manual Deployment
1. Install dependencies:
   ```bash
   npm install --production
   ```

2. Start the server:
   ```bash
   npm start
   ```

## API Routes

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile
- PUT /api/auth/profile - Update profile

### Game Routes
- POST /api/game/start - Start new game
- POST /api/game/:sessionId/answer - Submit answer
- POST /api/game/:sessionId/hint - Get hint (hints game)
- GET /api/game/leaderboard - Get leaderboard
- GET /api/game/history - Get user's game history

### Teacher Routes
- POST /api/tasks - Create new task
- GET /api/tasks/teacher - Get teacher's tasks
- PUT /api/tasks/:taskId - Update task
- GET /api/tasks/:taskId/stats - Get task statistics

### Admin Routes
- POST /api/words - Add new word
- PUT /api/words/:id - Update word
- DELETE /api/words/:id - Delete word
- GET /api/words/stats - Get word statistics

## Health Check
- GET /api/health - Check API status

## Security
- Rate limiting enabled
- Security headers with Helmet
- CORS configured
- MongoDB indexes optimized
- Input validation implemented

## Monitoring
- API health endpoint
- MongoDB connection monitoring
- Error logging
- Request logging with Morgan

## Backup
Remember to regularly backup the MongoDB database:
```bash
docker exec -it mongodb mongodump --out /backup
```