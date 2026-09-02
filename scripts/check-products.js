const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: {
      images: { include: { media: true } },
      brand: true,
    },
  });

  console.log(`Found ${products.length} total products in database.`);
  for (const p of products) {
    console.log(`- ${p.name} (${p.slug}): status=${p.status}, price=${p.priceInGhs}, stock=${p.stock}, images=${p.images.length}, imgUrl=${p.images[0]?.media?.url}`);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
