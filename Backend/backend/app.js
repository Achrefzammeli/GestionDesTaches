const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
// Importer les routes d'authentification
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connecté'))
    .catch((err) => console.log(err));

// Routes
app.use('/api/auth', authRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur en cours sur le port ${PORT}`));
// Routes pour les tâches
app.use('/api/tasks', taskRoutes);
// Routes pour les utilisateurs
app.use('/api/users', userRoutes);