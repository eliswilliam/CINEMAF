// Test serveur minimal avec logs détaillés
console.log('═══════════════════════════════════════════════════════════');
console.log('🧪 CINEHOME BACKEND - MODE TEST');
console.log('═══════════════════════════════════════════════════════════');
console.log(`📅 Date: ${new Date().toISOString()}`);
console.log(`🌐 Node Version: ${process.version}`);
console.log(`📂 Working Directory: ${process.cwd()}`);
console.log('───────────────────────────────────────────────────────────\n');

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Logs de configuration
console.log('📋 CONFIGURATION:');
console.log(`   Port: ${PORT}`);

const frontendPath = path.join(__dirname, '..', 'CINEHOME---Homepage');
console.log(`   Frontend path: ${frontendPath}`);

// Vérifier si le chemin existe
const fs = require('fs');
if (fs.existsSync(frontendPath)) {
  console.log('   ✅ Frontend path existe');
  const files = fs.readdirSync(frontendPath);
  console.log(`   📁 ${files.length} fichiers trouvés`);
  console.log(`   📄 Fichiers HTML: ${files.filter(f => f.endsWith('.html')).join(', ')}`);
} else {
  console.error('   ❌ Frontend path n\'existe pas!');
}
console.log('───────────────────────────────────────────────────────────\n');

// Middleware de logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`📨 [${timestamp}] ${req.method} ${req.url}`);
  console.log(`   IP: ${req.ip || req.connection.remoteAddress}`);
  console.log(`   User-Agent: ${req.get('user-agent')?.substring(0, 50)}...`);
  next();
});

app.use(express.static(frontendPath));

// Route de santé
app.get('/health', (req, res) => {
  console.log('💚 Health check demandé');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mode: 'test-server'
  });
});

// Gestionnaire 404
app.use((req, res) => {
  console.warn(`⚠️  404 - Route non trouvée: ${req.method} ${req.url}`);
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.url,
    method: req.method
  });
});

// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
  console.error('╔═══════════════════════════════════════════════════════════╗');
  console.error('║                 ❌ ERREUR SERVEUR                        ║');
  console.error('╚═══════════════════════════════════════════════════════════╝');
  console.error('Date:', new Date().toISOString());
  console.error('URL:', req.url);
  console.error('Méthode:', req.method);
  console.error('Erreur:', err.message);
  console.error('Stack:', err.stack);
  console.error('═══════════════════════════════════════════════════════════\n');
  
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: err.message
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║           ✅ SERVEUR TEST DÉMARRÉ AVEC SUCCÈS            ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log(`🌐 Port: ${PORT}`);
  console.log(`🔗 URL locale: http://localhost:${PORT}`);
  console.log(`📂 Serveur de fichiers statiques actif`);
  console.log('═══════════════════════════════════════════════════════════\n');
});

server.on('error', (err) => {
  console.error('╔═══════════════════════════════════════════════════════════╗');
  console.error('║              ❌ ERREUR SERVEUR CRITIQUE                  ║');
  console.error('╚═══════════════════════════════════════════════════════════╝');
  console.error('Code:', err.code);
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('═══════════════════════════════════════════════════════════\n');
  process.exit(1);
});

server.on('connection', (socket) => {
  console.log(`🔌 Nouvelle connexion établie depuis ${socket.remoteAddress}:${socket.remotePort}`);
});

console.log('✅ Script d\'initialisation terminé - serveur en arrière-plan');
console.log('⏳ En attente de requêtes...\n');

// Empêcher la fermeture et logger l'uptime
let uptimeCounter = 0;
setInterval(() => {
  uptimeCounter += 60;
  const hours = Math.floor(uptimeCounter / 3600);
  const minutes = Math.floor((uptimeCounter % 3600) / 60);
  console.log(`⏱️  Uptime: ${hours}h ${minutes}m | Mémoire: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
}, 60000);

// Capturer les signaux de fermeture
process.on('SIGTERM', () => {
  console.log('\n📴 Signal SIGTERM reçu - Arrêt gracieux du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n📴 Signal SIGINT reçu - Arrêt gracieux du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});
