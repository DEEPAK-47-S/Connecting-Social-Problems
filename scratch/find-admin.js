const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findFirst({ where: { role: 'ADMIN' } }).then(u => {
  if(u) console.log('Admin:', u.email, u.name);
  else console.log('No admin found');
  prisma.$disconnect();
});
