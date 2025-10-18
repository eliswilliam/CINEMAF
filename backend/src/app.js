// Charger les variables d'environnement en premier
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const emailRoutes = require('./email');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
const path = require('path');

// Servir les fichiers front (reset.html, index.html, etc.) depuis le dossier front/ à la racine
// __dirname = backend/src  => remonter deux niveaux pour atteindre le dossier racine du projet
app.use(express.static(path.join(__dirname, '..', '..', 'front')));

// Connexion à MongoDB Atlas avec gestion d'erreur
// On tente de connecter la DB mais on laisse le serveur démarrer pour permettre des tests front-back
connectDB()
  .then(() => console.log('✅ MongoDB connecté avec succès'))
  .catch((err) => {
    console.error('❌ Erreur de connexion MongoDB:', err.message);
    console.warn('Le serveur continue de tourner pour permettre les tests front-back. Corrigez MONGO_URI pour activer la DB.');
    // Ne pas process.exit ici pour permettre l'utilisation d'endpoints non-DB (ex: /health)
  });

// Routes
app.use('/api/users', userRoutes);
// Routes pour récupération de mot de passe via OAuth (GitHub/Google)
app.use('/', emailRoutes);

// Endpoint de santé simple utilisé par le frontend
app.get('/health', (req, res) => {
  return res.json({ status: 'ok', time: new Date().toISOString() });
});

// Port depuis .env ou valeur par défaut
const PORT = process.env.PORT || 3001;

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
