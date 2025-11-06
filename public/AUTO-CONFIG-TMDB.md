# Auto-Configuration TMDB - Frontend

## 📋 Description

Ce système configure **automatiquement** la clé API TMDB dans le frontend après la connexion de l'utilisateur, sans toucher au backend.

## 🔑 Clé API Configurée

```
TMDB_API_KEY=0195eb509bb44f3857d46334a34f118c
```

## ⚙️ Fonctionnement

### 1. Fichier Principal
**`auto-config-tmdb.js`** - Script autonome qui :
- ✅ Détecte automatiquement la connexion de l'utilisateur
- ✅ Configure la clé API TMDB dans le `localStorage`
- ✅ Met à jour l'interface (bouton "Configurado")
- ✅ Déclenche des événements pour les autres scripts

### 2. Intégration

Le script est chargé dans :
- ✅ `login.html` - Pour configuration après login
- ✅ `profil.html` - Pour configuration après sélection de profil
- ✅ `home.html` - Pour vérification au chargement de la page

### 3. Déclencheurs

La configuration automatique se déclenche :
1. **Au chargement de la page** - Si l'utilisateur est déjà connecté
2. **Après connexion réussie** - Via l'événement `user-logged-in`
3. **Entre onglets** - Via l'événement `storage` du localStorage

## 🚀 Flux d'Exécution

```
login.html
   └─> Utilisateur se connecte
       └─> main.js enregistre le token
           └─> Événement 'user-logged-in' déclenché
               └─> auto-config-tmdb.js configure la clé API
                   └─> localStorage.setItem('tmdb_api_key', '...')
                       └─> Redirection vers profil.html
                           └─> auto-config-tmdb.js vérifie la configuration
                               └─> Utilisateur sélectionne un profil
                                   └─> Redirection vers home.html
                                       └─> API TMDB déjà configurée ✅
```

## 🎯 Avantages

1. **Aucune modification du backend** - 100% frontend
2. **Configuration automatique** - L'utilisateur n'a rien à faire
3. **Persistant** - La clé reste dans le localStorage
4. **Multi-onglets** - Synchronisation automatique
5. **Événements personnalisés** - Autres scripts peuvent réagir

## 🔍 Vérification

Pour vérifier que la configuration fonctionne :

### Console du navigateur
```javascript
// Vérifier la clé API
localStorage.getItem('tmdb_api_key')
// Devrait retourner: "0195eb509bb44f3857d46334a34f118c"
```

### Visuellement
- Le bouton "Configurar TMDB" devient "Configurado" ✅
- Le bouton change de couleur (bleu au lieu de gris)

## 📝 Événements Déclenchés

### `user-logged-in`
```javascript
window.dispatchEvent(new CustomEvent('user-logged-in', {
  detail: { email, token }
}));
```

### `tmdb-configured`
```javascript
window.dispatchEvent(new CustomEvent('tmdb-configured', {
  detail: { apiKey }
}));
```

## 🔧 Utilisation Manuelle (si nécessaire)

```javascript
// Configurer manuellement
window.autoConfigureTMDB()

// Vérifier la configuration
if (localStorage.getItem('tmdb_api_key')) {
  console.log('✅ TMDB configuré');
} else {
  console.log('❌ TMDB non configuré');
}
```

## ⚠️ Important

- La clé est stockée dans le **localStorage** du navigateur
- Elle persiste même après déconnexion (normal pour les préférences)
- Si l'utilisateur vide son cache, elle sera reconfigurée au prochain login
- Aucune donnée sensible n'est exposée (clé API publique TMDB)

## 🎨 Intégration avec l'Interface

Le script met à jour automatiquement :
- ✅ Le bouton de configuration TMDB
- ✅ L'état visuel (couleur, texte)
- ✅ Les tooltips et attributs ARIA

## 🔄 Cycle de Vie

1. **Premier chargement** → Script vérifie si utilisateur connecté
2. **Utilisateur non connecté** → Attend l'événement de connexion
3. **Connexion réussie** → Configure automatiquement la clé
4. **Navigation** → La clé est déjà disponible
5. **Rechargement** → Vérification et configuration si nécessaire

## ✅ Tests

Pour tester le système :

1. Effacer le localStorage : `localStorage.clear()`
2. Se connecter normalement
3. Vérifier la console : `✅ Clé API TMDB configurée automatiquement`
4. Vérifier le localStorage : `localStorage.getItem('tmdb_api_key')`
5. Observer le bouton : devrait afficher "Configurado"

## 📅 Date de Création

6 novembre 2025

---

**Note** : Ce système est entièrement frontend et ne nécessite aucune modification du backend.
