import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import StorefrontChrome from '@/components/StorefrontChrome';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'LIKEM Fragrances | Ghanaian Perfume Studio',
  description: 'Authentic perfumes and luxury fragrances delivered across Accra, Kumasi and all regions of Ghana. Order directly via WhatsApp or checkout online.',
  openGraph: {
    title: 'LIKEM Fragrances | Premium Perfumes in Ghana',
    description: 'Explore authentic perfumes with delivery across Ghana. WhatsApp ordering and Mobile Money supported.',
    locale: 'en_GH',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await prisma.storeSettings.findUnique({
    where: { id: 'default' },
  });

  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-[#0d0e12] text-[#f8fafc]">
        <CartProvider>
          <StorefrontChrome
            storeName={settings?.storeName}
            phoneContact={settings?.phoneContact}
            whatsappNumber={settings?.whatsappNumber}
            snapchatHandle={settings?.snapchatHandle}
          >
            {children}
          </StorefrontChrome>
        </CartProvider>
      </body>
    </html>
  );
}
