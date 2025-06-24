// backend/routes/auth.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Générer le JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

// Route Inscription
router.post('/register', async (req, res) => {
    const { username, password, role ,birthDate} = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Utilisateur déjà existant.' });

        const newUser = await User.create({ username, password, role , birthDate });
        const token = generateToken(newUser);

        res.status(201).json({ token, user: { id: newUser._id, username: newUser.username, role: newUser.role , birthDate: newUser.birthDate} });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Route Connexion
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé.' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect.' });

        const token = generateToken(user);

        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

module.exports = router;
