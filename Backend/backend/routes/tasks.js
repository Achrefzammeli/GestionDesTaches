// backend/routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, managerOnly } = require('../middleware/authMiddleware');

// 📥 GET /tasks : récupérer les tâches de l'utilisateur connecté
router.get('/', protect, async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'manager') {
            tasks = await Task.find().populate('assignedTo', 'username');
        } else {
            tasks = await Task.find({ assignedTo: req.user._id });
        }
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ➕ POST /tasks : créer une nouvelle tâche (seul le manager peut assigner à un autre utilisateur)
router.post('/', protect, managerOnly,async (req, res) => {
    const { title, description, status, assignedTo } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Le titre est obligatoire.' });
    }

    try {
        let assignedUser = req.user._id;

        // Si le user est manager, il peut assigner à d'autres
        if (req.user.role === 'manager' && assignedTo) {
            assignedUser = assignedTo;
        }

        const newTask = await Task.create({
            title,
            description,
            status,
            assignedTo: assignedUser,
            createdBy: req.user._id
        });

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ✏️ PUT /tasks/:id : modifier une tâche
router.put('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        // Un utilisateur simple ne peut modifier que ses propres tâches
        if (req.user.role !== 'manager' && task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// 🗑️ DELETE /tasks/:id : supprimer une tâche
router.delete('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        // Un utilisateur simple ne peut supprimer que ses propres tâches
        if (req.user.role !== 'manager' && task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        await task.remove();
        res.json({ message: 'Tâche supprimée' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
