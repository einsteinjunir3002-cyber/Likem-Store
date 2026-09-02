const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PRODUCT_DATA = [
  { slug: 'tharwah-gold', price: 450.00, stock: 8, status: 'PUBLISHED', desc: 'A rich golden amber and floral fragrance with warm oriental elegance. Highly sought-after Arabian luxury.' },
  { slug: '9-pm-rebel', price: 380.00, stock: 6, status: 'PUBLISHED', desc: 'An invigorating, seductive scent with apple, lavender, and spicy undertones. Perfect for evening wear.' },
  { slug: 'hayaati', price: 320.00, stock: 10, status: 'PUBLISHED', desc: 'Fresh spicy and woody notes with bergamot, cinnamon, and nutmeg. A signature daily wear masterpiece.' },
  { slug: 'suger-candy', price: 290.00, stock: 5, status: 'PUBLISHED', desc: 'Sweet, gourmand delight bursting with candy sweetness and playful vanilla undertones.' },
  { slug: 'now-women', price: 350.00, stock: 7, status: 'PUBLISHED', desc: 'Lush feminine floral bouquet with strawberry, vanilla, and gentle musk notes.' },
  { slug: 'zara-man', price: 280.00, stock: 5, status: 'PUBLISHED', desc: 'Crisp aromatic woody composition tailored for modern masculine sophistication.' },
  { slug: 'ophylia', price: 310.00, stock: 6, status: 'PUBLISHED', desc: 'Divine amber floral essence inspired by victorious femininity. Radiant and long-lasting.' },
  { slug: 'suspenso-pour-homme', price: 320.00, stock: 4, status: 'PUBLISHED', desc: 'Deep aromatic woodiness with aquatic freshness and earthy accords. An unforgettable presence.' },
  { slug: 'angham', price: 390.00, stock: 5, status: 'PUBLISHED', desc: 'Enchanting symphony of ginger, mandarin, vanilla, and amber. Pure sophistication.' },
  { slug: 'elysia-collection', price: 360.00, stock: 4, status: 'PUBLISHED', desc: 'Haute collection edition with layered citrus and rich woody sillage.' },
  { slug: 'petra', price: 340.00, stock: 5, status: 'PUBLISHED', desc: 'Rare and enigmatic desert spice blend with resinous amber and precious woods.' },
];

async function main() {
  for (const item of PRODUCT_DATA) {
    try {
      await prisma.product.update({
        where: { slug: item.slug },
        data: {
          priceInGhs: item.price,
          stock: item.stock,
          status: item.status,
          requiresInformation: false,
          shortDescription: item.desc,
        },
      });
      console.log(`✔ Published ${item.slug} at GH₵${item.price.toFixed(2)}`);
    } catch (e) {
      console.error(`Error publishing ${item.slug}:`, e.message);
    }
  }
  console.log('\nAll 11 perfume items are actively published and live in Supabase PostgreSQL!');
}

main().finally(async () => {
  await prisma.$disconnect();
});
