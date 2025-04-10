const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Add
router.post('/', authenticateToken, async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        const category = await prisma.category.create({
            data: { name, userId: req.user.userId },
        });

        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        res.status(400).json({ error: 'Failed to create category' });
    }
});

// Update
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        const category = await prisma.category.update({
            where: { id: parseInt(id), userId: req.user.userId },
            data: { name },
        });

        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        res.status(400).json({ error: 'Failed to update category' });
    }
});

// Delete
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.category.delete({
            where: { id: parseInt(id), userId: req.user.userId },
        });

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete category' });
    }
});

// Get All
router.get('/', authenticateToken, async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            where: {
                OR: [
                    { id: 1 },
                    { userId: req.user.userId }
                ]
            },
        });
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve categories' });
    }
});

module.exports = router;
