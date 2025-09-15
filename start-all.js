
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Tamil Word Game Application...\n');

// Start Backend
console.log('📡 Starting Backend Server...');
const backend = spawn('node', ['src/index.js'], {
  cwd: path.join(__dirname, 'Backend'),
  stdio: 'pipe',
  shell: true
});

backend.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data.toString().trim()}`);
});

// Start Mobile App
setTimeout(() => {
  console.log('\n📱 Starting Mobile App...');
  const mobile = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'Mobile'),
    stdio: 'pipe',
    shell: true
  });

  mobile.stdout.on('data', (data) => {
    console.log(`[Mobile] ${data.toString().trim()}`);
  });

  mobile.stderr.on('data', (data) => {
    console.error(`[Mobile Error] ${data.toString().trim()}`);
  });
}, 3000);

// Start Web App
setTimeout(() => {
  console.log('\n🌐 Starting Web App...');
  const web = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'Web'),
    stdio: 'pipe',
    shell: true
  });

  web.stdout.on('data', (data) => {
    console.log(`[Web] ${data.toString().trim()}`);
  });

  web.stderr.on('data', (data) => {
    console.error(`[Web Error] ${data.toString().trim()}`);
  });
}, 6000);

process.on('SIGINT', () => {
  console.log('\n🛑 Stopping all applications...');
  backend.kill();
  process.exit(0);
});
