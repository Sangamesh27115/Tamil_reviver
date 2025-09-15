# Tamil Word Game API Documentation

## Overview
This is a comprehensive backend API for a Tamil word learning game with three game types: Match the Following, Fill in the Blanks, and Multiple Choice Questions (MCQ).

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
```
**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login User
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

### Game Routes (`/api/game`)

#### Start New Game
```http
POST /api/game/start-game
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "gameType": "match|fill_blanks|mcq",
  "totalQuestions": 10,
  "domain": "Time|Measurement|Nature|Culture|Food|Clothing|Architecture|Other",
  "difficulty": "Easy|Medium|Hard|Mixed"
}
```

**Response:**
```json
{
  "sessionId": "string",
  "gameType": "string",
  "totalQuestions": 10,
  "questions": [
    {
      "questionId": "string",
      "question": "string",
      "options": ["string"], // For MCQ only
      "wordId": "string"
    }
  ]
}
```

#### Submit Answer
```http
POST /api/game/submit-answer
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "sessionId": "string",
  "questionId": "string",
  "answer": "string",
  "timeSpent": 15
}
```

**Response:**
```json
{
  "isCorrect": true,
  "points": 12,
  "correctAnswer": "string",
  "explanation": "string"
}
```

#### Complete Game
```http
POST /api/game/complete-game
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "sessionId": "string"
}
```

**Response:**
```json
{
  "sessionId": "string",
  "totalScore": 85,
  "correctAnswers": 8,
  "totalQuestions": 10,
  "accuracy": "80.00",
  "timeSpent": 120
}
```

#### Get Game History
```http
GET /api/game/history?page=1&limit=10&gameType=match
```
**Headers:** `Authorization: Bearer <token>`

#### Get Leaderboard
```http
GET /api/game/leaderboard?limit=10
```

#### Get User Statistics
```http
GET /api/game/stats
```
**Headers:** `Authorization: Bearer <token>`

### Word Management Routes (`/api/words`)

#### Get All Words
```http
GET /api/words?page=1&limit=20&domain=Time&difficulty=Easy&search=நாழிகை
```

#### Get Word by ID
```http
GET /api/words/:id
```

#### Add New Word
```http
POST /api/words
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "word": "string",
  "meaning_ta": "string",
  "meaning_en": "string",
  "domain": "string",
  "period": "string",
  "modern_equivalent": "string",
  "status": "string",
  "notes": "string",
  "difficulty": "Easy|Medium|Hard"
}
```

#### Update Word
```http
PUT /api/words/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Delete Word (Soft Delete)
```http
DELETE /api/words/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Bulk Import Words
```http
POST /api/words/bulk-import
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "words": [
    {
      "word": "string",
      "meaning_ta": "string",
      "meaning_en": "string",
      "domain": "string",
      "period": "string",
      "modern_equivalent": "string",
      "status": "string",
      "notes": "string",
      "difficulty": "string"
    }
  ]
}
```

#### Get Word Statistics
```http
GET /api/words/stats/overview
```

### Health Check
```http
GET /api/health
```

## Game Types

### 1. Match the Following
- Match Tamil words with English meanings
- Match English meanings with Tamil words
- Simple text-based matching

### 2. Fill in the Blanks
- Complete sentences with missing Tamil words or English meanings
- Context-based learning

### 3. Multiple Choice Questions (MCQ)
- Choose correct English meaning for Tamil words
- 4 options with 1 correct answer
- Randomized options

## Scoring System

- **Base Points:** 10 points per correct answer
- **Time Bonus:** Up to 15 bonus points for quick answers (30 seconds or less)
- **Streak Bonus:** Additional points for consecutive correct answers
- **Difficulty Multiplier:** Hard questions give more points

## Database Schema

### Word Schema
```javascript
{
  word: String (required, unique),
  meaning_ta: String (required),
  meaning_en: String (required),
  domain: String (required, enum),
  period: String (required, enum),
  modern_equivalent: String (required),
  status: String (required),
  notes: String,
  difficulty: String (enum: Easy|Medium|Hard),
  isActive: Boolean (default: true)
}
```

### Game Session Schema
```javascript
{
  userId: ObjectId (ref: Student),
  gameType: String (enum: match|fill_blanks|mcq),
  questions: [QuestionSchema],
  totalScore: Number,
  totalQuestions: Number,
  correctAnswers: Number,
  timeSpent: Number,
  status: String (enum: in_progress|completed|abandoned),
  domain: String,
  difficulty: String
}
```

### User Stats Schema
```javascript
{
  userId: ObjectId (ref: Student),
  totalPoints: Number,
  totalGamesPlayed: Number,
  totalQuestionsAnswered: Number,
  totalCorrectAnswers: Number,
  averageScore: Number,
  bestStreak: Number,
  currentStreak: Number,
  gameTypeStats: Object,
  domainStats: Object,
  achievements: Array,
  level: Number,
  experience: Number
}
```

## Environment Variables

Create a `.env` file in the Backend directory:

```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/tamil-word-game
JWT_SECRET=your-secret-key-here
```

## Setup Instructions

1. Install dependencies:
```bash
cd Backend
npm install
```

2. Set up environment variables in `.env` file

3. Start MongoDB service

4. Seed the database with sample data:
```bash
node src/scripts/seedDatabase.js
```

5. Start the development server:
```bash
npm run dev
```

## Sample Data

The API comes with 20 sample Tamil words covering different domains:
- Time-related words (நாழிகை, விநாழிகை, முகூர்த்தம்)
- Nature words (மரம், பூ, இலை)
- Cultural words (குடும்பம், கோவில்)
- And more...

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include a message field:
```json
{
  "message": "Error description"
}
```

