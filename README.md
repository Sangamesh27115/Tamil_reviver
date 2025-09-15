# Tamil Word Game - Preserve Ancient Words

A comprehensive application for learning and preserving extinct Tamil words through interactive games.

## 🎯 Features

### For Students
- **Interactive Games**: Match the following, MCQ, and Hints games
- **Points & Rewards**: Earn points and unlock achievements
- **Leaderboard**: Compete with other students
- **Task Management**: Complete assignments from teachers
- **Progress Tracking**: Monitor learning progress

### For Teachers
- **Task Assignment**: Create and assign learning tasks
- **Student Management**: Track student progress and performance
- **Word Requests**: Request new words to be added to the database
- **Analytics**: View detailed performance analytics

### For Admins
- **User Management**: Manage all users (Students, Teachers, Admins)
- **Word Database**: Add, edit, and manage Tamil words
- **System Analytics**: Monitor overall system performance
- **Content Moderation**: Review and approve content

## 🏗️ Architecture

- **Backend**: Node.js + Express + MongoDB
- **Mobile App**: React Native (Capacitor)
- **Web App**: React + Tailwind CSS
- **Database**: MongoDB with comprehensive schemas

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tamil-word-game
   ```

2. **Run setup script**
   ```bash
   node setup.js
   ```

3. **Start all applications**
   ```bash
   node start-all.js
   ```

### Individual Services

- **Backend only**: `node start-backend.js`
- **Mobile App only**: `node start-mobile.js`
- **Web App only**: `node start-web.js`

## 📱 Applications

- **Backend API**: http://localhost:3000/api
- **Mobile App**: http://localhost:3001
- **Web App**: http://localhost:3000

## 🧪 Testing

Run the comprehensive test suite:

```bash
cd Backend
npm run test
```

## 📊 Database Schema

### Users
- **Student**: Basic user with points, level, game history
- **Teacher**: Can assign tasks, manage students
- **Admin**: Full system access

### Words
- Tamil word with meanings, domain, period, difficulty
- Usage statistics and metadata

### Games
- Game sessions with questions and answers
- Scoring and performance tracking

### Tasks
- Teacher-assigned learning tasks
- Student progress tracking

## 🔧 Configuration

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017/tamil-word-game
JWT_SECRET=your-secret-key
PORT=3000
```

### Web App (.env)
```
REACT_APP_API_URL=http://localhost:3000/api
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Games
- `POST /api/game/start` - Start new game
- `POST /api/game/:id/answer` - Submit answer
- `POST /api/game/:id/complete` - Complete game

### Words
- `GET /api/words` - Get words with filters
- `POST /api/words` - Create new word (Admin)
- `GET /api/words/random` - Get random words for games

### Tasks
- `POST /api/tasks` - Create task (Teacher)
- `GET /api/tasks/student` - Get student tasks
- `POST /api/tasks/:id/submit` - Submit task

## 🎮 Game Types

1. **Match the Following**: Match Tamil words with their meanings
2. **MCQ**: Multiple choice questions about word meanings
3. **Hints**: Guess words using provided hints and clues

## 🏆 Scoring System

- **Base Points**: 10 points per correct answer
- **Time Bonus**: Additional points for quick answers
- **Accuracy Bonus**: Bonus based on overall accuracy
- **Level System**: Every 100 points = 1 level up

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Input validation and sanitization

## 📈 Analytics

- User performance tracking
- Game statistics
- Word usage analytics
- System performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Made with ❤️ for preserving Tamil language and culture**
