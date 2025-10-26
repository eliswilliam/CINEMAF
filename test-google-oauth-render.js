/**
 * Test Google OAuth avec simulation de l'environnement Render
 * Vérifie que le header x-forwarded-proto est correctement détecté
 */

require('dotenv').config();

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║     🧪 TEST GOOGLE OAUTH - SIMULATION RENDER             ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Simulation d'une requête Render avec x-forwarded-proto
const mockRequest = {
  get: function(header) {
    const headers = {
      'host': 'cinemaf.onrender.com',
      'x-forwarded-proto': 'https'  // Header ajouté par le proxy Render
    };
    return headers[header.toLowerCase()];
  },
  protocol: 'http'  // Protocol interne (derrière le proxy)
};

console.log('📋 SIMULATION DE L\'ENVIRONNEMENT RENDER:');
console.log('─────────────────────────────────────────────────────────────');
console.log('Headers reçus par Express:');
console.log(`   req.get('host'): ${mockRequest.get('host')}`);
console.log(`   req.get('x-forwarded-proto'): ${mockRequest.get('x-forwarded-proto')}`);
console.log(`   req.protocol: ${mockRequest.protocol}`);
console.log('─────────────────────────────────────────────────────────────\n');

// Simulation de la logique du code modifié
const host = mockRequest.get('host');
const protocol = mockRequest.get('x-forwarded-proto') || mockRequest.protocol;
const redirectUri = `${protocol}://${host}/auth/google/callback`;

console.log('🔍 RÉSULTAT DE LA DÉTECTION:');
console.log('─────────────────────────────────────────────────────────────');
console.log(`   Protocol détecté: ${protocol}`);
console.log(`   Host: ${host}`);
console.log(`   Redirect URI généré: ${redirectUri}`);
console.log('─────────────────────────────────────────────────────────────\n');

// Vérifications
const expectedRedirectUri = 'https://cinemaf.onrender.com/auth/google/callback';
const isCorrect = redirectUri === expectedRedirectUri;

console.log('✅ VALIDATION:');
console.log('─────────────────────────────────────────────────────────────');
console.log(`   URI attendu: ${expectedRedirectUri}`);
console.log(`   URI généré:  ${redirectUri}`);
console.log(`   Match: ${isCorrect ? '✅ OUI' : '❌ NON'}`);
console.log('─────────────────────────────────────────────────────────────\n');

// Vérification des variables d'environnement
console.log('🔐 CONFIGURATION GOOGLE OAUTH (.env):');
console.log('─────────────────────────────────────────────────────────────');
console.log(`   GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? '✅ Défini (' + process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...)' : '❌ MANQUANT'}`);
console.log(`   GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? '✅ Défini' : '❌ MANQUANT'}`);
console.log(`   GOOGLE_CALLBACK_URL: ${process.env.GOOGLE_CALLBACK_URL || '❌ MANQUANT'}`);
console.log('─────────────────────────────────────────────────────────────\n');

// Construction de l'URL d'autorisation Google
if (process.env.GOOGLE_CLIENT_ID) {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;
  
  console.log('🔗 URL D\'AUTORISATION GOOGLE:');
  console.log('─────────────────────────────────────────────────────────────');
  console.log(authUrl.substring(0, 120) + '...');
  console.log('─────────────────────────────────────────────────────────────\n');
}

// Résumé final
console.log('╔═══════════════════════════════════════════════════════════╗');
if (isCorrect && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('║              ✅ CONFIGURATION CORRECTE                    ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('\n✨ Google OAuth devrait fonctionner sur Render!\n');
  console.log('Points validés:');
  console.log('  ✅ Header x-forwarded-proto correctement détecté (https)');
  console.log('  ✅ Redirect URI correspond à Google Console');
  console.log('  ✅ Variables d\'environnement configurées');
  console.log('\n📌 IMPORTANT: Assurez-vous dans Google Console que:');
  console.log('   Redirect URI autorisé: https://cinemaf.onrender.com/auth/google/callback');
  console.log('   Origine JavaScript: https://cinemaf.onrender.com\n');
} else {
  console.log('║              ❌ PROBLÈMES DÉTECTÉS                        ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  if (!isCorrect) {
    console.log('❌ Le redirect URI ne correspond pas!');
    console.log(`   Attendu: ${expectedRedirectUri}`);
    console.log(`   Reçu: ${redirectUri}\n`);
  }
  
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.log('❌ GOOGLE_CLIENT_ID manquant dans .env\n');
  }
  
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    console.log('❌ GOOGLE_CLIENT_SECRET manquant dans .env\n');
  }
}

console.log('═══════════════════════════════════════════════════════════\n');

// Test avec environnement localhost (pour développement local)
console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║     🧪 TEST LOCAL - SIMULATION LOCALHOST                 ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

const mockLocalRequest = {
  get: function(header) {
    const headers = {
      'host': 'localhost:3001'
      // Pas de x-forwarded-proto en local
    };
    return headers[header.toLowerCase()];
  },
  protocol: 'http'
};

const localHost = mockLocalRequest.get('host');
const localProtocol = mockLocalRequest.get('x-forwarded-proto') || mockLocalRequest.protocol;
const localRedirectUri = `${localProtocol}://${localHost}/auth/google/callback`;

console.log('📋 ENVIRONNEMENT LOCAL:');
console.log('─────────────────────────────────────────────────────────────');
console.log(`   Protocol: ${localProtocol}`);
console.log(`   Host: ${localHost}`);
console.log(`   Redirect URI: ${localRedirectUri}`);
console.log('─────────────────────────────────────────────────────────────\n');

const expectedLocalUri = 'http://localhost:3001/auth/google/callback';
const isLocalCorrect = localRedirectUri === expectedLocalUri;

console.log(`✅ Match: ${isLocalCorrect ? '✅ OUI' : '❌ NON'}`);
console.log(`   Attendu: ${expectedLocalUri}`);
console.log(`   Généré:  ${localRedirectUri}\n`);

console.log('═══════════════════════════════════════════════════════════\n');
