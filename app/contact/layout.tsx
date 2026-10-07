import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { absoluteUrl, breadcrumbJsonLd, DEFAULT_OG_IMAGE } from '@/lib/seo';

// The contact page is a client component (form state), so its metadata lives here.
export const metadata: Metadata = {
  title: { absolute: 'Contact The Likem Perfumery | Ghana' },
  description:
    'Contact The Likem Perfumery in Ghana by WhatsApp, phone call or Snapchat to ask about a perfume, check stock or arrange delivery.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact The Likem Perfumery | Ghana',
    description:
      'Reach The Likem Perfumery by WhatsApp, phone or Snapchat to ask about a perfume, check stock or arrange delivery.',
    url: '/contact',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, alt: 'The Likem Perfumery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact The Likem Perfumery | Ghana',
    description: 'Reach The Likem Perfumery by WhatsApp, phone or Snapchat.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact The Likem Perfumery',
    url: absoluteUrl('/contact'),
    about: { '@id': `${absoluteUrl('/')}#organization` },
  };
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
          contactJsonLd,
        ]}
      />
      {children}
    </>
  );
}
