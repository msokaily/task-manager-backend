const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});

afterEach(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
});

module.exports = prisma;