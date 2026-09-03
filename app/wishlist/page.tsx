import { prisma } from '@/lib/prisma';
import WishlistView from '@/components/WishlistView';

export const revalidate = 0;

export const metadata = {
  title: 'My Wishlist | The Likem Perfumery',
  description: 'Your saved luxury fragrances and personal scent wish list at The Likem Perfumery Ghana.',
};

export default async function WishlistPage() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });

  const products = await prisma.product.findMany({
    include: {
      brand: true,
      images: {
        include: { media: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: [{ status: 'desc' }, { createdAt: 'desc' }],
  });

  const serializedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    priceInGhs: Number(p.priceInGhs),
    brandName: p.brand?.name || 'Exclusive',
    size: p.size || '100ml',
    concentration: p.concentration || 'Eau De Parfum',
    gender: p.gender || 'Unisex',
    isPublished: p.status === 'PUBLISHED',
    imageUrl: p.images[0]?.media?.url || '/uploads/perfumes/perfume_db293e4b7fc0.jpeg',
  }));

  return (
    <WishlistView
      products={serializedProducts}
      whatsappNumber={settings?.whatsappNumber || '233502547133'}
    />
  );
}
