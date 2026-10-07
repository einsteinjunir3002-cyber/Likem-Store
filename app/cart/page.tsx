import { prisma } from '@/lib/prisma';
import { getStoreSettings } from '@/lib/settings';
import CartView from '@/components/CartView';
import type { Metadata } from 'next';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Your Shopping Bag | The Likem Perfumery',
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  let settings = null;
  try {
    settings = await getStoreSettings();
  } catch (e) {
    settings = null;
  }

  let regions: any[] = [];
  try {
    regions = await prisma.deliveryRegion.findMany({
      where: { isActive: true },
      orderBy: { baseFeeInGhs: 'asc' },
    });
  } catch (e) {
    regions = [];
  }

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
