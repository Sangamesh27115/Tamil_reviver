import axios from 'axios';
import dotenv from 'dotenv/config';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Test data
const testUsers = {
  student: {
    username: 'TestStudent',
    email: 'student@test.com',
    password: 'password123',
    role: 'Student'
  },
  teacher: {
    username: 'TestTeacher',
    email: 'teacher@test.com',
    password: 'password123',
    role: 'Teacher',
    teacherId: 'TEA-2024-0001',
    subjects: ['Tamil', 'History']
  },
  admin: {
    username: 'TestAdmin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'Admin',
    adminLevel: 'Super Admin',
    permissions: ['manage_users', 'manage_words', 'manage_content', 'view_analytics', 'manage_teachers']
  }
};

const testWords = [
  {
    word: 'படி',
    meaning_ta: 'அளவுக் குடுவை (கோரையால்/மரத்தால்)',
    meaning_en: 'Padi: dry/volume measure',
    domain: 'Volume',
    period: 'Classical/Medieval',
    modern_equivalent: 'லிட்டர்',
    status: 'traditional; still seen rurally',
    notes: '2 உறி = 1 படி',
    difficulty: 'Medium'
  },
  {
    word: 'உறி',
    meaning_ta: 'அளவுக் குடுவை',
    meaning_en: 'Uri: dry measure',
    domain: 'Volume',
    period: 'Classical/Medieval',
    modern_equivalent: 'கிலோ',
    status: 'traditional; still seen rurally',
    notes: '1 உறி = 0.5 படி',
    difficulty: 'Easy'
  },
  {
    word: 'நாழி',
    meaning_ta: 'அளவுக் குடுவை',
    meaning_en: 'Nazhi: dry measure',
    domain: 'Volume',
    period: 'Classical/Medieval',
    modern_equivalent: 'லிட்டர்',
    status: 'archaic',
    notes: '1 நாழி = 2 உறி',
    difficulty: 'Hard'
  }
];

let authTokens = {};

// Helper function to make authenticated requests
const makeRequest = async (method, url, data = null, token = null) => {
  try {
    const config = {
      method,
      url,
      data,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    };
    
    const response = await api(config);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message,
      status: error.response?.status
    };
  }
};

// Test functions
const testHealthCheck = async () => {
  console.log('\n🏥 Testing Health Check...');
  const result = await makeRequest('GET', '/health');
  
  if (result.success) {
    console.log('✅ Health check passed:', result.data.message);
    return true;
  } else {
    console.log('❌ Health check failed:', result.error);
    return false;
  }
};

const testUserRegistration = async () => {
  console.log('\n👤 Testing User Registration...');
  
  for (const [role, userData] of Object.entries(testUsers)) {
    console.log(`\n  Registering ${role}...`);
    const result = await makeRequest('POST', '/auth/register', userData);
    
    if (result.success) {
      console.log(`  ✅ ${role} registered successfully`);
      authTokens[role] = result.data.token;
    } else {
      console.log(`  ❌ ${role} registration failed:`, result.error);
    }
  }
};

const testUserLogin = async () => {
  console.log('\n🔐 Testing User Login...');
  
  for (const [role, userData] of Object.entries(testUsers)) {
    console.log(`\n  Logging in ${role}...`);
    const result = await makeRequest('POST', '/auth/login', {
      email: userData.email,
      password: userData.password
    });
    
    if (result.success) {
      console.log(`  ✅ ${role} login successful`);
      authTokens[role] = result.data.token;
    } else {
      console.log(`  ❌ ${role} login failed:`, result.error);
    }
  }
};

const testWordManagement = async () => {
  console.log('\n📚 Testing Word Management...');
  
  if (!authTokens.admin) {
    console.log('  ❌ Admin token not available');
    return;
  }
  
  // Test word creation
  console.log('\n  Creating words...');
  for (const wordData of testWords) {
    const result = await makeRequest('POST', '/words', wordData, authTokens.admin);
    
    if (result.success) {
      console.log(`  ✅ Word "${wordData.word}" created successfully`);
    } else {
      console.log(`  ❌ Word "${wordData.word}" creation failed:`, result.error);
    }
  }
  
  // Test word retrieval
  console.log('\n  Retrieving words...');
  const getWordsResult = await makeRequest('GET', '/words', null, authTokens.admin);
  
  if (getWordsResult.success) {
    console.log(`  ✅ Retrieved ${getWordsResult.data.words.length} words`);
  } else {
    console.log('  ❌ Word retrieval failed:', getWordsResult.error);
  }
  
  // Test random words for games
  console.log('\n  Getting random words for games...');
  const randomWordsResult = await makeRequest('GET', '/words/random?count=5', null, authTokens.student);
  
  if (randomWordsResult.success) {
    console.log(`  ✅ Retrieved ${randomWordsResult.data.words.length} random words for games`);
  } else {
    console.log('  ❌ Random words retrieval failed:', randomWordsResult.error);
  }
};

