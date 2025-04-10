const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Get Logs
router.get('/', authenticateToken, authorizeRole('Admin'), async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const logs = await prisma.log.findMany({
            skip: (page - 1) * limit,
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                content: true,
                createdAt: true,
                task: true,
                user: { select: { id: true, email: true } },
            }
        });

        const totalLogs = await prisma.log.count();

        res.status(200).json({
            logs: logs.map(log => ({
                ...log, ...{ content: JSON.parse(log.content ?? "{}") }
            })),
            totalPages: Math.ceil(totalLogs / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve logs' });
    }
});

module.exports = router;