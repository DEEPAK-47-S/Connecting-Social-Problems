const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function main() {
  const prisma = new PrismaClient();
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  let admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  
  if (admin) {
    admin = await prisma.user.update({
      where: { id: admin.id },
      data: { password: hashedPassword, email: 'admin@socialimpact.org' }
    });
    console.log('Updated admin:', admin.email, 'Password: Admin123!');
  } else {
    admin = await prisma.user.create({
      data: {
        email: 'admin@socialimpact.org',
        password: hashedPassword,
        name: 'System Admin',
        role: 'ADMIN'
      }
    });
    console.log('Created admin:', admin.email, 'Password: Admin123!');
  }
  await prisma.$disconnect();
}

main();
