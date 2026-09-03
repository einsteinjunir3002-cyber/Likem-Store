import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import StorefrontChrome from '@/components/StorefrontChrome';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'The Likem Perfumery | Luxury Fragrances in Ghana',
  description:
    'Discover authentic luxury fragrances and perfumes curated for Ghana. Shop oriental, designer, and rare extraits de parfum with direct WhatsApp ordering and nationwide delivery.',
  keywords: 'perfumes Ghana, luxury fragrances Accra, Lattafa Ghana, Arabian perfumes, buy perfume online Ghana, The Likem Perfumery',
  openGraph: {
    title: 'The Likem Perfumery | Premium Perfumes in Ghana',
    description:
      'Authentic perfumes with delivery across Ghana. WhatsApp ordering and Mobile Money supported.',
    locale: 'en_GH',
    type: 'website',
    siteName: 'The Likem Perfumery',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Likem Perfumery | Luxury Perfumes Ghana',
    description: 'Authentic luxury perfumes delivered across Ghana',
  },
  robots: { index: true, follow: true },
};

// Strict mobile viewport export — guarantees 1:1 pixel-perfect fit on all devices
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#050508',
  colorScheme: 'dark',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = null;
  try {
    settings = await prisma.storeSettings.findUnique({
      where: { id: 'default' },
    });
  } catch (e) {
    // Graceful fallback during static build / momentary DB timeout
    settings = null;
  }

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
