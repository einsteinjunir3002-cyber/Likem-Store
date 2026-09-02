import { prisma } from '@/lib/prisma';
import SettingsForm from '@/components/SettingsForm';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="border-b border-[#1e2330] pb-4">
        <h1 className="text-2xl font-black text-white">Store & WhatsApp Settings</h1>
        <p className="text-xs text-[#94a3b8]">
          Configure business name, WhatsApp ordering numbers, Snapchat handle, and checkout mode.
        </p>
      </div>

      <SettingsForm
        settings={{
          storeName: settings?.storeName || 'LIKEM Fragrances',
          tagline: settings?.tagline || '',
          phoneContact: settings?.phoneContact || '0502547133',
          whatsappNumber: settings?.whatsappNumber || '+233502547133',
          snapchatHandle: settings?.snapchatHandle || 'lilitracess',
          onlineCheckoutEnabled: settings?.onlineCheckoutEnabled || false,
          deliveryNotice: settings?.deliveryNotice || '',
        }}
      />
    </div>
  );
}
