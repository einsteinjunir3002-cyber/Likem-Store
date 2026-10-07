import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getStoreSettings } from '@/lib/settings';
import { getSafeProductBySlug, getSafeProducts } from '@/lib/catalog';
import { formatGhs } from '@/lib/currency';
import { absoluteUrl, breadcrumbJsonLd, truncate, DEFAULT_OG_IMAGE } from '@/lib/seo';
import { getCurrentAdmin } from '@/lib/auth';
import ProductClientActions from '@/components/ProductClientActions';
import JsonLd from '@/components/JsonLd';
import { Truck, ShieldCheck, ArrowLeft, Droplet, Sparkles, Wind, Clock } from 'lucide-react';
import WishlistButton from '@/components/WishlistButton';

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getSafeProductBySlug(slug);

  if (!product || product.status !== 'PUBLISHED') {
    return {
      title: 'Fragrance Not Found | The Likem Perfumery',
      robots: { index: false, follow: false },
    };
  }

  const settings = await getStoreSettings();
  const storeName = settings?.storeName || 'The Likem Perfumery';
  const brandName = product.brand?.name;
  const primaryImage = product.images[0]?.media?.url || DEFAULT_OG_IMAGE;
  const isPublished = true;

  // Prefer admin-entered SEO fields (they exist in the database schema) when present.
  const title =
    (product as any).seoTitle ||
    (brandName ? `${product.name} by ${brandName} | ${storeName}` : `${product.name} | ${storeName}`);

  const details = [product.size, product.concentration].filter(Boolean).join(' ');
  const intro = product.shortDescription || product.description;
  const description =
    (product as any).seoDescription ||
    truncate(
      [
        intro ? intro.trim() : `${product.name}${brandName ? ` by ${brandName}` : ''}${details ? `, ${details}` : ''}.`,
        isPublished ? `${formatGhs(product.priceInGhs)}.` : '',
        `Order from ${storeName} with delivery across Ghana.`,
      ]
        .filter(Boolean)
        .join(' '),
      160
    );

  const canonical = `/products/${product.slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    // Draft / "coming soon" previews must not be indexed.
    robots: isPublished ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: storeName,
      images: [{ url: primaryImage, alt: `${product.name}${brandName ? ` by ${brandName}` : ''}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [primaryImage],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getSafeProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isPublished = product.status === 'PUBLISHED';
  if (!isPublished) {
    const admin = await getCurrentAdmin();
    if (!admin) {
      notFound();
    }
  }

  let settings = null;
  try {
    settings = await getStoreSettings();
  } catch (e) {
    settings = null;
  }

  let regions: any[] = [];
  try {
    regions = await prisma.deliveryRegion.findMany({
      where: { isActive: true },
      orderBy: { baseFeeInGhs: 'asc' },
    });
  } catch (e) {
    regions = [];
  }

  const primaryImage = product.images[0]?.media?.url || '/uploads/perfumes/perfume_db293e4b7fc0.jpeg';
  const whatsappNumber = settings?.whatsappNumber || '233502547133';
  const brandName = product.brand?.name;

  // ---- Structured data (only real fields; nothing invented) ----
  const productUrl = absoluteUrl(`/products/${product.slug}`);
  const imageUrls = product.images.map((i) => i.media?.url).filter(Boolean).map((u) => absoluteUrl(u as string));
  const productDescription = product.description || product.shortDescription || undefined;
  const hasStockInfo = typeof product.stock === 'number';
  const productJsonLd = isPublished
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        name: product.name,
        url: productUrl,
        ...(productDescription ? { description: productDescription } : {}),
        image: imageUrls.length ? imageUrls : [absoluteUrl(primaryImage)],
        ...(brandName ? { brand: { '@type': 'Brand', name: brandName } } : {}),
        // Real identifiers only: use the stored SKU if one exists.
        ...((product as any).sku ? { sku: (product as any).sku } : {}),
        ...(product.category?.name ? { category: product.category.name } : {}),
        offers: {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: 'GHS',
          price: Number(product.priceInGhs).toFixed(2),
          availability:
            hasStockInfo && (product.stock as number) <= 0
              ? 'https://schema.org/OutOfStock'
              : 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: settings?.storeName || 'The Likem Perfumery' },
        },
      }
    : null;

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Perfume Collection', path: '/products' },
    { name: product.name, path: `/products/${product.slug}` },
  ]);

  // Internal links to related products (same brand first, then others).
  let related: Array<{ name: string; slug: string }> = [];
  try {
    const others = (await getSafeProducts()).filter(
      (p) => p.slug !== product.slug && p.status === 'PUBLISHED' && p.slug
    );
    const sameBrand = others.filter((p) => brandName && p.brand?.name === brandName);
    const rest = others.filter((p) => !sameBrand.includes(p));
    related = [...sameBrand, ...rest].slice(0, 6).map((p) => ({ name: p.name, slug: p.slug }));
  } catch {
    related = [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <JsonLd data={productJsonLd ? [breadcrumbs, productJsonLd] : [breadcrumbs]} />
      {/* Return to gallery navigation */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#94a3b8] hover:text-[#d4af37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: Perfume Bottle Artwork Showcase */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden glass-luxury p-3 group">
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#07080b]">
              <img
                src={primaryImage}
                alt={`${product.name}${brandName ? ` by ${brandName}` : ''} – ${[product.size, product.concentration].filter(Boolean).join(' ') || 'perfume'}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 right-4 z-20">
                <WishlistButton productId={product.id} productName={product.name} className="w-10 h-10" />
              </div>
              {product.status === 'DRAFT' && (
                <div className="absolute top-4 left-4 bg-amber-500/90 text-black font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                  Preview Mode (Draft)
                </div>
              )}
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="w-24 h-24 rounded-2xl overflow-hidden border border-[#d4af37]/25 shrink-0 bg-[#07080b] p-1 glass-luxury"
                >
                  <img
                    src={img.media.url}
                    alt={(img.media as any).altText || `${product.name} – photo ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Olfactory Notes & Bespoke Purchase Actions */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d4af37] bg-[#d4af37]/10 px-3.5 py-1 rounded-full border border-[#d4af37]/30">
                {product.brand?.name || 'Exclusive Perfume House'}
              </span>
              <span className="text-xs text-[#94a3b8] tracking-wider uppercase">
                {product.gender || 'Unisex'} Fragrance
              </span>
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-5xl font-normal text-white leading-tight">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed font-light">
              {product.shortDescription || product.description || 'Formulated with refined sillage and long-lasting olfactory projection, delivered in pristine condition.'}
            </p>
          </div>

          {/* Olfactory Technical Attributes */}
          <div className="grid grid-cols-3 gap-3 p-5 rounded-2xl glass-luxury text-xs">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider uppercase text-[#64748b] block">Volume</span>
              <span className="font-serif-luxury text-lg text-white font-normal">{product.size || '100ml'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider uppercase text-[#64748b] block">Concentration</span>
              <span className="font-serif-luxury text-lg text-white font-normal">{product.concentration || 'Eau De Parfum'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider uppercase text-[#64748b] block">Provenance</span>
              <span className="font-serif-luxury text-lg text-[#d4af37] font-normal">Original Stock</span>
            </div>
          </div>

          {/* Client Action Component */}
          <ProductClientActions
            product={{
              id: product.id,
              name: product.name,
              brandName: product.brand?.name,
              priceInGhs: Number(product.priceInGhs),
              size: product.size || undefined,
              imageUrl: primaryImage,
              stock: product.stock,
              slug: product.slug,
            }}
            whatsappNumber={whatsappNumber}
            regions={regions.map((r) => ({
              regionName: r.regionName,
              baseFeeInGhs: Number(r.baseFeeInGhs),
              estimatedDays: r.estimatedDays,
            }))}
            onlineCheckoutEnabled={settings?.onlineCheckoutEnabled || false}
          />

          {/* Dispatch Guarantee Box */}
          <div className="space-y-3 pt-6 border-t border-[#d4af37]/15 text-xs text-[#94a3b8]">
            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold block">Accra &amp; Nationwide Delivery Guarantee</span>
                <span className="font-light">
                  Protected packaging with direct courier dispatch to homes and offices across Greater Accra and parcel routing to Kumasi, Takoradi, and all Ghanaian regions.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold block">Curator Verification</span>
                <span className="font-light">
                  Photographed in-house from our active stock. Check seal and bottle on delivery.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related fragrances — crawlable internal links */}
      {related.length > 0 && (
        <nav aria-label="More fragrances" className="space-y-4 pt-8 border-t border-[#d4af37]/15">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#94a3b8]">
            More Fragrances
          </h2>
          <ul className="flex flex-wrap gap-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/products/${r.slug}`}
                  className="inline-block px-4 py-2 rounded-full text-xs font-semibold text-[#cbd5e1] bg-[#131622] border border-[#d4af37]/20 hover:text-white transition-colors"
                >
                  {r.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/products"
                className="inline-block px-4 py-2 rounded-full text-xs font-semibold text-[#d4af37] border border-[#d4af37]/30 hover:text-[#f5e4ab] transition-colors"
              >
                View Complete Collection
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
