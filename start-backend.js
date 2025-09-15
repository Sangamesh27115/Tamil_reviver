
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
  console.log('\n🛑 Stopping Backend Server...');
  backend.kill();
  process.exit(0);
});
