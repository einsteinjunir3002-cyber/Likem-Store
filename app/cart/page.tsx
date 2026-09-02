import { prisma } from '@/lib/prisma';
import CartView from '@/components/CartView';

export const revalidate = 0;

export default async function CartPage() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
  const regions = await prisma.deliveryRegion.findMany({
    where: { isActive: true },
    orderBy: { baseFeeInGhs: 'asc' },
  });

  return (
    <CartView
      whatsappNumber={settings?.whatsappNumber || '233502547133'}
      onlineCheckoutEnabled={settings?.onlineCheckoutEnabled || false}
      regions={regions.map((r) => ({
        regionName: r.regionName,
        baseFeeInGhs: Number(r.baseFeeInGhs),
        estimatedDays: r.estimatedDays,
      }))}
    />
  );
}
