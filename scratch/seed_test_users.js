const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Connecting to the database to seed test users...");
        
        const testUsers = [
            { email: 'citizen@test.com', name: 'Test Citizen', role: 'CITIZEN' },
            { email: 'college@test.com', name: 'Test College', role: 'UNIVERSITY' },
            { email: 'industry@test.com', name: 'Test Industry', role: 'INDUSTRY', companyName: 'Test Corp', sector: 'IT' },
            { email: 'government@test.com', name: 'Test Govt', role: 'GOVERNMENT' },
        ];

        const hashedPassword = await bcrypt.hash('Test@123', 10);

        for (const u of testUsers) {
            const existing = await prisma.user.findUnique({ where: { email: u.email } });
            if (existing) {
                console.log(`User ${u.email} already exists. Updating password...`);
                await prisma.user.update({
                    where: { email: u.email },
                    data: { password: hashedPassword, role: u.role, isVerified: true }
                });
            } else {
                console.log(`Creating user ${u.email}...`);
                await prisma.user.create({
                    data: {
                        email: u.email,
                        name: u.name,
                        password: hashedPassword,
                        role: u.role,
                        isVerified: true,
                        companyName: u.companyName || null,
                        sector: u.sector || null,
                        state: 'Jharkhand',
                        district: 'Ranchi'
                    }
                });
            }
        }
        
        console.log("Successfully seeded test users!");
    } catch (error) {
        console.error("Database connection failed:");
        console.error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
