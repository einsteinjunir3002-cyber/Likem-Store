import Link from 'next/link';
import type { Metadata } from 'next';
import { getStoreSettings } from '@/lib/settings';
import { getSafeProducts } from '@/lib/catalog';
import { formatGhs } from '@/lib/currency';
import { absoluteUrl, breadcrumbJsonLd, DEFAULT_OG_IMAGE } from '@/lib/seo';
import { Filter } from 'lucide-react';
import { WhatsAppIcon } from '@/components/SocialIcons';
import WishlistButton from '@/components/WishlistButton';
import JsonLd from '@/components/JsonLd';

export const revalidate = 0;

// Filtered views (?gender=, ?brand=, ?sort=) all canonicalize to /products so they
// do not compete with the main collection page in search results.
export const metadata: Metadata = {
  title: { absolute: 'Perfume Collection | The Likem Perfumery Ghana' },
  description:
    'Browse the full collection of authentic perfumes at The Likem Perfumery — oriental, designer and unisex fragrances with prices in Ghana cedis, WhatsApp ordering and delivery across Ghana.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Perfume Collection | The Likem Perfumery Ghana',
    description:
      'Authentic perfumes with prices in Ghana cedis, WhatsApp ordering and delivery across Ghana.',
    url: '/products',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, alt: 'Perfume collection at The Likem Perfumery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perfume Collection | The Likem Perfumery Ghana',
    description: 'Authentic perfumes with prices in Ghana cedis and delivery across Ghana.',
    images: [DEFAULT_OG_IMAGE],
  },
};

