# Tamil Word Game Mobile App

A beautiful and interactive mobile web app for learning Tamil words through engaging games.

## Features

### 🎮 Three Game Types
- **Match the Following**: Match Tamil words with English meanings
- **Fill in the Blanks**: Complete sentences with missing words
- **Multiple Choice Questions (MCQ)**: Choose correct answers from options

### 📊 User Features
- **User Authentication**: Register and login system
- **Progress Tracking**: Real-time statistics and scoring
- **Leaderboard**: Compete with other players
- **Game History**: Track your learning journey
- **Responsive Design**: Works on mobile and desktop

### 🎯 Game Features
- **Random Questions**: Each game session has different questions
- **Time-based Scoring**: Earn bonus points for quick answers
- **Difficulty Levels**: Easy, Medium, Hard, and Mixed
- **Domain Filtering**: Focus on specific word categories
- **Real-time Feedback**: Instant results and explanations

## Technology Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Styled Components + CSS
- **Animations**: Framer Motion
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API running on port 3000

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3001`

### Environment Variables

Create a `.env` file in the Mobile directory:
```env
REACT_APP_API_URL=http://localhost:3000/api
```

## App Structure

```
src/
├── components/
│   ├── games/
│   │   ├── MatchGame.js          # Match the following game
│   │   ├── FillBlanksGame.js     # Fill in the blanks game
│   │   ├── MCQGame.js            # Multiple choice game
│   │   └── GameResult.js         # Game completion screen
│   ├── LoadingScreen.js          # Loading component
│   └── Navigation.js             # Navigation bar
├── contexts/
│   ├── AuthContext.js            # Authentication state
│   └── GameContext.js            # Game state management
├── pages/
│   ├── Dashboard.js              # Main dashboard
│   ├── GameSelection.js          # Game type selection
│   ├── Game.js                   # Main game screen
│   ├── Login.js                  # Login page
│   ├── Register.js               # Registration page
│   ├── Profile.js                # User profile
│   ├── Leaderboard.js            # Leaderboard
│   └── Rewards.js                # Rewards page
├── services/
│   └── api.js                    # API service functions
└── App.js                        # Main app component
```

## Game Flow

1. **Login/Register**: User authentication
2. **Dashboard**: View stats and quick actions
3. **Game Selection**: Choose game type and configuration
4. **Game Play**: Answer questions with real-time feedback
5. **Results**: View score and performance
6. **Progress**: Track learning journey

## API Integration

The app connects to the Tamil Word Game Backend API:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Games**: `/api/game/start-game`, `/api/game/submit-answer`
- **Statistics**: `/api/game/stats`, `/api/game/leaderboard`
- **Words**: `/api/words` (for word management)

## Tamil Language Support

- **Bilingual Interface**: Tamil and English text
- **Tamil Fonts**: Proper rendering of Tamil characters
- **Cultural Context**: Tamil-specific word categories
- **Learning Focus**: Traditional Tamil words and meanings

## Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Touch Friendly**: Large buttons and touch targets
- **Adaptive Layout**: Works on phones, tablets, and desktops
- **Progressive Web App**: Can be installed on mobile devices

## Performance Features

- **Lazy Loading**: Components load as needed
- **Optimized Animations**: Smooth 60fps animations
- **Efficient State Management**: Minimal re-renders
- **Caching**: API responses cached for better performance

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Component Structure**: Functional components with hooks
- **Styling**: Styled Components for component-scoped styles

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify/Vercel

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please contact the development team.

---

**Happy Learning Tamil Words! வணக்கம்!** 🎉