// Script de démarrage avec gestion d'erreur complète et logs détaillés
console.log('═══════════════════════════════════════════════════════════');
console.log('🚀 CINEHOME BACKEND - DÉMARRAGE');
console.log('═══════════════════════════════════════════════════════════');
console.log(`📅 Date: ${new Date().toISOString()}`);
console.log(`🌐 Node Version: ${process.version}`);
console.log(`📂 Working Directory: ${process.cwd()}`);
console.log(`� Environment: ${process.env.NODE_ENV || 'development'}`);
console.log('───────────────────────────────────────────────────────────');

// Vérifier les variables d'environnement critiques
console.log('\n📋 VÉRIFICATION DES VARIABLES D\'ENVIRONNEMENT:');
console.log(`   PORT: ${process.env.PORT || '3001 (default)'}`);
console.log(`   MONGO_URI: ${process.env.MONGO_URI ? '✅ Défini' : '❌ MANQUANT'}`);
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER || '❌ MANQUANT'}`);
console.log(`   EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '✅ Défini' : '❌ MANQUANT'}`);
console.log(`   GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? '✅ Défini' : '❌ MANQUANT'}`);
console.log(`   GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? '✅ Défini' : '❌ MANQUANT'}`);
console.log(`   GOOGLE_CALLBACK_URL: ${process.env.GOOGLE_CALLBACK_URL || '❌ MANQUANT'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Défini' : '❌ MANQUANT'}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || '❌ MANQUANT'}`);
console.log('───────────────────────────────────────────────────────────');

try {
  console.log('\n📦 CHARGEMENT DES MODULES...');
  
  // Charger dotenv en premier
  require('dotenv').config();
  console.log('   ✅ dotenv chargé');
  
  // Tester les imports critiques
  try {
    require('express');
    console.log('   ✅ express disponible');
  } catch (e) {
    console.error('   ❌ ERREUR: express non trouvé -', e.message);
  }
  
  try {
    require('mongoose');
    console.log('   ✅ mongoose disponible');
  } catch (e) {
    console.error('   ❌ ERREUR: mongoose non trouvé -', e.message);
  }
  
  try {
    require('nodemailer');
    console.log('   ✅ nodemailer disponible');
  } catch (e) {
    console.error('   ❌ ERREUR: nodemailer non trouvé -', e.message);
  }
  
  try {
    require('google-auth-library');
    console.log('   ✅ google-auth-library disponible');
  } catch (e) {
    console.error('   ❌ ERREUR: google-auth-library non trouvé -', e.message);
  }
  
  console.log('\n🔄 DÉMARRAGE DU SERVEUR PRINCIPAL...');
  require('./src/app.js');
  console.log('✅ Serveur chargé avec succès\n');
  
} catch (error) {
  console.error('\n╔═══════════════════════════════════════════════════════════╗');
  console.error('║              ❌ ERREUR FATALE AU DÉMARRAGE               ║');
  console.error('╚═══════════════════════════════════════════════════════════╝');
  console.error('Type d\'erreur:', error.name);
  console.error('Message:', error.message);
  console.error('\nStack trace complète:');
  console.error(error.stack);
  console.error('\n═══════════════════════════════════════════════════════════');
  process.exit(1);
}

// Garder le processus actif et logger l'état
let uptimeCounter = 0;
setInterval(() => {
  uptimeCounter += 30;
  const hours = Math.floor(uptimeCounter / 3600);
  const minutes = Math.floor((uptimeCounter % 3600) / 60);
  console.log(`⏱️  Serveur actif depuis: ${hours}h ${minutes}m (${uptimeCounter}s)`);
}, 30000);

// Capturer les erreurs non gérées
process.on('uncaughtException', (error) => {
  console.error('\n╔═══════════════════════════════════════════════════════════╗');
  console.error('║          ❌ EXCEPTION NON CAPTURÉE DÉTECTÉE              ║');
  console.error('╚═══════════════════════════════════════════════════════════╝');
  console.error('Date:', new Date().toISOString());
  console.error('Type:', error.name);
  console.error('Message:', error.message);
  console.error('Stack:', error.stack);
  console.error('═══════════════════════════════════════════════════════════\n');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n╔═══════════════════════════════════════════════════════════╗');
  console.error('║        ❌ PROMESSE REJETÉE NON GÉRÉE DÉTECTÉE            ║');
  console.error('╚═══════════════════════════════════════════════════════════╝');
  console.error('Date:', new Date().toISOString());
  console.error('Promise:', promise);
  console.error('Raison:', reason);
  console.error('═══════════════════════════════════════════════════════════\n');
});

console.log('✅ Gestionnaires d\'erreurs globaux activés');
console.log('═══════════════════════════════════════════════════════════\n');
