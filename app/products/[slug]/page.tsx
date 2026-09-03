import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatGhs } from '@/lib/currency';
import ProductClientActions from '@/components/ProductClientActions';
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
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { brand: true, images: { include: { media: true } } },
  });

  if (!product) {
    return { title: 'Fragrance Not Found | LIKEM Parfums' };
  }

  const primaryImage = product.images[0]?.media?.url || '/uploads/perfumes/perfume_db293e4b7fc0.jpeg';

  return {
    title: `${product.name} | LIKEM Haute Parfumerie Ghana`,
    description: `Acquire ${product.name} (${formatGhs(product.priceInGhs)}). Authentic perfume with prompt delivery across Ghana.`,
    openGraph: {
      title: `${product.name} - ${formatGhs(product.priceInGhs)}`,
      description: `Authentic fragrance delivered in Ghana. Order via WhatsApp or online.`,
      images: [{ url: primaryImage }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      images: {
        include: { media: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });

  const regions = await prisma.deliveryRegion.findMany({
    where: { isActive: true },
    orderBy: { baseFeeInGhs: 'asc' },
  });

  const primaryImage = product.images[0]?.media?.url || '/uploads/perfumes/perfume_db293e4b7fc0.jpeg';
  const whatsappNumber = settings?.whatsappNumber || '233502547133';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
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
                alt={product.name}
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
                  <img src={img.media.url} alt="" className="w-full h-full object-cover rounded-xl" />
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
    </div>
  );
}
