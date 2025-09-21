import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API = `http://localhost:${process.env.PORT || 5000}/api`;

const delay = ms => new Promise(res => setTimeout(res, ms));

async function run() {
    try {
        console.log('1) Health check');
        const health = await fetch(`${API}/health`);
        console.log('Health:', await health.json());

        // Register a test student
        console.log('2) Register student');
        const registerResp = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'smoketest', email: 'smoke@example.com', password: 'password123', role: 'Student' })
        });
        const registerData = await registerResp.json();
        console.log('Register:', registerData);

        if (!registerResp.ok) {
            console.log('Register failed, maybe user exists. Trying login');
        }

        // Login
        console.log('3) Login');
        const loginResp = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'smoke@example.com', password: 'password123' })
        });
        const loginData = await loginResp.json();
        console.log('Login:', loginData);

        if (!loginResp.ok) {
            throw new Error('Login failed');
        }

        const token = loginData.token;

        // Start a game
        console.log('4) Start game');
        const startResp = await fetch(`${API}/game/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ gameType: 'mcq', wordCount: 3 })
        });
        const startData = await startResp.json();
        console.log('Start game:', startData);

        if (!startResp.ok) throw new Error('Start game failed');

        const sessionId = startData.gameSessionId;

        // Submit answer for question 0 (use correct answer from response)
        console.log('5) Submit answer');
        const question = startData.questions[0];
        const correct = question.correctAnswer || (question.options && question.options[0]);

        const answerResp = await fetch(`${API}/game/${sessionId}/answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ questionIndex: 0, answer: correct })
        });
        console.log('Submit response:', await answerResp.json());

        // Complete game
        console.log('6) Complete game');
        const completeResp = await fetch(`${API}/game/${sessionId}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        console.log('Complete response:', await completeResp.json());

        console.log('Smoke test finished');
    } catch (err) {
        console.error('Smoke test error:', err.message);
        process.exit(1);
    }
}

run();
