const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Add Comment to Task
router.post('/:taskId/comments/', async (req, res) => {
    const { taskId } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Comment content is required' });
    }

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                taskId: parseInt(taskId),
            },
        });

        res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Update Comment
router.put('/:taskId/comments/:id', async (req, res) => {
    const { taskId, id } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Comment content is required' });
    }

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: parseInt(id), taskId: parseInt(taskId) },
            include: { task: { select: { userId: true } } },
        });

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment?.task.userId !== req.user.userId) {
            return res.status(403).json({ error: 'You can only update your own comments' });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: parseInt(id) },
            data: { content },
        });

        res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update comment' });
    }
});

// Get Comments for a Task
router.get('/:taskId/comments', async (req, res) => {
    const { taskId } = req.params;

    if (!taskId) {
        return res.status(400).json({ error: 'taskId is required' });
    }

    try {
        const comments = await prisma.comment.findMany({
            where: {
                taskId: parseInt(taskId),
            }
        });

        res.status(200).json({ items: comments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve comments' });
    }
});

module.exports = router;