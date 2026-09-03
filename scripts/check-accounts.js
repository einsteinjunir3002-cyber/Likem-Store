const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.adminUser.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  const customers = await prisma.customer.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  console.log('\n==============================');
  console.log('  ADMIN PORTAL ACCOUNTS');
  console.log('==============================');
  console.log(`Total admin accounts: ${admins.length}`);
  console.log('');

  admins.forEach((a, i) => {
    console.log(`  [${i + 1}] Name:    ${a.name}`);
    console.log(`      Email:   ${a.email}`);
    console.log(`      Role:    ${a.role}`);
    console.log(`      Created: ${a.createdAt.toISOString().split('T')[0]}`);
    console.log('');
  });

  console.log('==============================');
  console.log('  CUSTOMER ACCOUNTS');
  console.log('==============================');
  console.log(`Total customer accounts: ${customers.length}`);
  customers.forEach((c, i) => {
    console.log(`  [${i + 1}] ${c.fullName} | ${c.email || 'no email'} | ${c.phone}`);
  });
  console.log('');
}

main().catch(console.error).finally(() => prisma.$disconnect());
