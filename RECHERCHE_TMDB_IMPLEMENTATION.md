# Implémentation de la Recherche TMDB dans home.html

## 📋 Vue d'ensemble

La recherche dans `home.html` a été mise à jour pour utiliser automatiquement l'API TMDB si elle est configurée sur le backend, avec un fallback vers le catalogue local si TMDB n'est pas disponible.

## ✨ Fonctionnalités

### 1. **Détection Automatique de TMDB**
- Au chargement de la page, le système vérifie si l'API TMDB est configurée
- Un indicateur visuel (badge) apparaît sur la barre de recherche :
  - **TMDB** (bleu) : Recherche via l'API TMDB activée
  - **LOCAL** (gris) : Recherche dans le catalogue local

### 2. **Recherche Intelligente**
- Si TMDB est disponible :
  - Recherche effectuée via l'API TMDB
  - Résultats provenant de la base de données mondiale de films
  - Badge **(TMDB)** affiché dans les résultats
  
- Si TMDB n'est pas disponible :
  - Fallback automatique vers le catalogue local
  - Pas d'interruption de service
  - Badge **(Local)** affiché dans les résultats

### 3. **Gestion des Erreurs**
- En cas d'erreur TMDB, passage automatique au catalogue local
- Messages d'erreur clairs pour l'utilisateur
- Animation visuelle si la recherche est trop courte (< 2 caractères)

## 🔧 Configuration

### Backend (obligatoire pour TMDB)

1. **Fichier `.env`** :
   ```env
   TMDB_API_KEY=votre_clé_api_tmdb
   ```

2. **Obtenir une clé API TMDB** :
   - Créer un compte sur [TMDB](https://www.themoviedb.org/)
   - Aller dans Paramètres → API
   - Copier votre clé API
   - L'ajouter au fichier `.env`

### Frontend

Aucune configuration supplémentaire n'est nécessaire. Le système détecte automatiquement la disponibilité de TMDB.

## 📁 Fichiers Modifiés

### 1. `public/search.js`
- ✅ Ajout de la fonction `checkTMDBAvailability()`
- ✅ Ajout de la fonction `searchInTMDB(query)`
- ✅ Ajout de l'indicateur visuel `updateSearchIndicator()`
- ✅ Modification de `performSearch()` pour router vers TMDB ou local
- ✅ Modification de `displayResults()` pour afficher la source

### 2. `public/home.html`
- ✅ Ajout du script `config.js` avant `auth.js`

### 3. `public/search-results.css`
- ✅ Ajout du style `.search-input-error` avec animation shake

## 🎯 Utilisation

### Pour l'utilisateur final

1. **Ouvrir `home.html`**
2. **Regarder le badge sur la barre de recherche** :
   - Badge **TMDB** bleu = recherche mondiale activée
   - Badge **LOCAL** gris = catalogue local uniquement

3. **Effectuer une recherche** :
   - Taper au moins 2 caractères
   - Appuyer sur Entrée ou cliquer sur le bouton de recherche
   - Les résultats s'affichent avec l'indication de la source

### Pour le développeur

```javascript
// Vérifier si TMDB est disponible
if (window.searchModule.isTMDBAvailable()) {
    console.log('TMDB actif');
} else {
    console.log('Catalogue local actif');
}

// Re-vérifier manuellement TMDB
await window.searchModule.checkTMDB();
```

## 🔄 Flux de Recherche

```
┌─────────────────────┐
│  Utilisateur tape   │
│   dans la barre     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Query >= 2 chars?  │
└──────────┬──────────┘
           │
           ▼ OUI
┌─────────────────────┐
│  TMDB disponible?   │
└──────────┬──────────┘
           │
      ┌────┴────┐
      │         │
     OUI       NON
      │         │
      ▼         ▼
┌──────────┐ ┌──────────────┐
│ Recherche│ │  Recherche   │
│   TMDB   │ │    Locale    │
└──────────┘ └──────────────┘
      │         │
      └────┬────┘
           ▼
   ┌──────────────┐
   │  Affichage   │
   │  Résultats   │
   └──────────────┘
```

## 🐛 Dépannage

### Badge "LOCAL" s'affiche au lieu de "TMDB"

**Causes possibles** :
1. La clé TMDB_API_KEY n'est pas dans le fichier `.env`
2. Le backend n'est pas démarré
3. Le backend n'est pas accessible à l'URL configurée dans `config.js`

**Solution** :
```bash
# 1. Vérifier le .env
cat .env | grep TMDB_API_KEY

# 2. Redémarrer le backend
npm start

# 3. Vérifier la console du navigateur
# Chercher les messages : "✅ API TMDB disponible" ou "ℹ️ API TMDB non configurée"
```

### Erreur "CONFIG is not defined"

**Cause** : Le fichier `config.js` n'est pas chargé avant `search.js`

**Solution** : Vérifier que dans `home.html`, `config.js` est bien chargé :
```html
<script src="config.js"></script>
<script src="search.js"></script>
```

### Les résultats TMDB ne s'affichent pas

**Vérifier dans la console du navigateur** :
- Message d'erreur de fetch
- Vérifier que `CONFIG.API_BASE_URL` pointe vers le bon serveur
- Tester l'endpoint directement : `POST http://localhost:3001/api/tmdb/search`

## 📊 Format des Résultats

### Résultats TMDB
```javascript
{
  id: 299534,
  title: "Avengers: Endgame",
  year: "2019",
  rating: "8.3",
  description: "After the devastating events...",
  image: "https://image.tmdb.org/t/p/w500/...",
  section: "TMDB",
  tmdbId: 299534,
  source: "tmdb"
}
```

### Résultats Locaux
```javascript
{
  id: undefined,
  title: "Vingadores: Ultimato",
  year: "2019",
  rating: "8.4",
  description: "Os Vingadores...",
  image: "https://image.tmdb.org/t/p/w500/...",
  section: "Filmes Populares"
}
```

## 🚀 Améliorations Futures

- [ ] Cache des résultats TMDB pour éviter les requêtes répétées
- [ ] Recherche combinée (TMDB + Local) avec déduplication
- [ ] Filtres par genre, année, note
- [ ] Pagination des résultats TMDB
- [ ] Mode hors ligne avec IndexedDB

## 📝 Notes

- Le système priorise TMDB sur le catalogue local pour des résultats plus complets
- Le fallback vers le local est transparent pour l'utilisateur
- L'indicateur visuel aide l'utilisateur à comprendre la source des résultats
- La recherche locale reste fonctionnelle même sans connexion au backend

## ✅ Tests Effectués

- [x] Recherche avec TMDB actif
- [x] Recherche avec TMDB inactif (fallback local)
- [x] Affichage de l'indicateur TMDB/LOCAL
- [x] Gestion des erreurs réseau
- [x] Animation d'erreur pour recherches trop courtes
- [x] Affichage correct de la source dans les résultats
- [x] Redirection vers movie-details.html avec ID TMDB

---

**Auteur** : GitHub Copilot  
**Date** : 4 novembre 2025  
**Version** : 1.0
