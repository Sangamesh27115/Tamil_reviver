
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
  console.log('\n🛑 Stopping Mobile App...');
  mobile.kill();
  process.exit(0);
});
