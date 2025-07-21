// server.js (version corrigée et optimisée)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Connexion DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB:', err));

// Routes principales
app.use('/api/auth', require('./routes/auth'));
app.use('/api/songs', require('./routes/songs'));
// route admin
app.use('/api/admin', 
  require('./middleware/auth'),
  require('./middleware/isAdmin'),
  require('./routes/admin') 
)
// Test
app.get('/api/ping', (req, res) => {
  res.json({ status: 'active', timestamp: new Date() });
});

// Gestion des erreurs
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trouvé' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  🚀 Serveur démarré sur http://localhost:${PORT}
  ⚡ Routes disponibles:
     - /api/auth (login/register)
     - /api/songs (gestion des chansons)
     - /api/admin (interface administrateur)
  `);
});