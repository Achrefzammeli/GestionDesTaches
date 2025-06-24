const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔐 Middleware de protection des routes
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token invalide' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Accès non autorisé, aucun token' });
    }
};

// 🛡️ Middleware : accès réservé aux managers
const managerOnly = (req, res, next) => {
    if (req.user && req.user.role === 'manager') {
        next();
    } else {
        return res.status(403).json({ message: 'Accès réservé aux managers' });
    }
};

module.exports = { protect, managerOnly };