const testGameFunctionality = async () => {
  console.log('\n🎮 Testing Game Functionality...');
  
  if (!authTokens.student) {
    console.log('  ❌ Student token not available');
    return;
  }
  
  // Test game types
  const gameTypes = ['match', 'mcq', 'hints'];
  
  for (const gameType of gameTypes) {
    console.log(`\n  Testing ${gameType} game...`);
    
    // Start game
    const startGameResult = await makeRequest('POST', '/game/start', {
      gameType,
      difficulty: 'Medium',
      wordCount: 3
    }, authTokens.student);
    
    if (startGameResult.success) {
      console.log(`    ✅ ${gameType} game started successfully`);
      const gameSession = startGameResult.data;
      
      // Submit answers
      for (let i = 0; i < gameSession.questions.length; i++) {
        const answer = gameSession.questions[i].correctAnswer;
        const answerResult = await makeRequest('POST', `/game/${gameSession.gameSessionId}/answer`, {
          questionIndex: i,
          answer,
          timeSpent: 5
        }, authTokens.student);
        
        if (answerResult.success) {
          console.log(`    ✅ Answer ${i + 1} submitted successfully`);
        } else {
          console.log(`    ❌ Answer ${i + 1} submission failed:`, answerResult.error);
        }
      }
      
      // Complete game
      const completeResult = await makeRequest('POST', `/game/${gameSession.gameSessionId}/complete`, {}, authTokens.student);
      
      if (completeResult.success) {
        console.log(`    ✅ ${gameType} game completed successfully`);
        console.log(`    📊 Final Score: ${completeResult.data.finalScore}`);
        console.log(`    🎯 Accuracy: ${completeResult.data.accuracy.toFixed(1)}%`);
      } else {
        console.log(`    ❌ ${gameType} game completion failed:`, completeResult.error);
      }
    } else {
      console.log(`    ❌ ${gameType} game start failed:`, startGameResult.error);
    }
  }
};

const testTaskManagement = async () => {
  console.log('\n📋 Testing Task Management...');
  
  if (!authTokens.teacher || !authTokens.student) {
    console.log('  ❌ Teacher or Student token not available');
    return;
  }
  
  // Create task
  console.log('\n  Creating task...');
  const taskData = {
    title: 'Test Tamil Words Quiz',
    description: 'Learn about ancient Tamil measurement words',
    gameType: 'mcq',
    difficulty: 'Medium',
    wordCount: 5,
    domain: 'Volume',
    timeLimit: 10,
    pointsReward: 50,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    instructions: 'Complete the quiz to learn about ancient Tamil words'
  };
  
  const createTaskResult = await makeRequest('POST', '/tasks', taskData, authTokens.teacher);
  
  if (createTaskResult.success) {
    console.log('  ✅ Task created successfully');
    const taskId = createTaskResult.data.task._id;
    
    // Assign task to student
    console.log('\n  Assigning task to student...');
    const assignResult = await makeRequest('POST', `/tasks/${taskId}/assign`, {
      studentIds: [testUsers.student.email] // Using email as identifier
    }, authTokens.teacher);
    
    if (assignResult.success) {
      console.log('  ✅ Task assigned successfully');
      
      // Student submits task
      console.log('\n  Student submitting task...');
      const submitResult = await makeRequest('POST', `/tasks/${taskId}/submit`, {
        gameSessionId: 'test-session',
        score: 85
      }, authTokens.student);
      
      if (submitResult.success) {
        console.log('  ✅ Task submitted successfully');
      } else {
        console.log('  ❌ Task submission failed:', submitResult.error);
      }
    } else {
      console.log('  ❌ Task assignment failed:', assignResult.error);
    }
  } else {
    console.log('  ❌ Task creation failed:', createTaskResult.error);
  }
};

const testLeaderboard = async () => {
  console.log('\n🏆 Testing Leaderboard...');
  
  const leaderboardResult = await makeRequest('GET', '/game/leaderboard?limit=10');
  
  if (leaderboardResult.success) {
    console.log('  ✅ Leaderboard retrieved successfully');
    console.log(`  📊 Found ${leaderboardResult.data.leaderboard.length} players`);
  } else {
    console.log('  ❌ Leaderboard retrieval failed:', leaderboardResult.error);
  }
};

const testUserManagement = async () => {
  console.log('\n👥 Testing User Management...');
  
  if (!authTokens.admin) {
    console.log('  ❌ Admin token not available');
    return;
  }
  
  // Get all users
  const usersResult = await makeRequest('GET', '/auth/users', null, authTokens.admin);
  
  if (usersResult.success) {
    console.log('  ✅ Users retrieved successfully');
    console.log(`  📊 Found ${usersResult.data.users.length} users`);
  } else {
    console.log('  ❌ User retrieval failed:', usersResult.error);
  }
  
  // Get teacher's students
  const studentsResult = await makeRequest('GET', '/auth/students', null, authTokens.teacher);
  
  if (studentsResult.success) {
    console.log('  ✅ Students retrieved successfully');
    console.log(`  📊 Found ${studentsResult.data.students.length} students`);
  } else {
    console.log('  ❌ Students retrieval failed:', studentsResult.error);
  }
};

const runAllTests = async () => {
  console.log('🚀 Starting Tamil Word Game API Tests...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'User Registration', fn: testUserRegistration },
    { name: 'User Login', fn: testUserLogin },
    { name: 'Word Management', fn: testWordManagement },
    { name: 'Game Functionality', fn: testGameFunctionality },
    { name: 'Task Management', fn: testTaskManagement },
    { name: 'Leaderboard', fn: testLeaderboard },
    { name: 'User Management', fn: testUserManagement }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result !== false) {
        passedTests++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} failed with error:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! The Tamil Word Game API is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }
  
  console.log('\n🔧 Available API Endpoints:');
  console.log('  Authentication: /api/auth/*');
  console.log('  Games: /api/game/*');
  console.log('  Words: /api/words/*');
  console.log('  Tasks: /api/tasks/*');
  console.log('  Health: /api/health');
  
  console.log('\n📱 Mobile App: http://localhost:3001');
  console.log('🌐 Web App: http://localhost:3000');
  console.log('🔧 API: http://localhost:3000/api');
};

// Run tests
runAllTests().catch(console.error);