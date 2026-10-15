import fs from 'fs';
import path from 'path';
import { getStoreSettings } from '@/lib/settings';
import { getSafeProducts } from '@/lib/catalog';
import SettingsForm from '@/components/SettingsForm';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();
  const products = await getSafeProducts();

  // Collect stock images from public/uploads/perfumes
  const stockImages: Array<{ url: string; label?: string }> = [];
  try {
    const perfumesDir = path.join(process.cwd(), 'public', 'uploads', 'perfumes');
    if (fs.existsSync(perfumesDir)) {
      const files = fs.readdirSync(perfumesDir);
      for (const file of files) {
        if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
          stockImages.push({
            url: `/uploads/perfumes/${file}`,
            label: 'Stock Perfume',
          });
        }
      }
    }
  } catch (err) {
    console.error('Error reading stock perfumes directory:', err);
  }

  // Also collect images from products
  const productImages: Array<{ url: string; label?: string }> = [];
  products.forEach((p) => {
    p.images?.forEach((img) => {
      if (img.media?.url && !stockImages.some((s) => s.url === img.media.url)) {
        productImages.push({
          url: img.media.url,
          label: p.name,
        });
      }
    });
  });

  const availablePerfumeImages = [...stockImages, ...productImages];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="border-b border-[#1e2330] pb-4">
        <h1 className="text-2xl font-black text-white">Store & Appearance Settings</h1>
        <p className="text-xs text-[#94a3b8]">
          Configure luxury store theme colors, top hero banner picture, branding, WhatsApp ordering numbers, Snapchat handle, and commerce settings.
        </p>
      </div>

      <SettingsForm settings={settings} availablePerfumeImages={availablePerfumeImages} />
    </div>
  );
}
