const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Tamil Word Game Application...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js version: ${nodeVersion}`);
} catch (error) {
  console.log('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Check if MongoDB is running
try {
  execSync('mongosh --version', { encoding: 'utf8' });
  console.log('✅ MongoDB is available');
} catch (error) {
  console.log('⚠️  MongoDB might not be installed or running. Please ensure MongoDB is running.');
}

// Create .env file for backend
const backendEnvPath = path.join(__dirname, 'Backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
  const envContent = `# Database
MONGO_URL=mongodb://localhost:27017/tamil-word-game

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=3000
NODE_ENV=development

# API
API_URL=http://localhost:3000/api
`;
  
  fs.writeFileSync(backendEnvPath, envContent);
  console.log('✅ Created Backend/.env file');
} else {
  console.log('✅ Backend/.env file already exists');
}

// Create .env file for web app
const webEnvPath = path.join(__dirname, 'Web', '.env');
if (!fs.existsSync(webEnvPath)) {
  const envContent = `# API Configuration
REACT_APP_API_URL=http://localhost:3000/api

# App Configuration
REACT_APP_NAME=Tamil Word Game
REACT_APP_VERSION=1.0.0
`;
  
  fs.writeFileSync(webEnvPath, envContent);
  console.log('✅ Created Web/.env file');
} else {
  console.log('✅ Web/.env file already exists');
}

// Install backend dependencies
console.log('\n📦 Installing Backend dependencies...');
try {
  process.chdir(path.join(__dirname, 'Backend'));
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.log('❌ Failed to install backend dependencies:', error.message);
}

// Install mobile app dependencies
console.log('\n📱 Installing Mobile App dependencies...');
try {
  process.chdir(path.join(__dirname, 'Mobile'));
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Mobile App dependencies installed');
} catch (error) {
  console.log('❌ Failed to install mobile app dependencies:', error.message);
}

// Install web app dependencies
console.log('\n🌐 Installing Web App dependencies...');
try {
  process.chdir(path.join(__dirname, 'Web'));
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Web App dependencies installed');
} catch (error) {
  console.log('❌ Failed to install web app dependencies:', error.message);
}

// Create run scripts
const runScripts = {
  'start-backend.js': `
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Backend Server...');
const backend = spawn('node', ['src/index.js'], {
  cwd: path.join(__dirname, 'Backend'),
  stdio: 'inherit',
  shell: true
});

backend.on('error', (err) => {
  console.error('Backend error:', err);
});

process.on('SIGINT', () => {
  console.log('\\n🛑 Stopping Backend Server...');
  backend.kill();
  process.exit(0);
});
`,

  'start-mobile.js': `
const { spawn } = require('child_process');
const path = require('path');

console.log('📱 Starting Mobile App...');
const mobile = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'Mobile'),
  stdio: 'inherit',
  shell: true
});

mobile.on('error', (err) => {
  console.error('Mobile app error:', err);
});

process.on('SIGINT', () => {
  console.log('\\n🛑 Stopping Mobile App...');
  mobile.kill();
  process.exit(0);
});
`,

  'start-web.js': `
const { spawn } = require('child_process');
const path = require('path');

console.log('🌐 Starting Web App...');
const web = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'Web'),
  stdio: 'inherit',
  shell: true
});

web.on('error', (err) => {
  console.error('Web app error:', err);
});

process.on('SIGINT', () => {
  console.log('\\n🛑 Stopping Web App...');
  web.kill();
  process.exit(0);
});
`,

  'start-all.js': `
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Tamil Word Game Application...\\n');

// Start Backend
console.log('📡 Starting Backend Server...');
const backend = spawn('node', ['src/index.js'], {
  cwd: path.join(__dirname, 'Backend'),
  stdio: 'pipe',
  shell: true
});

backend.stdout.on('data', (data) => {
  console.log(\`[Backend] \${data.toString().trim()}\`);
});

backend.stderr.on('data', (data) => {
  console.error(\`[Backend Error] \${data.toString().trim()}\`);
});

// Start Mobile App
setTimeout(() => {
  console.log('\\n📱 Starting Mobile App...');
  const mobile = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'Mobile'),
    stdio: 'pipe',
    shell: true
  });

  mobile.stdout.on('data', (data) => {
    console.log(\`[Mobile] \${data.toString().trim()}\`);
  });

  mobile.stderr.on('data', (data) => {
    console.error(\`[Mobile Error] \${data.toString().trim()}\`);
  });
}, 3000);

// Start Web App
setTimeout(() => {
  console.log('\\n🌐 Starting Web App...');
  const web = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'Web'),
    stdio: 'pipe',
    shell: true
  });

  web.stdout.on('data', (data) => {
    console.log(\`[Web] \${data.toString().trim()}\`);
  });

  web.stderr.on('data', (data) => {
    console.error(\`[Web Error] \${data.toString().trim()}\`);
  });
}, 6000);

process.on('SIGINT', () => {
  console.log('\\n🛑 Stopping all applications...');
  backend.kill();
  process.exit(0);
});
`
};

// Write run scripts
for (const [filename, content] of Object.entries(runScripts)) {
  fs.writeFileSync(path.join(__dirname, filename), content);
  console.log(`✅ Created ${filename}`);
}

// Create README
const readmeContent = `# Tamil Word Game - Preserve Ancient Words

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
   \`\`\`bash
   git clone <repository-url>
   cd tamil-word-game
   \`\`\`

2. **Run setup script**
   \`\`\`bash
   node setup.js
   \`\`\`

3. **Start all applications**
   \`\`\`bash
   node start-all.js
   \`\`\`

### Individual Services

- **Backend only**: \`node start-backend.js\`
- **Mobile App only**: \`node start-mobile.js\`
- **Web App only**: \`node start-web.js\`

## 📱 Applications

- **Backend API**: http://localhost:3000/api
- **Mobile App**: http://localhost:3001
- **Web App**: http://localhost:3000

## 🧪 Testing

Run the comprehensive test suite:

\`\`\`bash
cd Backend
npm run test
\`\`\`

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
\`\`\`
MONGO_URL=mongodb://localhost:27017/tamil-word-game
JWT_SECRET=your-secret-key
PORT=3000
\`\`\`

### Web App (.env)
\`\`\`
REACT_APP_API_URL=http://localhost:3000/api
\`\`\`

## 📚 API Documentation

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - Login user
- \`GET /api/auth/profile\` - Get user profile

### Games
- \`POST /api/game/start\` - Start new game
- \`POST /api/game/:id/answer\` - Submit answer
- \`POST /api/game/:id/complete\` - Complete game

### Words
- \`GET /api/words\` - Get words with filters
- \`POST /api/words\` - Create new word (Admin)
- \`GET /api/words/random\` - Get random words for games

### Tasks
- \`POST /api/tasks\` - Create task (Teacher)
- \`GET /api/tasks/student\` - Get student tasks
- \`POST /api/tasks/:id/submit\` - Submit task

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
`;

fs.writeFileSync(path.join(__dirname, 'README.md'), readmeContent);
console.log('✅ Created README.md');

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Ensure MongoDB is running');
console.log('2. Run: node start-all.js');
console.log('3. Open http://localhost:3000 for Web App');
console.log('4. Open http://localhost:3001 for Mobile App');
console.log('5. API available at http://localhost:3000/api');
console.log('\n🧪 To test the API:');
console.log('cd Backend && npm run test');
console.log('\n📚 Check README.md for detailed documentation');
