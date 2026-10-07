import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import StorefrontChrome from '@/components/StorefrontChrome';
import ThemeProvider from '@/components/ThemeProvider';
import { getStoreSettings } from '@/lib/settings';
import { generateThemeCSS } from '@/lib/theme';
import { getSiteUrl, absoluteUrl, toE164, DEFAULT_OG_IMAGE } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

// NOTE: no root-level `alternates.canonical` / `openGraph.url` here on purpose.
// They would be inherited by every page and point all of them at the homepage.
// Each page declares its own canonical URL.
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
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
    images: [{ url: DEFAULT_OG_IMAGE, alt: 'The Likem Perfumery fragrance' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Likem Perfumery | Luxury Perfumes Ghana',
    description: 'Authentic luxury perfumes delivered across Ghana',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
  // Google Search Console HTML-tag verification (optional). Set in Vercel:
  // NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<content value from Search Console>
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

// Mobile-first responsive viewport adhering to Google Mobile-Friendly and WCAG accessibility standards
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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

  // Site-wide structured data — built only from information already in store settings.
  const siteUrl = getSiteUrl();
  const storeName = settings.storeName || 'The Likem Perfumery';
  const telephone = toE164(settings.phoneContact || settings.whatsappNumber);
  const sameAs = settings.snapchatHandle
    ? [`https://snapchat.com/add/${settings.snapchatHandle}`]
    : undefined;

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': `${siteUrl}/#organization`,
    name: storeName,
    url: siteUrl,
    description:
      'Online perfume boutique in Ghana offering authentic luxury fragrances with WhatsApp ordering and delivery across Ghana.',
    areaServed: { '@type': 'Country', name: 'Ghana' },
    ...(telephone
      ? {
          telephone,
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone,
              contactType: 'customer service',
              areaServed: 'GH',
              url: absoluteUrl('/contact'),
            },
          ],
        }
      : {}),
    ...(sameAs ? { sameAs } : {}),
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: storeName,
    url: siteUrl,
    inLanguage: 'en-GH',
    publisher: { '@id': `${siteUrl}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };

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
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
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

