const prisma = require('./jest.setup.js');

describe('Task Model', () => {
    it('should create a new task', async () => {
        // Create a user first
        const user = await prisma.user.create({
            data: {
                email: 'test121@example.com',
                password: 'password123',
            },
        });

        // Create a task associated with the user
        const task = await prisma.task.create({
            data: {
                title: 'Test Task',
                description: 'This is a test task',
                status: 'pending',
                priority: 'high',
                dueDate: new Date('2025-03-23T21:08:05.512Z'),
                createdBy: {
                    connect: { id: user.id }, // Use connect to associate the task with the existing user
                },
            },
        });

        expect(task.title).toBe('Test Task');
        expect(task.status).toBe('pending');
    });
});