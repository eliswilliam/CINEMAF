# 🚀 DOCUMENTATION BACKEND - CINEHOME

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Technologies utilisées](#technologies-utilisées)
3. [Architecture](#architecture)
4. [Configuration](#configuration)
5. [Base de données](#base-de-données)
6. [API Endpoints](#api-endpoints)
7. [Authentification](#authentification)
8. [Services](#services)
9. [Sécurité](#sécurité)
10. [Déploiement](#déploiement)

---

## 🎯 Vue d'ensemble

Le backend CINEHOME est une **API RESTful** construite avec Node.js et Express, offrant des services d'authentification, de gestion d'utilisateurs, de reviews de films et d'intégration avec des services tiers (Google OAuth, TMDB, Groq AI).

### Caractéristiques principales
- ✅ **Authentification JWT** avec bcrypt pour le hashing
- ✅ **Google OAuth 2.0** pour le login social
- ✅ **MongoDB Atlas** pour la persistance des données
- ✅ **Envoi d'emails** avec Nodemailer (récupération mot de passe)
- ✅ **API TMDB** pour la recherche de films
- ✅ **Groq AI Chatbot** pour l'assistance utilisateur
- ✅ **CORS configuré** pour le frontend
- ✅ **Variables d'environnement** pour la sécurité

---

## 🛠️ Technologies utilisées

### **Core Framework**
```json
{
  "express": "^5.1.0"  // Framework web Node.js
}
```
- **Express.js 5.x** - Framework minimaliste et flexible pour Node.js
- Gestion des routes, middleware, et HTTP
- Support natif des Promises et async/await
- Performance optimisée

### **Base de données**
```json
{
  "mongoose": "^8.19.1"  // ODM MongoDB
}
```
- **MongoDB Atlas** - Base de données NoSQL cloud
- **Mongoose 8.x** - ODM (Object Document Mapper) pour MongoDB
- Schémas typés et validation des données
- Middleware pre/post hooks
- Connexion sécurisée via URI

### **Authentification & Sécurité**
```json
{
  "bcryptjs": "^3.0.2",           // Hashing des mots de passe
  "jsonwebtoken": "^9.0.2",       // Génération/validation JWT
  "google-auth-library": "^10.4.1" // OAuth Google
}
```

#### **bcryptjs**
- Hashing sécurisé des mots de passe
- Salage automatique (10 rounds par défaut)
- Résistant aux attaques par force brute
- Comparaison sécurisée des hashs

**Utilisation:**
```javascript
const bcrypt = require('bcryptjs');

// Hash du mot de passe lors de l'inscription
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Vérification lors du login
const isMatch = await bcrypt.compare(password, user.password);
```

#### **jsonwebtoken (JWT)**
- Tokens stateless pour l'authentification
- Signature avec secret (HS256)
- Expiration configurable (1h par défaut)
- Payload personnalisable

**Utilisation:**
```javascript
const jwt = require('jsonwebtoken');

// Génération du token
const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Vérification du token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

#### **google-auth-library**
- OAuth 2.0 pour Google Sign-In
- Vérification des ID tokens
- Récupération des informations utilisateur
- Support du refresh token

### **Communication HTTP**
```json
{
  "axios": "^1.12.2",  // Client HTTP
  "cors": "^2.8.5"     // Cross-Origin Resource Sharing
}
```

#### **axios**
- Requêtes HTTP vers APIs externes (TMDB, Google)
- Support des intercepteurs
- Transformation automatique JSON
- Gestion des timeouts

#### **cors**
- Autorisation des requêtes cross-origin
- Configuration flexible par origine
- Support des credentials (cookies)
- Headers personnalisés

**Configuration:**
```javascript
app.use(cors({
  origin: true,       // Autorise toutes les origines
  credentials: true,  // Autorise les cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
}));
```

### **Services externes**
```json
{
  "nodemailer": "^7.0.9",  // Envoi d'emails
  "groq-sdk": "^0.34.0"    // IA conversationnelle
}
```

#### **nodemailer**
- Envoi d'emails transactionnels
- Support Gmail, SMTP, etc.
- Templates HTML/texte
- Gestion des pièces jointes

**Utilisation:**
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

await transporter.sendMail({
  from: '"CINEHOME" <noreply@cinehome.com>',
  to: userEmail,
  subject: 'Code de vérification',
  html: `<p>Votre code: <strong>${code}</strong></p>`
});
```

#### **groq-sdk**
- Chatbot IA avec Groq
- Modèles LLM optimisés
- Streaming de réponses
- Context awareness

### **Configuration**
```json
{
  "dotenv": "^17.2.3"  // Variables d'environnement
}
```

#### **dotenv**
- Chargement des variables `.env`
- Séparation config/code
- Sécurité des credentials
- Multi-environnements (dev/prod)

---

## 🏗️ Architecture

### Structure des dossiers
```
src/
├── app.js                      # Point d'entrée principal
├── config/
│   └── db.js                   # Configuration MongoDB
├── controllers/
│   ├── userControllers.js      # Logique métier utilisateurs
│   └── reviewController.js     # Logique métier reviews
├── models/
│   ├── userModel.js            # Schéma MongoDB User
│   └── reviewModel.js          # Schéma MongoDB Review
├── routes/
│   ├── userRoutes.js           # Routes API utilisateurs
│   └── reviewRoutes.js         # Routes API reviews
├── services/
│   └── emailService.js         # Service d'envoi d'emails
└── email.js                    # Routes OAuth Google
```

### Pattern MVC (Model-View-Controller)
```
┌─────────────┐
│   Client    │  (Frontend)
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────┐
│   Routes    │  Routage des endpoints
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controllers │  Logique métier
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Models    │  Schémas de données
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  MongoDB    │  Base de données
└─────────────┘
```

### Flux de requête typique

**Exemple: Login utilisateur**
```
1. POST /api/users/login
   ↓
2. userRoutes.js → Route vers controller
   ↓
3. userControllers.js → login()
   ↓
4. Recherche User dans MongoDB
   ↓
5. Vérification bcrypt du password
   ↓
6. Génération JWT
   ↓
7. Réponse JSON { token, message }
```

---

## ⚙️ Configuration

### Variables d'environnement (.env)

```bash
# MongoDB
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/cinehome?retryWrites=true&w=majority

# JWT Secret (générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=votre_secret_jwt_tres_securise_32_caracteres_minimum

# Email (Gmail)
EMAIL_USER=votre.email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application

# Google OAuth
GOOGLE_CLIENT_ID=votre_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre_client_secret
GOOGLE_CALLBACK_URL=https://cinemaf.onrender.com/auth/google/callback
GOOGLE_LOGIN_CALLBACK_URL=https://cinemaf.onrender.com/auth/google/login/callback

# Frontend
FRONTEND_LOGIN_URL=https://cinemaf.onrender.com/profil.html

# Server
PORT=3001
NODE_ENV=production
```

### Configuration par environnement

**Développement local:**
```bash
API_BASE_URL=http://localhost:3001
FRONTEND_LOGIN_URL=http://localhost:3001/profil.html
```

**Production (Render):**
```bash
API_BASE_URL=https://cinemaf.onrender.com
FRONTEND_LOGIN_URL=https://cinemaf.onrender.com/profil.html
```

---

## 💾 Base de données

### MongoDB Atlas

**Connexion:**
```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

### Schéma User (userModel.js)

```javascript
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  createdViaOAuth: { 
    type: Boolean, 
    default: false 
  },
  oauthProvider: { 
    type: String, 
    enum: ['google', 'github', null], 
    default: null 
  }
}, {
  timestamps: true  // createdAt, updatedAt automatiques
});

// Middleware: Hash du password avant save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
```

### Schéma Review (reviewModel.js)

```javascript
const reviewSchema = new mongoose.Schema({
  movieId: { 
    type: Number, 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  userEmail: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  comment: { 
    type: String, 
    required: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Index pour requêtes rapides
reviewSchema.index({ movieId: 1, userId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
```

---

## 🔌 API Endpoints

### **Authentification utilisateur**

#### `POST /api/users/register`
Inscription d'un nouvel utilisateur.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201):**
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "_id": "673c5507...",
    "email": "user@example.com",
    "createdViaOAuth": false,
    "createdAt": "2025-11-07T10:30:00.000Z"
  }
}
```

**Erreurs:**
- `400` - Utilisateur déjà existant
- `500` - Erreur serveur

---

#### `POST /api/users/login`
Connexion d'un utilisateur existant.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs:**
- `404` - Utilisateur non trouvé
- `401` - Mot de passe incorrect
- `500` - Erreur serveur

---

#### `POST /api/users/forgot-password`
Demande de réinitialisation du mot de passe.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Código enviado com sucesso",
  "expiresIn": "10 minutos",
  "code": "123456"  // Uniquement en mode dev
}
```

**Process:**
1. Génération d'un code à 6 chiffres
2. Stockage en mémoire (Map) avec expiration 10 min
3. Envoi du code par email
4. Retour de la confirmation

---

#### `POST /api/users/verify-reset-code`
Vérification du code de réinitialisation.

**Request:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response (200):**
```json
{
  "message": "Code vérifié avec succès",
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs:**
- `400` - Code invalide, expiré ou introuvable

---

#### `POST /api/users/reset-password`
Réinitialisation du mot de passe avec le token.

**Request:**
```json
{
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "NewSecurePassword123!"
}
```

**Response (200):**
```json
{
  "message": "Mot de passe réinitialisé avec succès"
}
```

---

#### `POST /api/users/change-password`
Changement de mot de passe (utilisateur connecté).

**Request:**
```json
{
  "email": "user@example.com",
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Response (200):**
```json
{
  "message": "Senha alterada com sucesso"
}
```

**Erreurs:**
- `400` - Nouvelle senha égale à l'ancienne
- `401` - Senha actuelle incorrecte
- `404` - Utilisateur non trouvé

---

### **Google OAuth**

#### `GET /auth/google/login`
Initie le flux OAuth Google pour le login.

**Redirection vers:**
```
https://accounts.google.com/o/oauth2/v2/auth?
  client_id=...&
  redirect_uri=...&
  response_type=code&
  scope=email+profile
```

---

#### `GET /auth/google/login/callback`
Callback après authentification Google.

**Process:**
1. Récupération du code d'autorisation
2. Échange code → access_token
3. Récupération des infos utilisateur Google
4. Recherche ou création de l'utilisateur
5. Génération JWT
6. Redirection vers frontend avec token

**Redirection finale:**
```
https://cinemaf.onrender.com/profil.html?token=JWT&email=user@example.com
```

---

### **Reviews (Avis utilisateurs)**

#### `POST /api/reviews`
Créer un avis pour un film.

**Request:**
```json
{
  "movieId": 550,
  "userEmail": "user@example.com",
  "rating": 5,
  "comment": "Film incroyable ! Un chef-d'œuvre absolu."
}
```

**Response (201):**
```json
{
  "message": "Review criado com sucesso",
  "review": {
    "_id": "673c5507...",
    "movieId": 550,
    "rating": 5,
    "comment": "Film incroyable !",
    "createdAt": "2025-11-07T10:30:00.000Z"
  }
}
```

---

#### `GET /api/reviews/:movieId`
Récupérer tous les avis d'un film.

**Response (200):**
```json
{
  "reviews": [
    {
      "_id": "673c5507...",
      "userEmail": "user@example.com",
      "rating": 5,
      "comment": "Film incroyable !",
      "createdAt": "2025-11-07T10:30:00.000Z"
    }
  ],
  "averageRating": 4.5,
  "totalReviews": 42
}
```

---

#### `PUT /api/reviews/:id`
Modifier un avis existant.

**Request:**
```json
{
  "rating": 4,
  "comment": "Après réflexion, c'était juste très bon."
}
```

---

#### `DELETE /api/reviews/:id`
Supprimer un avis.

**Response (200):**
```json
{
  "message": "Review deletado com sucesso"
}
```

---

### **TMDB Search**

#### `GET /api/tmdb/search?query=Matrix`
Recherche de films via TMDB.

**Response (200):**
```json
{
  "results": [
    {
      "id": 603,
      "title": "The Matrix",
      "poster_path": "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      "vote_average": 8.2,
      "release_date": "1999-03-30"
    }
  ],
  "total_results": 156
}
```

---

### **Groq AI Chatbot**

#### `POST /api/chat`
Conversation avec le chatbot IA.

**Request:**
```json
{
  "message": "Recommande-moi un film de science-fiction"
}
```

**Response (200):**
```json
{
  "response": "Je te recommande 'Blade Runner 2049' ! C'est un chef-d'œuvre visuel..."
}
```

---

### **Health Check**

#### `GET /health`
Vérifier l'état du serveur.

**Response (200):**
```json
{
  "status": "ok",
  "time": "2025-11-07T10:30:00.000Z"
}
```

---

## 🔐 Authentification

### Flux JWT

```
1. User login → POST /api/users/login
   ↓
2. Vérification email/password
   ↓
3. Génération JWT avec payload { id: user._id }
   ↓
4. Retour token au client
   ↓
5. Client stocke token (localStorage)
   ↓
6. Requêtes suivantes avec header:
   Authorization: Bearer <token>
   ↓
7. Backend vérifie JWT avec middleware
   ↓
8. Accès aux ressources protégées
```

### Middleware d'authentification

```javascript
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Récupérer le token du header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Token manquant' });
  }
  
  const token = authHeader.split(' ')[1]; // "Bearer TOKEN"
  
  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ajouter l'ID utilisateur à la requête
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
}

// Utilisation
router.get('/profile', authMiddleware, getProfile);
```

---

## 📧 Services

### EmailService (emailService.js)

Service centralisé pour l'envoi d'emails.

```javascript
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  
  async sendVerificationCode(email, code) {
    const mailOptions = {
      from: '"CINEHOME" <noreply@cinehome.com>',
      to: email,
      subject: 'Code de vérification CINEHOME',
      html: `
        <div style="font-family: Arial; max-width: 600px;">
          <h2>Réinitialisation de mot de passe</h2>
          <p>Votre code de vérification:</p>
          <h1 style="color: #e50914; font-size: 32px;">${code}</h1>
          <p>Ce code expire dans 10 minutes.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        </div>
      `
    };
    
    return await this.transporter.sendMail(mailOptions);
  }
  
  async testEmailConfiguration() {
    try {
      await this.transporter.verify();
      console.log('✅ Configuration email valide');
      return true;
    } catch (error) {
      console.warn('⚠️ Configuration email invalide:', error.message);
      return false;
    }
  }
}

module.exports = new EmailService();
```

---

## 🔒 Sécurité

### Bonnes pratiques implémentées

#### 1. **Hashing des mots de passe**
```javascript
// ✅ Utilisation de bcrypt avec salt
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

#### 2. **JWT avec expiration**
```javascript
// ✅ Tokens avec durée de vie limitée
const token = jwt.sign({ id: user._id }, JWT_SECRET, { 
  expiresIn: '1h' 
});
```

#### 3. **Variables d'environnement**
```javascript
// ✅ Secrets stockés dans .env
require('dotenv').config();
const secret = process.env.JWT_SECRET;
```

#### 4. **Validation des entrées**
```javascript
// ✅ Validation côté serveur
if (!email || !email.includes('@')) {
  return res.status(400).json({ message: 'Email invalide' });
}

if (!password || password.length < 6) {
  return res.status(400).json({ message: 'Mot de passe trop court' });
}
```

#### 5. **CORS configuré**
```javascript
// ✅ Limitation des origines autorisées
app.use(cors({
  origin: ['https://cinemaf.onrender.com'],
  credentials: true
}));
```

#### 6. **Protection contre les injections**
```javascript
// ✅ Mongoose sanitize automatiquement les queries
const user = await User.findOne({ email });
```

#### 7. **Rate limiting** (À implémenter)
```javascript
// TODO: Ajouter express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requêtes
});

app.use('/api/', limiter);
```

---

## 🚀 Déploiement

### Render.com (Production)

**Configuration:**
```yaml
# render.yaml
services:
  - type: web
    name: cinehome-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        sync: false  # Variable sensible
      - key: JWT_SECRET
        sync: false
      - key: GOOGLE_CLIENT_ID
        sync: false
```

**Build settings:**
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Node Version:** 18.x ou supérieur
- **Auto-Deploy:** Activé sur push main

### Local Development

```bash
# Installation
npm install

# Démarrage en mode dev (avec nodemon)
npm run dev

# Démarrage en mode production
npm start

# Variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs
```

### Scripts package.json

```json
{
  "scripts": {
    "start": "node src/app.js",        // Production
    "dev": "nodemon src/app.js",       // Développement
    "test": "echo \"No tests yet\""    // Tests (TODO)
  }
}
```

---

## 📊 Monitoring & Logs

### Logging dans l'application

```javascript
// ✅ Logs structurés avec émojis
console.log('✅ MongoDB connecté');
console.error('❌ Erreur de connexion:', error);
console.warn('⚠️ Configuration manquante');
console.log('📨 POST /api/users/login');
```

### Logs Render.com
- Accessible via le dashboard Render
- Temps réel avec `render logs`
- Filtres par niveau (info, error, warn)

### Monitoring recommandé
- **Uptime:** UptimeRobot, Pingdom
- **APM:** New Relic, Datadog
- **Errors:** Sentry
- **Analytics:** Mixpanel, Amplitude

---

## 🧪 Tests (À implémenter)

### Structure recommandée

```
tests/
├── unit/
│   ├── models/
│   │   └── userModel.test.js
│   └── controllers/
│       └── userController.test.js
├── integration/
│   └── api/
│       ├── auth.test.js
│       └── reviews.test.js
└── e2e/
    └── user-flow.test.js
```

### Frameworks recommandés
- **Jest** - Framework de test complet
- **Supertest** - Tests d'API HTTP
- **MongoDB Memory Server** - Base de test en mémoire

**Exemple test:**
```javascript
const request = require('supertest');
const app = require('../src/app');

describe('POST /api/users/register', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        email: 'test@example.com',
        password: 'Test123!'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('test@example.com');
  });
});
```

---

## 📝 TODO & Améliorations

### Court terme
- [ ] Ajouter rate limiting avec `express-rate-limit`
- [ ] Implémenter tests unitaires et d'intégration
- [ ] Ajouter validation avec `joi` ou `express-validator`
- [ ] Logger avec `winston` ou `pino`
- [ ] Documentation Swagger/OpenAPI

### Moyen terme
- [ ] Système de refresh tokens JWT
- [ ] Pagination des reviews
- [ ] Upload d'avatars utilisateurs (AWS S3, Cloudinary)
- [ ] Webhooks pour notifications
- [ ] Cache avec Redis

### Long terme
- [ ] GraphQL API en complément REST
- [ ] Microservices (auth, reviews, notifications)
- [ ] WebSockets pour chat en temps réel
- [ ] CI/CD avec GitHub Actions
- [ ] Kubernetes pour orchestration

---

## 📚 Ressources

### Documentation officielle
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Mongoose](https://mongoosejs.com/docs/)
- [JWT.io](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/)
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)

### Guides recommandés
- [REST API Best Practices](https://restfulapi.net/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [MongoDB Schema Design](https://www.mongodb.com/docs/manual/data-modeling/)

---


