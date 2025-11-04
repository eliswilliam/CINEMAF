# 🚀 Guide Rapide - Configuration Google OAuth

## ⚡ Configuration Google Cloud Console (5 minutes)

### Étape 1 : Accéder à Google Cloud Console
1. Allez sur https://console.cloud.google.com/
2. Connectez-vous avec votre compte Google
3. Sélectionnez votre projet (ou créez-en un nouveau)

### Étape 2 : Activer l'API Google+
1. Dans le menu, allez dans **APIs & Services** > **Library**
2. Recherchez "Google+ API" 
3. Cliquez sur **Enable**

### Étape 3 : Configurer l'écran de consentement OAuth
1. Allez dans **APIs & Services** > **OAuth consent screen**
2. Sélectionnez **External** (pour tester)
3. Remplissez les informations requises :
   - App name : **CINEHOME**
   - User support email : votre email
   - Developer contact : votre email
4. Cliquez sur **Save and Continue**
5. Dans **Scopes**, cliquez juste sur **Save and Continue**
6. Dans **Test users**, ajoutez votre email Google pour tester
7. Cliquez sur **Save and Continue**

### Étape 4 : Créer les Credentials OAuth 2.0
1. Allez dans **APIs & Services** > **Credentials**
2. Cliquez sur **Create Credentials** > **OAuth 2.0 Client ID**
3. Application type : **Web application**
4. Name : **CINEHOME OAuth**

5. **Authorized JavaScript origins** :
   ```
   http://localhost:3001
   ```

6. **Authorized redirect URIs** (IMPORTANT - Ajoutez les 3) :
   ```
   http://localhost:3001/auth/google/callback
   http://localhost:3001/auth/google/login/callback
   http://localhost:3001/auth/google/signup/callback
   ```

7. Cliquez sur **Create**
8. **COPIEZ** le Client ID et Client Secret

### Étape 5 : Mettre à jour .env (déjà fait ✅)
Les credentials sont déjà dans votre `.env` :
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## ✅ Test de l'Application

### 1. Démarrer le serveur (déjà fait ✅)
```powershell
npm start
```

### 2. Ouvrir la page de login
Allez sur : http://localhost:3001/login.html

### 3. Tester le Login avec Google
1. Cliquez sur l'onglet **Login**
2. Vous devriez voir le bouton **"Continuar com Google"** avec le logo Google
3. Cliquez dessus
4. Connectez-vous avec votre compte Google
5. Si vous n'avez pas de compte, vous verrez un message d'erreur
6. Sinon, vous serez redirigé vers `profil.html`

### 4. Tester le Cadastro avec Google
1. Cliquez sur l'onglet **Cadastro**
2. Vous devriez voir le bouton **"Cadastrar com Google"**
3. Cliquez dessus
4. Connectez-vous avec votre compte Google
5. Un nouveau compte sera créé automatiquement
6. Vous serez redirigé vers `profil.html`

## 🎨 Aperçu des Boutons

Les boutons Google apparaissent comme ceci :

```
┌────────────────────────────────────────┐
│  [Email field                       ]  │
│  [Password field                    ]  │
│                                        │
│  ┌────────────────────────────────┐   │
│  │        Entrar                  │   │
│  └────────────────────────────────┘   │
│                                        │
│          ───── ou ─────                │
│                                        │
│  ┌────────────────────────────────┐   │
│  │ 🔵  Continuar com Google      │   │  ← Nouveau !
│  └────────────────────────────────┘   │
└────────────────────────────────────────┘
```

## 🔍 Vérification

### Backend
- ✅ Routes `/auth/google/login` et `/auth/google/signup` créées
- ✅ Callbacks configurés
- ✅ Modèle User mis à jour avec support OAuth
- ✅ Génération automatique de JWT tokens
- ✅ Hash des mots de passe avec bcryptjs

### Frontend
- ✅ Boutons Google dans login.html
- ✅ CSS pour les boutons OAuth
- ✅ Event listeners dans main.js
- ✅ Gestion du token dans profil.html
- ✅ Gestion des erreurs dans login.html

### Configuration
- ✅ Variables .env configurées
- ✅ URLs de callback définies
- ✅ Frontend et Backend URLs configurées

## ⚠️ Troubleshooting

### "Redirect URI mismatch"
➡️ Vérifiez que les 3 URLs de callback sont **exactement** configurées dans Google Console

### "Access blocked: This app's request is invalid"
➡️ Ajoutez votre email dans "Test users" de l'écran de consentement OAuth

### "User not found"
➡️ Normal ! Utilisez le bouton "Cadastrar com Google" la première fois

### Le bouton ne s'affiche pas
➡️ Videz le cache du navigateur (Ctrl+Shift+R)

### Erreur 500
➡️ Vérifiez que MongoDB est bien connecté (le serveur affiche "✅ MongoDB connecté")

## 📱 Flux Complet

### Nouveau Utilisateur
1. Ouvre login.html
2. Clique sur l'onglet "Cadastro"
3. Clique sur "Cadastrar com Google"
4. S'authentifie avec Google
5. Compte créé automatiquement
6. Redirigé vers profil.html
7. Peut sélectionner/créer un profil

### Utilisateur Existant
1. Ouvre login.html
2. Clique sur "Continuar com Google" (onglet Login)
3. S'authentifie avec Google
4. Vérifié dans la base de données
5. Redirigé vers profil.html
6. Peut sélectionner son profil

## 🎯 Prochaines Actions

1. ✅ Configuration Google Console (À FAIRE)
2. ✅ Test avec votre compte Google
3. ✅ Vérifier la création de compte dans MongoDB
4. ✅ Tester le login d'un utilisateur existant

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez les logs du serveur Node.js
3. Vérifiez que les URLs de callback sont exactement les mêmes

---

**Tout est prêt ! Il suffit maintenant de configurer Google Cloud Console et tester !** 🎉
