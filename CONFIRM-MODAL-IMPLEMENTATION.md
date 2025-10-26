# 🎭 Modal de Confirmation Stylisée

## 📋 Vue d'ensemble

Système de modal de confirmation moderne qui remplace le natif `window.confirm()` par une interface élégante et personnalisable avec effet glassmorphism.

## ✨ Fonctionnalités

### Types de Modal
- **Danger** (rouge) - Actions destructives (logout, suppression)
- **Warning** (orange) - Actions importantes nécessitant attention
- **Info** (bleu) - Actions informatives ou changements d'état

### Caractéristiques
- ✅ Design glassmorphism cohérent avec le système de notifications
- ✅ Promesses JavaScript pour facilité d'utilisation
- ✅ Support du clavier (Escape pour annuler)
- ✅ Clic sur l'overlay pour fermer
- ✅ Animations fluides (entrée/sortie)
- ✅ Textes personnalisables (titre, message, boutons)
- ✅ Icônes emoji personnalisables
- ✅ Responsive (mobile-first)
- ✅ Focus automatique sur le bouton de confirmation

## 📦 Installation

### 1. Ajouter les fichiers CSS et JS

```html
<!-- Dans le <head> -->
<link rel="stylesheet" href="confirm-modal.css">

<!-- Avant </body> -->
<script src="confirm-modal.js"></script>
```

### 2. Fichiers créés
- `confirm-modal.css` - Styles de la modal
- `confirm-modal.js` - Logique et API
- `test-confirm-modal.html` - Page de test interactive

## 🚀 Utilisation

### Méthode Simple (Types Prédéfinis)

```javascript
// Modal Danger (rouge)
const confirmed = await confirmModal.danger(
  'Sair da CINEHOME?',
  'Deseja realmente sair da sua conta?',
  'Sair',      // Texte bouton confirmation
  'Cancelar'   // Texte bouton annulation
);

if (confirmed) {
  // L'utilisateur a confirmé
  console.log('Action confirmée');
} else {
  // L'utilisateur a annulé
  console.log('Action annulée');
}

// Modal Warning (orange)
const confirmed = await confirmModal.warning(
  'Excluir Perfil?',
  'Esta ação não pode ser desfeita.',
  'Excluir',
  'Manter'
);

// Modal Info (bleu)
const confirmed = await confirmModal.info(
  'Trocar de Perfil?',
  'Deseja trocar para o perfil "João"?',
  'Trocar',
  'Cancelar'
);
```

### Méthode Avancée (Personnalisation Complète)

```javascript
const confirmed = await confirmModal.show({
  title: 'Resetar Configurações?',
  message: 'Isso vai restaurar todas as configurações para o padrão.',
  confirmText: 'Resetar Tudo',
  cancelText: 'Não, obrigado',
  type: 'danger',  // 'danger', 'warning', ou 'info'
  icon: '⚡'       // Emoji personnalisé
});
```

## 🎨 Design

### Couleurs par Type

**Danger (Rouge)**
- Gradient: `#e50914` → `#b20710`
- Usage: Logout, suppressions, actions destructives

**Warning (Orange)**
- Gradient: `#ff9800` → `#f57c00`
- Usage: Actions importantes, changements majeurs

**Info (Bleu)**
- Gradient: `#2196f3` → `#1976d2`
- Usage: Informations, changements d'état

### Animations
- **Entrée**: `fadeIn` (overlay) + `modalSlideIn` (modal)
- **Sortie**: `fadeOut` (overlay) + `modalSlideOut` (modal)
- **Durée**: 300ms entrée, 200ms sortie

## 📱 Responsive

### Mobile (< 480px)
- Padding réduit (24px au lieu de 32px)
- Boutons en colonne (pleine largeur)
- Ordre inversé (Annuler en bas, Confirmer en haut)

### Desktop
- Max-width: 420px
- Boutons en ligne
- Centré avec backdrop blur

## 🔧 API Complète

### `confirmModal.show(options)`

