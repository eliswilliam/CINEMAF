const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Inscription
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: 'Utilisateur déjà existant' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

  // Utiliser la clé JWT depuis les variables d'environnement pour la sécurité
  const jwtSecret = process.env.JWT_SECRET || 'dev-secret';
  if (!process.env.JWT_SECRET) console.warn('⚠️ JWT_SECRET non défini. Utilisation du secret de développement (dev-secret). Configurez JWT_SECRET dans .env pour la production.');

  const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

  res.json({ message: 'Connexion réussie', token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Réinitialiser le mot de passe via resetToken JWT
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) return res.status(400).json({ message: 'resetToken and newPassword are required' });

    const jwtSecret = process.env.JWT_SECRET || 'dev-secret';
    let payload;
    try {
      payload = jwt.verify(resetToken, jwtSecret);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired reset token' });
    }

    const email = payload.email;
    if (!email) return res.status(400).json({ message: 'Invalid token payload' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error('resetPassword error:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};