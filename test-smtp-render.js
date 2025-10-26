/**
 * Test SMTP pour Render
 * Ce fichier teste la configuration SMTP en production
 * 
 * Pour tester sur Render:
 * 1. Ajoutez ce fichier au repository
 * 2. Déployez sur Render
 * 3. Accédez à: https://cinemaf.onrender.com/test-smtp
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

async function testSMTPConnection() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║              🧪 TEST CONFIGURATION SMTP                   ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  // 1. Vérifier les variables d'environnement
  console.log('📋 ÉTAPE 1: Vérification des variables d\'environnement');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || '❌ NON DÉFINI');
  console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ NON DÉFINI');
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Défini (' + process.env.EMAIL_PASSWORD.length + ' caractères)' : '❌ NON DÉFINI');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('\n❌ ÉCHEC: Variables d\'environnement manquantes!');
    console.log('   Ajoutez EMAIL_USER et EMAIL_PASSWORD dans Render Environment Variables\n');
    return false;
  }

  // 2. Créer le transporteur
  console.log('\n📦 ÉTAPE 2: Création du transporteur SMTP');
  console.log('─────────────────────────────────────────────────────────────');
  
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true pour port 465, false pour port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: true
      },
      debug: true, // Mode debug
      logger: true // Activer les logs
    });
    console.log('✅ Transporteur créé avec succès');
    console.log('   Host: smtp.gmail.com');
    console.log('   Port: 587 (STARTTLS)');
  } catch (error) {
    console.log('❌ Erreur création transporteur:', error.message);
    return false;
  }

  // 3. Vérifier la connexion SMTP
  console.log('\n🔌 ÉTAPE 3: Test de connexion SMTP');
  console.log('─────────────────────────────────────────────────────────────');
  
  try {
    await transporter.verify();
    console.log('✅ Connexion SMTP réussie!');
    console.log('   Gmail accepte les credentials');
  } catch (error) {
    console.log('❌ ÉCHEC connexion SMTP');
    console.log('   Code:', error.code);
    console.log('   Message:', error.message);
    console.log('   Response:', error.response);
    console.log('\n💡 Solutions possibles:');
    console.log('   1. Vérifiez que EMAIL_PASSWORD est un App Password Gmail');
    console.log('   2. Vérifiez que l\'authentification 2FA est activée');
    console.log('   3. Générez un nouveau App Password: https://myaccount.google.com/apppasswords');
    console.log('   4. Vérifiez qu\'il n\'y a pas d\'espaces dans le password');
    return false;
  }

  // 4. Envoyer un email de test
  console.log('\n📧 ÉTAPE 4: Envoi d\'email de test');
  console.log('─────────────────────────────────────────────────────────────');
  
  const testEmail = process.env.EMAIL_USER; // Envoyer à soi-même
  const testCode = '123456';
  
  try {
    const info = await transporter.sendMail({
      from: `"CINEHOME TEST" <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: '🧪 Test SMTP - CINEHOME',
      text: `Test de configuration SMTP réussi!\n\nCode de test: ${testCode}\n\nDate: ${new Date().toISOString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px;">
            <h2 style="color: #667eea;">🧪 Test SMTP Réussi!</h2>
            <p>Votre configuration SMTP fonctionne correctement.</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Code de test:</strong> <span style="font-size: 24px; color: #667eea; font-weight: bold;">${testCode}</span></p>
            </div>
            <p style="color: #666; font-size: 14px;">Date: ${new Date().toISOString()}</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">CINEHOME - Configuration Email</p>
          </div>
        </div>
      `
    });

    console.log('✅ Email de test envoyé avec succès!');
    console.log('   Message ID:', info.messageId);
    console.log('   Destinataire:', testEmail);
    console.log('   Response:', info.response);
    console.log('\n📬 Vérifiez votre boîte mail:', testEmail);
    
    return true;

  } catch (error) {
    console.log('❌ ÉCHEC envoi email');
    console.log('   Type:', error.name);
    console.log('   Code:', error.code);
    console.log('   Message:', error.message);
    console.log('   Command:', error.command);
    if (error.response) {
      console.log('   Response:', error.response);
    }
    return false;
  }
}

// Si exécuté directement
if (require.main === module) {
  testSMTPConnection()
    .then(success => {
      console.log('\n╔═══════════════════════════════════════════════════════════╗');
      if (success) {
        console.log('║                ✅ TEST SMTP RÉUSSI                        ║');
        console.log('║     La récupération de mot de passe devrait fonctionner  ║');
      } else {
        console.log('║                ❌ TEST SMTP ÉCHOUÉ                        ║');
        console.log('║      Vérifiez la configuration dans Render               ║');
      }
      console.log('╚═══════════════════════════════════════════════════════════╝\n');
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('\n❌ Erreur critique:', error);
      process.exit(1);
    });
}

module.exports = { testSMTPConnection };
