const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const logService = require('../services/log');
const { PrismaClient } = require('@prisma/client');
const logActivity = require('../middleware/log');
const prisma = new PrismaClient();
const router = express.Router();

// Create
router.post('/', authenticateToken, logActivity('Create Task'), async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        const task = await prisma.task.create({
            data: {
                title,
                description,
                status,
                priority,
                dueDate: new Date(dueDate),
                createdBy: {
                    connect: { id: req.user.userId },
                },
            },
        });
        res.status(201).json(task);
    } catch (error) {
        console.log(error);
        logService(req.user.userId, `Failed to add task id ${task.id}`, req.body);
        res.status(400).json({ error: 'Error creating task' });
    }
});

// Update
router.put('/:id', authenticateToken, logActivity('Update Task'), async (req, res) => {
    try {
        const task = await prisma.task.update({
            where: { id: parseInt(req.params.id), userId: req.user.userId },
            data: req.body,
        });
        res.json(task);
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: `Task with id ${req.params.id} not found` });
        } else {
            console.log(error);
            logService(req.user.userId, `Failed to update task ${req.params?.id}`, req.body);
            logService(req.user.userId, JSON.stringify(error));
            res.status(400).json({ error: 'Error updating task' });
        }
    }
});

// Delete
router.delete('/:id', authenticateToken, logActivity('Delete Task'), async (req, res) => {
    try {
        await prisma.task.delete({
            where: { id: parseInt(req.params.id), userId: req.user.userId },
        });
        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        logService(req.user.userId, `Failed to delete task id ${req.params.id}`);
        if (error.code === 'P2025') {
            res.status(404).json({ error: `Task with id ${req.params.id} not found` });
        } else {
            res.status(400).json({ error: 'Error deleting task' });
        }
    }
});

// Get All
router.get('/', authenticateToken, async (req, res) => {
    const { status, priority, dueDate, sortBy = 'asc', page = 1, limit = 10 } = req.query;
    const filters = {
        userId: req.user.id,
    };

    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (dueDate) filters.dueDate = { lte: new Date(dueDate) };

    try {
        const tasks = await prisma.task.findMany({
            where: filters,
            orderBy: {
                createdAt: sortBy,
            },
            skip: (page - 1) * limit,
            take: Number(limit),
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                priority: true,
                dueDate: true,
                createdAt: true,
                comments: true,
                Category: true
            },
        });
        const totalCount = await prisma.task.count();

        res.json({
            items: tasks,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Error fetching tasks' });
    }
});

module.exports = router;