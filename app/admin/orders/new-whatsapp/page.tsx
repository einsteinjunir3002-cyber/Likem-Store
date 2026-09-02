import { prisma } from '@/lib/prisma';
import NewWhatsAppOrderClient from '@/components/NewWhatsAppOrderClient';

export const revalidate = 0;

export default async function NewWhatsAppOrderPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
  });

  const regions = await prisma.deliveryRegion.findMany({
    where: { isActive: true },
    orderBy: { baseFeeInGhs: 'asc' },
  });

  return (
    <NewWhatsAppOrderClient
      products={products.map((p) => ({
        id: p.id,
        name: p.name,
        priceInGhs: Number(p.priceInGhs),
        stock: p.stock,
      }))}
      regions={regions.map((r) => ({
        regionName: r.regionName,
        baseFeeInGhs: Number(r.baseFeeInGhs),
      }))}
    />
  );
}
