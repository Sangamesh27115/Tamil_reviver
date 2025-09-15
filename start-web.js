
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
  console.log('\n🛑 Stopping Web App...');
  web.kill();
  process.exit(0);
});
