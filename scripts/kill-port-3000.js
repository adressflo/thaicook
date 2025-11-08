const { exec } = require('child_process');

console.log('🔍 Vérification port 3000...');

exec('netstat -ano | findstr :3000', (err, stdout) => {
  if (!stdout || stdout.trim() === '') {
    console.log('✅ Port 3000 libre');
    process.exit(0);
    return;
  }

  const match = stdout.match(/LISTENING\s+(\d+)/);
  if (match) {
    const pid = match[1];
    console.log(`⚠️ Port 3000 occupé par PID ${pid}`);
    console.log(`🔄 Tentative d'arrêt du processus...`);

    exec(`taskkill /PID ${pid} /F`, (killErr, killStdout, killStderr) => {
      if (killErr) {
        console.error(`❌ Erreur lors de l'arrêt: ${killErr.message}`);
        console.error(`Details: ${killStderr}`);
        process.exit(1);
      } else {
        console.log(`✅ Processus ${pid} arrêté avec succès`);
        console.log(`✅ Port 3000 maintenant libre`);
        process.exit(0);
      }
    });
  } else {
    console.log('⚠️ Port 3000 semble utilisé mais PID introuvable');
    console.log('Output netstat:', stdout);
    process.exit(1);
  }
});
