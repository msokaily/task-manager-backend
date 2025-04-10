const cron = require('node-cron');
const sendReminderEmail = require('./utils/mailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

cron.schedule('0 9 * * *', async () => {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                dueDate: {
                    lte: new Date(),
                },
            },
            include: {
                createdBy: true,
            },
        });

        tasks.forEach(task => {
            if (task.createdBy && task.createdBy?.email) {
                sendReminderEmail(task.createdBy.email, task);
            } else {
                console.error(`Task ${task.id} has no associated user email.`);
            }
        });
    } catch (error) {
        console.error('Error running cron job:', error);
    }
});