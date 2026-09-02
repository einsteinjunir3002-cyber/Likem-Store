const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Likem12345', 10);

  // 1. Create or update the owner account with username/email: "Esq. Likem"
  const owner = await prisma.adminUser.upsert({
    where: { email: 'Esq. Likem' },
    update: {
      passwordHash,
      name: 'Esq. Likem',
      role: 'SUPER_ADMIN',
    },
    create: {
      email: 'Esq. Likem',
      name: 'Esq. Likem',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });

  // Also support lowercased or email format just in case
  await prisma.adminUser.upsert({
    where: { email: 'likem@likem.com' },
    update: {
      passwordHash,
      name: 'Esq. Likem',
      role: 'SUPER_ADMIN',
    },
    create: {
      email: 'likem@likem.com',
      name: 'Esq. Likem',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('✔ Successfully registered Owner account:');
  console.log('  Username/Email: "Esq. Likem"');
  console.log('  Role: SUPER_ADMIN (Full privileges to alter prices, images, stock, orders)');
}

main().finally(async () => {
  await prisma.$disconnect();
});
