const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.event.deleteMany().then(() => p.$disconnect());
