const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  // Titre de la chanson (obligatoire)
  title: {
    type: String,
    required: [true, 'Le titre est obligatoire'],
    trim: true, // Supprime les espaces inutiles
    maxlength: [100, 'Le titre ne peut dépasser 100 caractères']
  },

  // Artiste (obligatoire)
  artist: {
    type: String,
    required: [true, 'Le nom de l\'artiste est obligatoire'],
    trim: true
  },

  // Image de couverture (optionnelle)
  coverImage: {
    type: String,
    default: 'default-cover.jpg' // Image par défaut si non fournie
  },

  // Fichier audio (obligatoire)
  audioFile: {
    type: String,
    required: [true, 'Le fichier audio est obligatoire'],
    validate: {
      validator: function(v) {
        // Validation basique de l'extension du fichier
        return /\.(mp3|wav|ogg)$/i.test(v);
      },
      message: 'Format audio non supporté (mp3, wav, ogg)'
    }
  },

  // Référence à l'utilisateur qui a créé la chanson
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Lie la chanson au modèle User
    required: true
  },

  // Date de création (gérée automatiquement)
  createdAt: {
    type: Date,
    default: Date.now // Date actuelle par défaut
  },

  // Métadonnées supplémentaires
  duration: {
    type: Number, // Durée en secondes
    min: [1, 'La durée doit être d\'au moins 1 seconde']
  },
  genre: {
    type: String,
    enum: ['Pop', 'Rock', 'Hip-Hop', 'Classique', 'Jazz', 'Autre']
  }
}, {
  // Options du schéma
  toJSON: { virtuals: true }, // Inclut les virtuals quand on convertit en JSON
  toObject: { virtuals: true }
});

// Index pour optimiser les recherches
songSchema.index({ title: 'text', artist: 'text' });

// Middleware avant sauvegarde
songSchema.pre('save', function(next) {
  console.log(`Sauvegarde de la chanson "${this.title}"`);
  next();
});

// Méthode personnalisée
songSchema.methods.getFormattedDuration = function() {
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}m ${seconds}s`;
};

module.exports = mongoose.model('Song', songSchema);