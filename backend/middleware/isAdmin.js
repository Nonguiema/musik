// middleware/isAdmin.js
module.exports = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ 
      error: 'Accès refusé. Seuls les administrateurs peuvent effectuer cette action.' 
    });
  }
  next();
};