**Paramètres:**
```typescript
{
  title?: string,        // Défaut: 'Confirmar'
  message?: string,      // Défaut: 'Tem certeza?'
  confirmText?: string,  // Défaut: 'OK'
  cancelText?: string,   // Défaut: 'Cancelar'
  type?: string,         // 'danger' | 'warning' | 'info' (défaut: 'danger')
  icon?: string          // Emoji (défaut selon le type)
}
```

**Retour:**
- `Promise<boolean>` - `true` si confirmé, `false` si annulé

### Raccourcis

```javascript
confirmModal.danger(title, message, confirmText?, cancelText?)
confirmModal.warning(title, message, confirmText?, cancelText?)
confirmModal.info(title, message, confirmText?, cancelText?)
```

## 📍 Implémentation Actuelle

### profile-menu.js - Logout
```javascript
// Avant (alert natif)
if (confirm('Deseja realmente sair da CINEHOME?')) {
  // logout
}

// Après (modal stylisée)
const confirmed = await confirmModal.danger(
  'Sair da CINEHOME?',
  'Deseja realmente sair da sua conta?',
  'Sair',
  'Cancelar'
);

if (confirmed) {
  notify.info('Saindo...', 'Até logo!', 2000);
  // logout
}
```

## 🎯 Cas d'Usage

### 1. Logout / Déconnexion
```javascript
const confirmed = await confirmModal.danger(
  'Sair da CINEHOME?',
  'Deseja realmente sair da sua conta?',
  'Sair',
  'Cancelar'
);
```

### 2. Suppression de Profil
```javascript
const confirmed = await confirmModal.warning(
  'Excluir Perfil?',
  'Esta ação não pode ser desfeita. Todos os dados serão perdidos.',
  'Excluir',
  'Manter'
);
```

### 3. Changement de Profil
```javascript
const confirmed = await confirmModal.info(
  'Trocar de Perfil?',
  `Deseja trocar para o perfil "${profileName}"?`,
  'Trocar',
  'Cancelar'
);
```

### 4. Reset de Configuration
```javascript
const confirmed = await confirmModal.show({
  title: 'Resetar Configurações?',
  message: 'Isso restaurará todas as configurações padrão.',
  confirmText: 'Resetar',
  cancelText: 'Cancelar',
  type: 'warning',
  icon: '⚙️'
});
```

## 🧪 Tests

Ouvrir `test-confirm-modal.html` dans le navigateur pour tester :
- ✅ Modal Danger (logout)
- ✅ Modal Warning (suppression)
- ✅ Modal Info (changement)
- ✅ Modal personnalisée

## ✅ Avantages vs window.confirm()

| Aspect | window.confirm() | confirmModal |
|--------|------------------|--------------|
| Design | Basique/natif | Moderne glassmorphism |
| Personnalisation | Aucune | Complète |
| Couleurs | Système | 3 types + custom |
| Icônes | Non | Oui (emoji) |
| Animations | Non | Oui (fluides) |
| Mobile | Moyen | Optimisé |
| Keyboard | Limité | Complet (Escape) |
| Async/Await | Non | Oui (Promises) |

## 🎨 Intégration avec le Système Existant

- **Cohérent avec** `notifications.css` (même style glassmorphism)
- **Compatible avec** `profile-menu.js` (async/await)
- **Utilise les mêmes** couleurs que les notifications
- **Responsive** comme le reste du système

## 🔄 Prochaines Étapes

Autres endroits où utiliser `confirmModal` :
- [ ] Suppression de compte (`conta.html`)
- [ ] Suppression de profil (`manage-profiles.html`)
- [ ] Reset de mot de passe
- [ ] Annulation d'abonnement
- [ ] Suppression de favoris/historique

## 📝 Notes Techniques

### Z-Index
- Modal: `99999` (au-dessus de tout)
- Overlay: Semi-transparent avec backdrop-blur

### Événements Gérés
- Clic sur boutons (confirm/cancel)
- Touche Escape (annulation)
- Clic sur overlay (annulation)
- Focus automatique (accessibilité)

### Performance
- Animations GPU (transform, opacity)
- Cleanup automatique du DOM
- Pas de dépendances externes

## 🎉 Conclusion

Le système de modal de confirmation stylisée est maintenant opérationnel et remplace tous les `window.confirm()` par une interface moderne et professionnelle qui respecte l'identité visuelle de CINEHOME.
