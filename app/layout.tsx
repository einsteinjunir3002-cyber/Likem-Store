import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import StorefrontChrome from '@/components/StorefrontChrome';
import ThemeProvider from '@/components/ThemeProvider';
import { getStoreSettings } from '@/lib/settings';
import { generateThemeCSS } from '@/lib/theme';

export const metadata: Metadata = {
  metadataBase: new URL('https://thelikemperfumery.vercel.app'),
  title: 'The Likem Perfumery | Luxury Fragrances in Ghana',
  description:
    'Discover authentic luxury fragrances and perfumes curated for Ghana. Shop oriental, designer, and rare extraits de parfum with direct WhatsApp ordering and nationwide delivery.',
  keywords: 'perfumes Ghana, luxury fragrances Accra, Lattafa Ghana, Arabian perfumes, buy perfume online Ghana, The Likem Perfumery',
  openGraph: {
    title: 'The Likem Perfumery | Premium Perfumes in Ghana',
    description:
      'Authentic perfumes with delivery across Ghana. WhatsApp ordering and Mobile Money supported.',
    url: 'https://thelikemperfumery.vercel.app',
    locale: 'en_GH',
    type: 'website',
    siteName: 'The Likem Perfumery',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Likem Perfumery | Luxury Perfumes Ghana',
    description: 'Authentic luxury perfumes delivered across Ghana',
  },
  alternates: {
    canonical: 'https://thelikemperfumery.vercel.app',
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
  colorScheme: 'dark',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getStoreSettings();
  const themeCSS = generateThemeCSS(settings);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content={settings.backgroundColor || '#050508'} />
        <style
          id="likem-dynamic-theme-css"
          dangerouslySetInnerHTML={{ __html: themeCSS }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col" style={{ background: settings.backgroundColor || '#050508' }}>
        <ThemeProvider initialConfig={settings}>
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
        </ThemeProvider>
      </body>
    </html>
  );
}

