const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.update({
    where: { slug: 'tharwah-gold' },
    data: {
      priceInGhs: 450.00,
      stock: 6,
      status: 'PUBLISHED',
      requiresInformation: false,
    },
  });

  await prisma.product.update({
    where: { slug: '9-pm-rebel' },
    data: {
      priceInGhs: 380.00,
      stock: 4,
      status: 'PUBLISHED',
      requiresInformation: false,
    },
  });

  console.log('✔ Published Tharwah Gold (GH₵450.00) & Afnan 9 PM Rebel (GH₵380.00)');
}

main().finally(async () => {
  await prisma.$disconnect();
});
