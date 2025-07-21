const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Song = require('../models/Song');

// Middleware d'authentification et admin intégré directement
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Token manquant');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ 
      _id: decoded.id, 
      isAdmin: true,
      isBanned: { $ne: true }
    });

    if (!user) throw new Error('Accès admin refusé');
    req.admin = user;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Appliquer le middleware à toutes les routes admin
router.use(adminAuth);

// Dashboard admin
router.get('/dashboard', async (req, res) => {
  const stats = {
    totalUsers: await User.countDocuments(),
    activeUsers: await User.countDocuments({ isBanned: { $ne: true } }),
    bannedUsers: await User.countDocuments({ isBanned: true }),
    totalSongs: await Song.countDocuments()
  };
  res.json(stats);
});

// routes/admin.js

// Système de bannissement (version corrigée)
router.post('/ban/:userId', async (req, res) => {
  try {
    const { reason } = req.body;
    
    // Validation de l'ID
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: "ID utilisateur invalide" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        isBanned: true,
        banReason: reason,
        bannedAt: new Date(),
        bannedBy: req.admin._id
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({ 
      success: true,
      message: `${user.email} a été banni`,
      user 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});
// Débannissement
router.post('/unban/:userId', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    {
      isBanned: false,
      $unset: { banReason: "", bannedAt: "", bannedBy: "" }
    },
    { new: true }
  );
  res.json({ 
    message: `Utilisateur ${user.email} débanni`,
    user 
  });
});

// Liste des utilisateurs avec filtres
router.get('/users', async (req, res) => {
  const { banned } = req.query;
  let filter = {};
  
  if (banned === 'true') filter.isBanned = true;
  if (banned === 'false') filter.isBanned = { $ne: true };

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 });

  res.json(users);
});

module.exports = router;