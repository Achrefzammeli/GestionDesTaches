// backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// GET /api/users — Accessible uniquement pour les managers
router.get('/', protect, async (req, res) => {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Accès refusé' });
    }

    try {
        const users = await User.find().select('-password'); // Exclure le mot de passe
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