interface ProductsPageProps {
  searchParams: Promise<{
    brand?: string;
    gender?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  let settings = null;
  try {
    settings = await getStoreSettings();
  } catch (e) {
    settings = null;
  }

  const allProducts = await getSafeProducts();
  let products = allProducts.filter((p) => p.status === 'PUBLISHED');
  if (params.gender) {
    products = products.filter((p) => (p.gender || '').toLowerCase() === params.gender?.toLowerCase());
  }
  if (params.brand) {
    products = products.filter((p) => (p.brand?.slug || '').toLowerCase() === params.brand?.toLowerCase());
  }

  const storeName = settings?.storeName || 'The Likem Perfumery';
  const whatsappNumber = (settings?.whatsappNumber || '233502547133').replace(/[^0-9]/g, '');

  // Structured data lists only published products (same ones Google can index).
  const listed = allProducts.filter((p) => p.status === 'PUBLISHED' && p.slug);
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${storeName} perfume collection`,
    itemListElement: listed.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/products/${p.slug}`),
      name: p.name,
    })),
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Perfume Collection', path: '/products' },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      <JsonLd data={[breadcrumbs, itemListJsonLd]} />

      {/* ── Page Header ── */}
      <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto px-2">
        <span className="section-label">
          The Full Gallery · Authentic Fragrances
        </span>
        <h1 className="font-serif-luxury font-normal text-white"
          style={{ fontSize: 'clamp(1.75rem, 6vw, 3.25rem)' }}>
          Our Complete Perfume Vault
        </h1>
        <p className="text-xs sm:text-sm text-[#94a3b8] font-light leading-relaxed">
          Every photo is captured of actual bottles in stock. Browse all available and upcoming
          vault allocations with direct Ghana dispatch.
        </p>
      </div>

      {/* ── Filter Bar ── */}
      <div className="glass-luxury p-3 sm:p-4 rounded-xl sm:rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#94a3b8] flex items-center gap-1 font-semibold text-[10px]
                           uppercase tracking-wider mr-1">
            <Filter className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden xs:inline">Filter:</span>
          </span>

          {[
            { label: 'All Fragrances', href: '/products', active: !params.gender && !params.brand },
            { label: 'Femme', href: '/products?gender=Women', active: params.gender === 'Women' },
            { label: 'Homme', href: '/products?gender=Men', active: params.gender === 'Men' },
            { label: 'Unisex', href: '/products?gender=Unisex', active: params.gender === 'Unisex' },
          ].map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs
                          font-semibold tracking-wider transition-colors tap-target
                          flex items-center ${
                f.active
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'bg-[#131622] text-[#cbd5e1] hover:text-white border border-[#d4af37]/20'
              }`}
            >
              {f.label}
            </Link>
          ))}

          <div className="ml-auto text-[9px] sm:text-[10px] text-[#94a3b8] tracking-wider uppercase">
            Curated Originals
          </div>
        </div>
      </div>

      {/* ── Products Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
        {products.map((p) => {
          const primaryImage = p.images[0]?.media?.url || '/uploads/perfumes/perfume_db293e4b7fc0.jpeg';
          const isPublished = true;

          return (
            <div
              key={p.id}
              className="glass-luxury-card rounded-xl sm:rounded-2xl overflow-hidden flex flex-col group"
            >
              {/* Image & Wishlist Button */}
              <div className="relative overflow-hidden bg-[#080a10] block" style={{ aspectRatio: '4/5' }}>
                <Link
                  href={`/products/${p.slug}`}
                  className="block w-full h-full"
                >
                  <img
                    src={primaryImage}
                    alt={p.brand?.name ? `${p.name} perfume by ${p.brand.name}` : `${p.name} perfume`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110
                               transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/80 via-transparent
                                  to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                </Link>

                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[7px] sm:text-[9px]
                                 uppercase font-bold tracking-wide px-2 sm:px-3 py-0.5 sm:py-1
                                 rounded-full bg-[#080a10]/80 text-[#d4af37]
                                 border border-[#d4af37]/35 backdrop-blur-md pointer-events-none z-10">
                  {p.brand?.name || 'Exclusive'}
                </span>

                {/* Jumia-style Love / Wishlist Heart Button */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20">
                  <WishlistButton productId={p.id} productName={p.name} />
                </div>

                {!isPublished && (
                  <span className="absolute bottom-2 right-2 text-[7px] sm:text-[8px]
                                   uppercase font-bold tracking-wide px-1.5 sm:px-2.5 py-0.5 rounded-full
                                   bg-[#d4af37]/20 text-[#f5e4ab] border border-[#d4af37]/30 z-10">
                    Soon
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="text-[8px] sm:text-[10px] uppercase tracking-wide text-[#94a3b8]">
                    {p.gender || 'Unisex'} · {p.size || '100ml'}
                  </div>
                  <Link href={`/products/${p.slug}`}>
                    <h2 className="font-serif-luxury text-base sm:text-xl lg:text-2xl text-white
                                   group-hover:text-[#f5e4ab] transition-colors line-clamp-1">
                      {p.name}
                    </h2>
                  </Link>
                  <p className="hidden sm:block text-[11px] text-[#64748b] line-clamp-2
                                leading-relaxed font-light">
                    {p.shortDescription || `${p.concentration || 'Eau De Parfum'} formulated with refined sillage.`}
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-3 pt-1 sm:pt-3 border-t border-[#d4af37]/15">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[8px] sm:text-[10px] uppercase tracking-wide text-[#94a3b8]">
                      {isPublished ? 'Price' : 'Pricing'}
                    </span>
                    <span className="text-sm sm:text-lg lg:text-xl font-black text-[#d4af37]">
                      {isPublished ? formatGhs(p.priceInGhs) : 'Inquire'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <Link
                      href={`/products/${p.slug}`}
                      aria-label={`View details for ${p.name}`}
                      className="text-center py-2 px-1 sm:px-3 bg-[#161a26] hover:bg-[#202535]
                                 text-[#f1f5f9] text-[9px] sm:text-xs font-semibold tracking-wider
                                 rounded-lg sm:rounded-xl transition-colors border border-[#d4af37]/20"
                    >
                      Details
                    </Link>
                    <a
                      aria-label={`${isPublished ? 'Order' : 'Ask about'} ${p.name} on WhatsApp`}
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        isPublished
                          ? `Hello! I would like to order ${p.name} from ${storeName} priced at ${formatGhs(p.priceInGhs)}. Please confirm availability for delivery.`
                          : `Hello! I would like to inquire about ${p.name} from ${storeName}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-3
                                 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366]
                                 text-[9px] sm:text-xs font-bold rounded-lg sm:rounded-xl
                                 border border-[#25D366]/35 transition-colors"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{isPublished ? 'Order' : 'Ask'}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
