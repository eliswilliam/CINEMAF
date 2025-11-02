const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Destiné uniquement pour la récupération de mot de passe.
// Ne pas utiliser pour inscription/connexion principale.
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001/reset.html';
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
  // Utiliser l'URL de callback configurée dans .env
  const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${_req.protocol}://${_req.get('host')}/auth/google/callback`;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  
  console.log('🔐 Google OAuth - Redirect URI:', redirectUri);
  console.log('🔐 Google OAuth - Client ID:', clientId);
  
  if (!clientId) return res.status(500).send('GOOGLE_CLIENT_ID not configured');
  
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;
  console.log('✅ Redirecting to Google OAuth with URL:', url);
  res.redirect(url);
});

router.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  
  console.log('📥 Google callback received - Code:', code ? 'présent' : 'absent');
  
  if (!code) {
    console.error('❌ Aucun code reçu de Google');
    return res.status(400).send('No code received from Google');
  }
  
  try {
    // Utiliser l'URL de callback configurée dans .env (DOIT correspondre exactement à Google Console)
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${req.protocol}://${req.get('host')}/auth/google/callback`;
    
    console.log('🔄 Exchange token - Redirect URI:', redirectUri);

    // Google expects application/x-www-form-urlencoded for the token endpoint
    const params = new URLSearchParams();
    params.append('client_id', process.env.GOOGLE_CLIENT_ID);
    params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    params.append('grant_type', 'authorization_code');

    console.log('📤 Sending token request to Google...');
    
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenRes.data.access_token;
    console.log('✅ Token reçu de Google - Keys:', Object.keys(tokenRes.data));

    if (!accessToken) {
      console.error('❌ Pas de access_token dans la réponse Google');
      return res.status(500).send('Failed to get access token from Google');
    }

    console.log('📤 Fetching user profile from Google...');
    
    const profileRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const email = profileRes.data.email;
    const name = profileRes.data.name;

    console.log('✅ Google User (for reset):', { name, email });

    if (!email) {
      console.error('❌ Email not available from Google profile');
      return res.status(400).send('Email not available from Google');
    }

    const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
    const redirectUrl = `${FRONTEND_URL}?reset_token=${encodeURIComponent(resetToken)}&source=google`;
    
    console.log('✅ Redirecting to frontend:', redirectUrl);
    
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error('❌ Google OAuth Error:', err?.response?.data || err.message || err);
    console.error('❌ Error details:', {
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      data: err?.response?.data
    });
    return res.status(500).send(`Google OAuth failed: ${err?.response?.data?.error_description || err.message}`);
  }
});

module.exports = router;
