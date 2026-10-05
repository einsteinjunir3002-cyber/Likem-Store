import { getStoreSettings } from '@/lib/settings';
import SettingsForm from '@/components/SettingsForm';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="border-b border-[#1e2330] pb-4">
        <h1 className="text-2xl font-black text-white">Store & Appearance Settings</h1>
        <p className="text-xs text-[#94a3b8]">
          Configure luxury store theme colors, branding, WhatsApp ordering numbers, Snapchat handle, and commerce settings.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
