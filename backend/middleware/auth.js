const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // 1. Récupérer le token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Token manquant');

    // 2. Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Trouver l'utilisateur (vérifier s'il n'est pas banni)
    const user = await User.findOne({ 
      _id: decoded.id, 
      isBanned: { $ne: true } 
    });
    if (!user) throw new Error('Utilisateur banni ou introuvable');

    // 4. Ajouter l'utilisateur à la requête
    req.user = user;
    req.token = token;
    next();

  } catch (error) {
    res.status(401).json({ 
      error: 'Authentification requise : ' + error.message 
    });
  }
};