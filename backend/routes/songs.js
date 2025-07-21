const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const VocalRecording = require('../models/VocalRecording'); // Nouveau modèle pour les enregistrements vocaux

// Créer une chanson
router.post('/', async (req, res) => {
  try {
    const song = new Song({
      ...req.body,
      createdBy: req.user?.id || null, // Si req.user existe (JWT), sinon null
    });

    await song.save();
    res.status(201).json(song); // Renvoie la chanson créée avec son _id
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Créer un enregistrement vocal
router.post('/vocal', async (req, res) => {
  try {
    const vocalRecording = new VocalRecording({
      ...req.body,
      createdBy: req.user?.id || null,
    });

    await vocalRecording.save();
    res.status(201).json(vocalRecording);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Récupérer toutes les chansons
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 }); // Du plus récent au plus ancien
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Récupérer tous les enregistrements vocaux
router.get('/vocal', async (req, res) => {
  try {
    const vocalRecordings = await VocalRecording.find().sort({ createdAt: -1 });
    res.json(vocalRecordings);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Récupérer toutes les chansons ET les enregistrements vocaux mélangés
router.get('/all', async (req, res) => {
  try {
    const songs = await Song.find().lean(); // .lean() pour de meilleures performances
    const vocalRecordings = await VocalRecording.find().lean();
    
    // Ajouter un champ type pour distinguer les éléments
    const songsWithType = songs.map(song => ({ ...song, type: 'song' }));
    const vocalsWithType = vocalRecordings.map(vocal => ({ ...vocal, type: 'vocal' }));
    
    // Mélanger et trier par date de création
    const allContent = [...songsWithType, ...vocalsWithType]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(allContent);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Récupérer une chanson spécifique par ID
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: "Chanson non trouvée" });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Récupérer un enregistrement vocal spécifique par ID
router.get('/vocal/:id', async (req, res) => {
  try {
    const vocalRecording = await VocalRecording.findById(req.params.id);
    if (!vocalRecording) {
      return res.status(404).json({ error: "Enregistrement vocal non trouvé" });
    }
    res.json(vocalRecording);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Supprimer une chanson
router.delete('/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).json({ error: "Chanson non trouvée" });
    }
    res.json({ message: "Chanson supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Supprimer un enregistrement vocal
router.delete('/vocal/:id', async (req, res) => {
  try {
    const vocalRecording = await VocalRecording.findByIdAndDelete(req.params.id);
    if (!vocalRecording) {
      return res.status(404).json({ error: "Enregistrement vocal non trouvé" });
    }
    res.json({ message: "Enregistrement vocal supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Mettre à jour une chanson
router.put('/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!song) {
      return res.status(404).json({ error: "Chanson non trouvée" });
    }
    res.json(song);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mettre à jour un enregistrement vocal
router.put('/vocal/:id', async (req, res) => {
  try {
    const vocalRecording = await VocalRecording.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!vocalRecording) {
      return res.status(404).json({ error: "Enregistrement vocal non trouvé" });
    }
    res.json(vocalRecording);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;