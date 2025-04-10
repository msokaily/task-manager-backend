const { PrismaClient } = require('@prisma/client');
const { connect } = require('../routes/auth');
const prisma = new PrismaClient();

const logActivity = (action) => async (req, res, next) => {
    console.log(`User ${req.user?.userId} performed ${action} at ${new Date()}`);
    // console.log({ params: req.params, body: req.body, user: req.user });
    const taskId = (req.params?.id || req.body?.id) ? parseInt(req.params?.id || req.body?.id) : null;
    try {
        const logItem = await prisma.log.create({
            data: {
                userId: req.user.userId,
                action,
                content: req.body ? JSON.stringify(req.body) : "{}",
                taskId,
            },
        });
    } catch (error) {
        console.log(error);
    }

    next();
};

module.exports = logActivity;