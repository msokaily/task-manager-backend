const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const prisma = new PrismaClient();

// Only Admin

// Create User
router.post('/', authenticateToken, authorizeRole('Admin'), [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['User', 'Admin']).withMessage('User Role must be User or Admin'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
    }));
    return res.status(400).json({ errors: formattedErrors });
  }
  const { email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'User'
      },
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

// Update User
router.put('/:id', authenticateToken, authorizeRole('Admin'), [
  body('email').optional().isEmail().withMessage('Please enter a valid email address'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['User', 'Admin']).withMessage('User Role must be User or Admin'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
    }));
    return res.status(400).json({ errors: formattedErrors });
  }

  const { id } = req.params;
  const { email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedData = {};
    if (email) updatedData.email = email;
    if (password) updatedData.password = await bcrypt.hash(password, 10);
    if (role) updatedData.role = role;

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updatedData,
    });

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid data or user update failed' });
  }
});

// Get Users
router.get('/', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const { role } = req.query;
    const users = await prisma.user.findMany({ where: role ? { role } : {} });
    res.json(users.map(user => ({ id: user.id, email: user.email, role: user.role })));
  } catch (error) {
    res.status(400).json({ error: 'Error fetching users' });
  }
});

// Get User Tasks
router.get('/:id/tasks', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  const userId = parseInt(req.params.id) ?? null;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });
  const { status, priority, dueDate, sortBy = 'asc', page = 1, limit = 10 } = req.query;
  const filters = {
    userId,
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
        createdBy: { select: { id: true, email: true } },
        Category: true
      },
    });

    const totalCount = await prisma.task.count();
    res.json({
      tasks,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error fetching tasks' });
  }
});

module.exports = router;