const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Destiné uniquement pour la récupération de mot de passe.
// Ne pas utiliser pour inscription/connexion principale.
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://cinemaf.onrender.com/reset.html';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// --- GitHub OAuth (pour récupération de mot de passe) ---
router.get('/auth/github', (_req, res) => {
  // build redirectUri dynamically from request host so port mismatches are avoided
  const host = _req.get('host');
  const protocol = _req.protocol;
  const redirectUri = `${protocol}://${host}/auth/github/callback`;
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) return res.status(500).send('GITHUB_CLIENT_ID not configured');
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
  console.log('GitHub auth init, redirect URL:', url);
  res.redirect(url);
});

router.get('/auth/github/callback', async (req, res) => {
  const code = req.query.code;
  try {
    // Use the same redirectUri pattern (host-aware) when exchanging token
    const host = req.get('host');
    const protocol = req.protocol;
    const redirectUri = `${protocol}://${host}/auth/github/callback`;

    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri
      },
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const emailRes = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

  const email = (emailRes.data || []).find((e) => e.primary && e.verified)?.email || null;

    console.log('✅ GitHub user (for reset):', { name: userRes.data.name, email });

    if (!email) return res.status(400).send('Email not available from GitHub');

    // Générer un token de reset court
  const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });

    // Rediriger le frontend vers une page qui permettra de saisir la nouvelle password
    return res.redirect(`${FRONTEND_URL}?reset_token=${resetToken}&source=github`);
  } catch (err) {
    console.error('GitHub OAuth Error:', err?.response?.data || err.message || err);
    return res.status(500).send('GitHub OAuth failed');
  }
});

// --- Google OAuth (pour récupération de mot de passe) ---
router.get('/auth/google', (_req, res) => {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║          🔐 GOOGLE OAUTH - INITIALISATION                ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  
  // build redirectUri dynamically from request host so it always matches the callback
  const host = _req.get('host');
  const protocol = _req.protocol;
  const redirectUri = `${protocol}://${host}/auth/google/callback`;
  
  console.log('🌐 Configuration:');
  console.log(`   Host: ${host}`);
  console.log(`   Protocol: ${protocol}`);
  console.log(`   Redirect URI: ${redirectUri}`);
  
  const clientId = process.env.GOOGLE_CLIENT_ID;
  console.log(`   Client ID: ${clientId ? clientId.substring(0, 20) + '...' : '❌ MANQUANT'}`);
  
  if (!clientId) {
    console.error('❌ ERREUR: GOOGLE_CLIENT_ID non configuré dans .env');
    console.error('═══════════════════════════════════════════════════════════\n');
    return res.status(500).send('GOOGLE_CLIENT_ID not configured');
  }
  
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;
  console.log('✅ Redirection vers Google OAuth...');
  console.log(`   URL: ${url.substring(0, 100)}...`);
  console.log('═══════════════════════════════════════════════════════════\n');
  res.redirect(url);
});

router.get('/auth/google/callback', async (req, res) => {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║         🔐 GOOGLE OAUTH - CALLBACK REÇU                  ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  
  const code = req.query.code;
  const error = req.query.error;
  
  if (error) {
    console.error('❌ Erreur OAuth reçue de Google:');
    console.error(`   Error: ${error}`);
    console.error(`   Description: ${req.query.error_description || 'N/A'}`);
    console.error('═══════════════════════════════════════════════════════════\n');
    return res.status(400).send(`Google OAuth error: ${error}`);
  }
  
  console.log(`🔑 Code reçu: ${code ? code.substring(0, 20) + '...' : '❌ MANQUANT'}`);
  
  try {
    // build redirectUri dynamically from request host (must match initial auth request)
    const host = req.get('host');
    const protocol = req.protocol;
    const redirectUri = `${protocol}://${host}/auth/google/callback`;
    
    console.log('🌐 Configuration callback:');
    console.log(`   Host: ${host}`);
    console.log(`   Protocol: ${protocol}`);
    console.log(`   Redirect URI: ${redirectUri}`);
    console.log(`   Client ID: ${process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...' : '❌ MANQUANT'}`);
    console.log(`   Client Secret: ${process.env.GOOGLE_CLIENT_SECRET ? '✅ Défini' : '❌ MANQUANT'}`);

    // Google expects application/x-www-form-urlencoded for the token endpoint
    console.log('📤 Échange du code contre un token...');
    const params = new URLSearchParams();
    params.append('client_id', process.env.GOOGLE_CLIENT_ID);
    params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    params.append('grant_type', 'authorization_code');

    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenRes.data.access_token;
    console.log('✅ Token reçu de Google');
    console.log('   Token keys:', Object.keys(tokenRes.data).join(', '));
    console.log(`   Access token: ${accessToken ? accessToken.substring(0, 20) + '...' : '❌ MANQUANT'}`);

    console.log('📤 Récupération du profil utilisateur...');
    const profileRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const email = profileRes.data.email;

    console.log('✅ Profil Google récupéré avec succès:');
    console.log(`   Nom: ${profileRes.data.name}`);
    console.log(`   Email: ${email}`);
    console.log(`   Verified: ${profileRes.data.verified_email}`);

    if (!email) {
      console.error('❌ Email non disponible dans le profil Google');
      console.error('═══════════════════════════════════════════════════════════\n');
      return res.status(400).send('Email not available from Google');
    }

    console.log('🔐 Génération du token JWT...');
    const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
    console.log(`   Token JWT: ${resetToken.substring(0, 30)}...`);
    console.log(`   Expiration: 15 minutes`);
    
    const redirectUrl = `${FRONTEND_URL}?reset_token=${encodeURIComponent(resetToken)}&source=google`;
    console.log('✅ Redirection vers le frontend...');
    console.log(`   URL: ${redirectUrl.substring(0, 80)}...`);
    console.log('═══════════════════════════════════════════════════════════\n');
    
    // encode the token for safe inclusion in the URL
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error('╔═══════════════════════════════════════════════════════════╗');
    console.error('║        ❌ ERREUR GOOGLE OAUTH - CALLBACK ÉCHOUÉ          ║');
    console.error('╚═══════════════════════════════════════════════════════════╝');
    console.error('Date:', new Date().toISOString());
    console.error('Type d\'erreur:', err.name);
    console.error('Message:', err.message);
    
    if (err.response) {
      console.error('\n📋 Réponse de l\'API:');
      console.error('   Status:', err.response.status);
      console.error('   Status Text:', err.response.statusText);
      console.error('   Headers:', JSON.stringify(err.response.headers, null, 2));
      console.error('   Data:', JSON.stringify(err.response.data, null, 2));
    }
    
    if (err.config) {
      console.error('\n📋 Configuration de la requête:');
      console.error('   URL:', err.config.url);
      console.error('   Method:', err.config.method);
      console.error('   Headers:', JSON.stringify(err.config.headers, null, 2));
    }
    
    console.error('\nStack trace:');
    console.error(err.stack);
    console.error('═══════════════════════════════════════════════════════════\n');
    
    return res.status(500).send('Google OAuth failed');
  }
});

module.exports = router;
