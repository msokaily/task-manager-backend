const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    await prisma.user.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            email: "admin@admin.com",
            password: "$2a$12$s3SBBNmaophRY2fyZ/9I0Oeh4QnjOmDYpBxG.IVlWQeCYdZUndXNW", // password: admin123
            role: "Admin",
        },
    });
    await prisma.category.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: "All",
        },
    });

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
