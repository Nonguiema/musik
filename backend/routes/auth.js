const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// REGISTER
// routes/auth.js

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hash du mot de passe
    const hashed = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = new User({ name, email, password: hashed });
    await user.save();

    // Génération d’un token (optionnel mais utile si tu veux l’authentification par token)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev_secret', {
      expiresIn: '7d',
    });

    // Réponse avec l'utilisateur (sans mot de passe) et le token
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (err) {
    console.error('Erreur lors de l\'inscription :', err);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});



// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user });
});

module.exports = router;
