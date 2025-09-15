# Tamil Word Game Backend

A comprehensive backend API for a Tamil word learning game with three game types: Match the Following, Fill in the Blanks, and Multiple Choice Questions (MCQ).

## Features

- **Three Game Types:**
  - Match the Following (Tamil ↔ English)
  - Fill in the Blanks
  - Multiple Choice Questions (MCQ)

- **User Management:**
  - User registration and authentication
  - JWT-based authentication
  - User statistics and progress tracking

- **Scoring System:**
  - Points based on correctness and speed
  - Streak bonuses
  - Difficulty-based scoring
  - Leaderboard system

- **Word Database:**
  - Comprehensive Tamil word database
  - Categorized by domain (Time, Nature, Culture, etc.)
  - Difficulty levels (Easy, Medium, Hard)
  - Historical periods (Classical/Medieval, Modern, etc.)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the Backend directory:
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/tamil-word-game
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Seed Database
```bash
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Testing

Run the test script to verify all endpoints:
```bash
npm test
```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample Tamil words
- `npm test` - Run API tests

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Game Management
- `POST /api/game/start-game` - Start new game session
- `POST /api/game/submit-answer` - Submit answer for question
- `POST /api/game/complete-game` - Complete game session
- `GET /api/game/history` - Get user's game history
- `GET /api/game/leaderboard` - Get leaderboard
- `GET /api/game/stats` - Get user statistics

### Word Management
- `GET /api/words` - Get all words (with filtering)
- `GET /api/words/:id` - Get word by ID
- `POST /api/words` - Add new word
- `PUT /api/words/:id` - Update word
- `DELETE /api/words/:id` - Delete word (soft delete)
- `POST /api/words/bulk-import` - Bulk import words
- `GET /api/words/stats/overview` - Get word statistics

### Health Check
- `GET /api/health` - API health check

## Database Schema

### Word Schema
```javascript
{
  word: String,           // Tamil word
  meaning_ta: String,     // Tamil meaning
  meaning_en: String,     // English meaning
  domain: String,         // Category (Time, Nature, etc.)
  period: String,         // Historical period
  modern_equivalent: String, // Modern equivalent
  status: String,         // Usage status
  notes: String,          // Additional notes
  difficulty: String,     // Easy/Medium/Hard
  isActive: Boolean       // Active status
}
```

### Game Session Schema
```javascript
{
  userId: ObjectId,       // Reference to user
  gameType: String,       // match/fill_blanks/mcq
  questions: [Question],  // Array of questions
  totalScore: Number,     // Total score
  totalQuestions: Number, // Number of questions
  correctAnswers: Number, // Correct answers count
  timeSpent: Number,      // Time in seconds
  status: String,         // in_progress/completed/abandoned
  domain: String,         // Optional domain filter
  difficulty: String      // Difficulty level
}
```

## Sample Data

The database comes pre-loaded with 20+ Tamil words including:
- Time-related words (நாழிகை, விநாழிகை, முகூர்த்தம்)
- Nature words (மரம், பூ, இலை, வேர்)
- Cultural words (குடும்பம், கோவில்)
- And more...

## Game Logic

### Match the Following
- Randomly presents Tamil words or English meanings
- User matches them with their counterparts
- Simple text-based matching

### Fill in the Blanks
- Presents sentences with missing Tamil words or English meanings
- User fills in the blanks
- Context-based learning

### Multiple Choice Questions
- Presents Tamil words with 4 English meaning options
- Only one correct answer
- Options are randomized

## Scoring System

- **Base Points:** 10 points per correct answer
- **Time Bonus:** Up to 15 bonus points for quick answers (≤30 seconds)
- **Streak Bonus:** Additional points for consecutive correct answers
- **Difficulty Multiplier:** Hard questions give more points

## Error Handling

All endpoints return appropriate HTTP status codes and error messages:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

