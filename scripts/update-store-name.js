const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {
      storeName: 'The Likem Perfumery',
      tagline: 'Authentic Luxury Fragrances in Ghana',
    },
    create: {
      id: 'default',
      storeName: 'The Likem Perfumery',
      tagline: 'Authentic Luxury Fragrances in Ghana',
      phoneContact: '0502547133',
      whatsappNumber: '+233502547133',
      snapchatHandle: 'lilitracess',
    },
  });
  console.log('Updated store settings:', updated);
}

main().catch(console.error).finally(() => prisma.$disconnect());
