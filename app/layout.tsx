import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import StorefrontChrome from '@/components/StorefrontChrome';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'LIKEM Fragrances | Luxury Perfumes in Ghana',
  description:
    'Discover authentic luxury fragrances and perfumes curated for Ghana. Shop oriental, designer, and rare extraits de parfum with direct WhatsApp ordering and nationwide delivery.',
  keywords: 'perfumes Ghana, luxury fragrances Accra, Lattafa Ghana, Arabian perfumes, buy perfume online Ghana, LIKEM fragrances',
  openGraph: {
    title: 'LIKEM Fragrances | Premium Perfumes in Ghana',
    description:
      'Authentic perfumes with delivery across Ghana. WhatsApp ordering and Mobile Money supported.',
    locale: 'en_GH',
    type: 'website',
    siteName: 'LIKEM Fragrances',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LIKEM Fragrances | Luxury Perfumes Ghana',
    description: 'Authentic luxury perfumes delivered across Ghana',
  },
  robots: { index: true, follow: true },
  themeColor: '#d4af37',
};

// Correct viewport export — prevents iOS from zooming on input fields
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow pinch-to-zoom for accessibility
  userScalable: true,
  themeColor: '#d4af37',
  colorScheme: 'dark',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen flex flex-col" style={{ background: '#050508' }}>
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
