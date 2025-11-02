// Test serveur minimal
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

const frontendPath = path.join(__dirname, '..', 'CINEHOME---Homepage');
console.log('Frontend path:', frontendPath);

app.use(express.static(frontendPath));

const server = app.listen(PORT, () => {
  console.log(`✅ Serveur minimal démarré sur http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Erreur:', err);
});

console.log('Script terminé - serveur en arrière-plan');

// Empêcher la fermeture
setInterval(() => {}, 1000);
