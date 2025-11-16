# 📚 DOCUMENTATION FRONTEND - CINEHOME

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture des fichiers](#architecture-des-fichiers)
3. [Modules principaux](#modules-principaux)
4. [Pages HTML](#pages-html)
5. [Système de configuration](#système-de-configuration)
6. [Système d'authentification](#système-dauthentification)
7. [Système de notifications](#système-de-notifications)
8. [Intégration TMDB](#intégration-tmdb)
9. [Gestion des favoris](#gestion-des-favoris)
10. [Composants réutilisables](#composants-réutilisables)
11. [Styles et thème](#styles-et-thème)
12. [Bonnes pratiques](#bonnes-pratiques)

---

## 🎯 Vue d'ensemble

Le frontend CINEHOME est une application web single-page moderne pour la consultation de films, construite avec:
- **HTML5** sémantique
- **CSS3** moderne avec Dark Mode
- **JavaScript vanilla** (ES6+)
- **API TMDB** pour les données de films
- **LocalStorage** pour la persistance côté client

### Caractéristiques principales
- ✅ Authentification utilisateur (email/mot de passe + Google OAuth)
- ✅ Système de recherche de films avec TMDB
- ✅ Gestion des favoris par utilisateur
- ✅ Système de profils multiples
- ✅ Interface responsive et accessible
- ✅ Notifications toast en temps réel
- ✅ Carousels de films par catégories

---

## 📁 Architecture des fichiers

```
public/
├── 🎨 STYLES
│   ├── style.css                    # Styles globaux principaux
│   ├── layout.css                   # Layout et grid system
│   ├── index.css                    # Page d'accueil spécifique
│   ├── categories.css               # Styles des carousels
│   ├── search-combined.css          # Styles de recherche
│   ├── search-results.css           # Résultats de recherche
│   ├── movie-details.css            # Page détails film
│   ├── movie-details-modal.css      # Modal de détails
│   ├── video-modal.css              # Modal vidéo/trailer
│   ├── notifications.css            # Système de notifications
│   ├── favoritos.css                # Page favoris
│   ├── favoritos-page.css           # Styles page favoris
│   ├── profile-menu.css             # Menu profil
│   ├── profile-settings.css         # Paramètres profil
│   ├── footer-content.css           # Footer
│   ├── confirm-modal.css            # Modals de confirmation
│   └── ajuda.css                    # Page d'aide
│
├── 📄 PAGES HTML
│   ├── index.html                   # Page d'accueil (non authentifiée)
│   ├── home.html                    # Page d'accueil (authentifiée)
│   ├── login.html                   # Login/Inscription
│   ├── profil.html                  # Page profil utilisateur
│   ├── conta.html                   # Paramètres du compte
│   ├── manage-profiles.html         # Gestion des profils
│   ├── movie-details.html           # Détails d'un film
│   ├── favoritos.html               # Page des favoris
│   ├── reset.html                   # Réinitialisation mot de passe
│   ├── ajuda.html                   # Page d'aide/FAQ
│   ├── ajuda-setup.html             # Guide de configuration
│   ├── setup-tmdb-key.html          # Configuration clé TMDB
│   ├── installation-success.html    # Confirmation installation
│   └── enrich-data.html             # Outil enrichissement données
│
├── ⚙️ CONFIGURATION
│   ├── config.js                    # Configuration globale API
│   ├── auto-config-tmdb.js          # Auto-configuration TMDB
│   └── verify-config.js             # Vérification config
│
├── 🔐 AUTHENTIFICATION
│   ├── auth.js                      # Système d'auth (requireAuth, logout)
│   └── main.js                      # Logique login/register/forgot password
│
├── 🎬 FILMS & TMDB
│   ├── categories.js                # Gestion des catégories de films
│   ├── categories-data.js           # Données statiques des catégories
│   ├── categories-data-enriched.js  # Données enrichies TMDB
│   ├── categories-tmdb.js           # Intégration TMDB pour catégories
│   ├── categories-tmdb-manager.js   # Manager de catégories TMDB
│   ├── enrich-categories-data.js    # Enrichissement des données
│   ├── movie-details.js             # Logique page détails
│   ├── movie-details-modal.js       # Modal détails rapides
│   ├── video-modal.js               # Modal de lecture vidéo
│   ├── moviesData.js                # Données de films
│   └── data.js                      # Utilitaires données
│
├── ❤️ FAVORIS
│   ├── favoritos.js                 # Logique page favoris
│   └── favoritos-page.js            # Interactions page favoris
│
├── 🔍 RECHERCHE
│   ├── search.js                    # Système de recherche
│   └── search.js.backup             # Backup recherche
│
├── 👤 PROFIL
│   ├── profile-menu.js              # Menu du profil
│   └── profile-settings.js          # Paramètres profil
│
├── 🔔 NOTIFICATIONS
│   ├── notifications.js             # Système toast notifications
│   └── notifications-guide.js       # Guide d'utilisation
│
├── 🎪 COMPOSANTS UI
│   ├── carousel.js                  # Carousel de films
│   ├── footer.js                    # Footer dynamique
│   ├── footer-content.js            # Contenu du footer
│   ├── confirm-modal.js             # Modals de confirmation
│   └── index.js                     # Scripts page index
│
├── 👥 UTILISATEURS & REVIEWS
│   └── user-reviews.js              # Système d'avis utilisateurs
│
├── 🧪 TESTS & DEBUG
│   ├── test-auto-config-tmdb.html   # Test auto-config
│   ├── test-categories-enriched.html # Test catégories
│   ├── test-details.html            # Test détails
│   ├── test-favoritos.html          # Test favoris
│   ├── test-login-debug.html        # Test login
│   ├── test-modal-details.html      # Test modal
│   ├── test-reviews.html            # Test reviews
│   └── test-tmdb-debug.html         # Test TMDB
│
├── 📖 DOCUMENTATION
│   ├── README-AUTO-CONFIG-TMDB.md   # Doc auto-config
│   ├── AUTO-CONFIG-TMDB.md          # Doc TMDB
│   ├── DEBUG-LOGIN.md               # Doc debug login
│   ├── READNE.md                    # Readme général
│   └── docs-auto-config-tmdb.html   # Doc HTML
│
└── 🖼️ ASSETS
    ├── imagens/                     # Images du site
    ├── img/                         # Images et icônes
    └── image.png                    # Image de référence
```

---

## 🔧 Modules principaux

### 1. **config.js** - Configuration globale

```javascript
const CONFIG = {
  API_BASE_URL: 'https://cinemaf.onrender.com',
  
  ENDPOINTS: {
    LOGIN: '/api/users/login',
    REGISTER: '/api/users/register',
    FORGOT_PASSWORD: '/api/users/forgot-password',
    VERIFY_RESET_CODE: '/api/users/verify-reset-code',
    RESET_PASSWORD: '/api/users/reset-password',
    HEALTH: '/health'
  },
  
  SETTINGS: {
    REQUEST_TIMEOUT: 12000,
    PASSWORD_MIN_LENGTH: 6,
    CODE_LENGTH: 6
  }
};
```

**Fonctions utilitaires:**
- `getApiUrl(endpoint)` - Construit l'URL complète d'un endpoint
- `checkBackendHealth()` - Vérifie la santé du backend
- `TMDBConfig.verificarConfiguracao()` - Vérifie si TMDB est configuré
- `TMDBConfig.atualizarBotaoTMDB()` - Met à jour le statut du bouton TMDB

---

### 2. **auth.js** - Système d'authentification

```javascript
// Fonctions principales
window.auth = {
  isAuthenticated(),      // Vérifie si l'utilisateur est connecté
  requireAuth(),          // Protège une page (redirige si non auth)
  logout(),              // Déconnecte l'utilisateur
  getCurrentUser(),      // Récupère les infos utilisateur
  displayUserInfo(selector) // Affiche les infos dans l'UI
};
```

**Utilisation:**
```javascript
// Protéger une page
if (!auth.requireAuth()) return;

// Récupérer l'utilisateur
const user = auth.getCurrentUser();
console.log(user.email, user.token);

// Déconnexion
document.getElementById('logout-btn').addEventListener('click', auth.logout);
```

**Stockage localStorage:**
- `token` - JWT d'authentification
- `userEmail` - Email de l'utilisateur connecté

---

### 3. **notifications.js** - Système de notifications

```javascript
// API globale
window.notify = {
  show(options),         // Affiche une notification personnalisée
  success(title, msg),   // Notification de succès (vert)
  error(title, msg),     // Notification d'erreur (rouge)
  warning(title, msg),   // Notification d'avertissement (orange)
  info(title, msg),      // Notification d'information (bleu)
  clearAll()            // Supprime toutes les notifications
};
```

**Exemples d'utilisation:**
```javascript
// Succès
notify.success('Connexion réussie!', 'Bienvenue sur CINEHOME');

// Erreur
notify.error('Erreur de connexion', 'Email ou mot de passe incorrect');

// Avertissement
notify.warning('Attention', 'Cette action est irréversible');

// Info
notify.info('Information', 'Nouvelle mise à jour disponible');

// Personnalisé
notify.show({
  type: 'success',
  title: 'Téléchargement',
  message: 'Fichier téléchargé avec succès',
  duration: 3000,
  closable: true
});
```

**Caractéristiques:**
- Maximum 3 notifications simultanées
- Auto-fermeture après 5 secondes (configurable)
- Pause au survol de la souris
- Animations fluides CSS
- Icônes SVG selon le type
- Responsive et accessible

---

### 4. **main.js** - Logique Login/Register

Gère les formulaires de:
- **Login** (email/password)
- **Inscription** (username/email/password)
- **Mot de passe oublié** (envoi code par email)
- **Vérification code** (code à 6 chiffres)
- **Réinitialisation mot de passe**
- **Login Google OAuth**

**Workflow Login:**
```javascript
// 1. Soumission du formulaire
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // 2. Récupération des données
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  // 3. Appel API
  const response = await fetch(getApiUrl('LOGIN'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  // 4. Traitement réponse
  const data = await response.json();
  
  if (response.ok) {
    // 5. Stockage des credentials
    localStorage.setItem('token', data.token);
    localStorage.setItem('userEmail', email);
    
    // 6. Notification et redirection
    notify.success('Connexion réussie!', 'Bienvenue sur CINEHOME');
    setTimeout(() => window.location.href = 'home.html', 1500);
  } else {
    notify.error('Erreur de connexion', data.message);
  }
});
```

---

### 5. **categories.js** - Gestion des films

Fonctions principales:
- `loadMovies()` - Charge les films depuis TMDB
- `createMovieCard(movie)` - Crée une carte de film
- `initCarousel(container)` - Initialise un carousel
- `filterByCategory(category)` - Filtre par catégorie
- `searchMovies(query)` - Recherche de films

**Intégration TMDB:**
```javascript
// Récupérer la clé API
const apiKey = localStorage.getItem('tmdb_api_key');

// Faire une requête
const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR`;
const response = await fetch(url);
const data = await response.json();

// Afficher les films
data.results.forEach(movie => {
  const card = createMovieCard(movie);
  container.appendChild(card);
});
```

---

### 6. **movie-details.js** - Page de détails

Affiche:
- Poster et backdrop du film
- Titre, année, durée, note
- Synopsis complet
- Genres et casting
- Vidéos/trailers disponibles
- Bouton ajout aux favoris
- Reviews utilisateurs

**Récupération des détails:**
```javascript
async function loadMovieDetails(movieId) {
  const apiKey = localStorage.getItem('tmdb_api_key');
  
  // Détails du film
  const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR`;
  const movie = await fetch(movieUrl).then(r => r.json());
  
  // Crédits (cast & crew)
  const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;
  const credits = await fetch(creditsUrl).then(r => r.json());
  
  // Vidéos/trailers
  const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;
  const videos = await fetch(videosUrl).then(r => r.json());
  
  // Afficher dans l'UI
  displayMovieDetails(movie, credits, videos);
}
```

---

### 7. **favoritos.js** - Gestion des favoris

Stockage dans **localStorage**:
```javascript
// Structure des favoris
{
  "user@example.com": [
    {
      id: 550,
      title: "Fight Club",
      poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      vote_average: 8.4,
      release_date: "1999-10-15",
      addedAt: "2025-11-07T10:30:00.000Z"
    }
  ]
}
```

**Fonctions:**
```javascript
// Récupérer les favoris de l'utilisateur
function getFavorites(userEmail) {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
  return favorites[userEmail] || [];
}

// Ajouter un favori
function addFavorite(userEmail, movie) {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
  
  if (!favorites[userEmail]) {
    favorites[userEmail] = [];
  }
  
  // Vérifier si déjà existant
  const exists = favorites[userEmail].some(fav => fav.id === movie.id);
  
  if (!exists) {
    movie.addedAt = new Date().toISOString();
    favorites[userEmail].push(movie);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    notify.success('Ajouté aux favoris!', movie.title);
  }
}

// Retirer un favori
function removeFavorite(userEmail, movieId) {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
  
  if (favorites[userEmail]) {
    favorites[userEmail] = favorites[userEmail].filter(fav => fav.id !== movieId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    notify.success('Retiré des favoris!');
  }
}

// Vérifier si un film est favori
function isFavorite(userEmail, movieId) {
  const favorites = getFavorites(userEmail);
  return favorites.some(fav => fav.id === movieId);
}
```

---

### 8. **carousel.js** - Composant carousel

Crée des carousels horizontaux défilants pour les films.

**Fonctionnalités:**
- Navigation par boutons gauche/droite
- Défilement tactile (swipe) sur mobile
- Animation fluide
- Responsive
- Support clavier (flèches)

**Initialisation:**
```javascript
// HTML
<div class="carousel-container">
  <button class="carousel-btn prev">‹</button>
  <div class="carousel-track">
    <!-- Les cards de films ici -->
  </div>
  <button class="carousel-btn next">›</button>
</div>

// JavaScript
const carousel = document.querySelector('.carousel-container');
initCarousel(carousel);
```

---

### 9. **search.js** - Système de recherche

Recherche en temps réel avec debounce.

```javascript
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const resultsContainer = document.querySelector('.search-results');

let searchTimeout;

searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  
  const query = e.target.value.trim();
  
  if (query.length >= 3) {
    searchTimeout = setTimeout(() => {
      searchMovies(query);
    }, 500); // Debounce de 500ms
  } else {
    resultsContainer.innerHTML = '';
  }
});

async function searchMovies(query) {
  const apiKey = localStorage.getItem('tmdb_api_key');
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    displaySearchResults(data.results);
  } catch (error) {
    notify.error('Erreur de recherche', error.message);
  }
}

function displaySearchResults(movies) {
  resultsContainer.innerHTML = '';
  
  if (movies.length === 0) {
    resultsContainer.innerHTML = '<p>Aucun résultat trouvé</p>';
    return;
  }
  
  movies.forEach(movie => {
    const card = createMovieCard(movie);
    resultsContainer.appendChild(card);
  });
}
```

---

## 🎨 Pages HTML

### **index.html** - Page d'accueil publique
- Hero section avec slider
- Carousels de films populaires
- CTA pour s'inscrire
- Footer avec liens

### **home.html** - Page d'accueil authentifiée
- Menu de navigation avec profil
- Carousels personnalisés
- Recherche avancée
- Accès aux favoris

### **login.html** - Authentification
- Formulaire login/register (toggle)
- Login Google OAuth
- Mot de passe oublié
- Validation côté client

### **profil.html** - Profil utilisateur
- Informations du compte
- Gestion des profils multiples
- Historique de visionnage
- Paramètres

### **movie-details.html** - Détails d'un film
- Informations complètes
- Trailer vidéo
- Cast & crew
- Reviews utilisateurs
- Films similaires

### **favoritos.html** - Liste des favoris
- Grid de films favoris
- Filtres et tri
- Suppression rapide
- Export/import (optionnel)

---

## 🎨 Styles et thème

### Palette de couleurs (Dark Mode)
```css
:root {
  /* Couleurs principales */
  --primary-color: #e50914;      /* Rouge CINEHOME */
  --secondary-color: #564d4d;    /* Gris foncé */
  --background: #141414;         /* Noir background */
  --surface: #1f1f1f;           /* Surface cards */
  --text-primary: #ffffff;       /* Texte principal */
  --text-secondary: #b3b3b3;     /* Texte secondaire */
  
  /* États */
  --success: #46d369;
  --error: #e87c03;
  --warning: #ffc107;
  --info: #2196f3;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.2);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.3);
  --shadow-lg: 0 8px 16px rgba(0,0,0,0.4);
}
```

### Classes utilitaires
```css
/* Buttons */
.btn { padding: 10px 20px; border-radius: var(--radius-md); }
.btn-primary { background: var(--primary-color); color: white; }
.btn-secondary { background: var(--secondary-color); color: white; }

/* Cards */
.card { background: var(--surface); border-radius: var(--radius-lg); }

/* Text */
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }

/* Spacing */
.mt-1 { margin-top: var(--spacing-sm); }
.mb-2 { margin-bottom: var(--spacing-md); }
.p-3 { padding: var(--spacing-lg); }
```

---

## ✅ Bonnes pratiques

### 1. **Sécurité**
```javascript
// ✅ BON - Vérifier l'authentification
if (!auth.requireAuth()) return;

// ✅ BON - Nettoyer les inputs utilisateur
const safeInput = input.trim().replace(/<script>/gi, '');

// ❌ MAUVAIS - Ne jamais stocker le mot de passe en clair
localStorage.setItem('password', password); // NON !
```

### 2. **Performance**
```javascript
// ✅ BON - Debounce pour la recherche
let timeout;
input.addEventListener('input', () => {
  clearTimeout(timeout);
  timeout = setTimeout(search, 500);
});

// ✅ BON - Lazy loading des images
<img loading="lazy" src="poster.jpg" alt="Film">

// ✅ BON - Limiter les requêtes API
const cache = new Map();
if (cache.has(movieId)) {
  return cache.get(movieId);
}
```

### 3. **Accessibilité**
```html
<!-- ✅ BON - Labels pour les inputs -->
<label for="email">Email</label>
<input id="email" type="email" aria-required="true">

<!-- ✅ BON - Alt pour les images -->
<img src="poster.jpg" alt="Affiche du film Fight Club">

<!-- ✅ BON - ARIA pour les boutons -->
<button aria-label="Ajouter aux favoris" aria-pressed="false">
  ❤️
</button>

<!-- ✅ BON - Navigation clavier -->
<div tabindex="0" role="button">Cliquez-moi</div>
```

### 4. **Gestion d'erreurs**
```javascript
// ✅ BON - Try/catch et feedback utilisateur
try {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const data = await response.json();
  return data;
  
} catch (error) {
  console.error('Erreur:', error);
  notify.error('Erreur', 'Impossible de charger les données');
  return null;
}

// ✅ BON - Validation côté client
if (!email || !email.includes('@')) {
  notify.error('Email invalide', 'Veuillez entrer un email valide');
  return;
}
```

### 5. **Code propre**
```javascript
// ✅ BON - Fonctions pures et réutilisables
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR');
}

// ✅ BON - Nommage explicite
const isUserAuthenticated = auth.isAuthenticated();
const userFavoriteMovies = getFavorites(userEmail);

// ✅ BON - Commentaires utiles
/**
 * Ajoute un film aux favoris de l'utilisateur
 * @param {string} userEmail - Email de l'utilisateur
 * @param {Object} movie - Objet film TMDB
 * @returns {boolean} - Succès de l'opération
 */
function addFavorite(userEmail, movie) {
  // ...
}
```

---

## 🚀 Démarrage rapide

### 1. Configuration initiale
```bash
# Cloner le projet
git clone https://github.com/eliswilliam/CINEMAF.git
cd CINEMAF/public

# Ouvrir index.html dans le navigateur
```

### 2. Configuration TMDB
1. Obtenir une clé API sur [themoviedb.org](https://www.themoviedb.org/settings/api)
2. Cliquer sur "Configurar TMDB" dans l'interface
3. Entrer la clé API
4. Valider et profiter !

### 3. Variables d'environnement (config.js)
```javascript
// Modifier selon votre environnement
const CONFIG = {
  API_BASE_URL: 'http://localhost:3001', // Dev local
  // API_BASE_URL: 'https://cinemaf.onrender.com', // Production
};
```

---

## 📞 Support et contribution

- **Issues GitHub**: [https://github.com/eliswilliam/CINEMAF/issues](https://github.com/eliswilliam/CINEMAF/issues)
- **Documentation**: Voir les fichiers `.md` dans `/public`
- **Tests**: Voir les fichiers `test-*.html` pour les exemples

---

## 📝 Changelog

### Version actuelle (Nov 2025)
- ✅ Système d'authentification complet
- ✅ Intégration TMDB fonctionnelle
- ✅ Système de favoris avec localStorage
- ✅ Notifications toast
- ✅ Responsive design
- ✅ Dark mode
- ✅ Google OAuth
- ✅ Système de profils multiples

### À venir
- ⏳ Watchlist (liste de visionnage)
- ⏳ Recommandations personnalisées
- ⏳ Mode hors-ligne (PWA)
- ⏳ Partage social
- ⏳ Thème clair

---

**Dernière mise à jour:** 7 novembre 2025  
**Auteur:** CINEHOME Team  
**Licence:** MIT
