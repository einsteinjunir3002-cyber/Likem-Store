import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatGhs } from '@/lib/currency';
import { MessageCircle, Filter, Sparkles } from 'lucide-react';

export const revalidate = 0;

interface ProductsPageProps {
  searchParams: Promise<{
    brand?: string;
    gender?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });

  const whereClause: any = {};

  if (params.brand) {
    whereClause.brand = { slug: params.brand };
  }

  if (params.gender) {
    whereClause.gender = params.gender;
  }

  // Fetch all 11 perfumes with their real imported images
  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      brand: true,
      images: {
        include: { media: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: [
      { status: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  const whatsappNumber = (settings?.whatsappNumber || '233502547133').replace(/[^0-9]/g, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold">
          The Full Gallery &middot; All {products.length} Fragrances
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-normal text-white">
          Our Complete Perfume Vault
        </h1>
        <p className="text-xs sm:text-sm text-[#94a3b8] font-light">
          Every photo is captured of actual bottles in stock. Browse all available and upcoming vault allocations with direct Ghana dispatch.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-luxury p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#94a3b8] flex items-center gap-1 font-semibold pr-2 uppercase text-[10px] tracking-wider">
            <Filter className="w-3.5 h-3.5 text-[#d4af37]" /> Filter by:
          </span>
          <Link
            href="/products"
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-colors ${
              !params.gender && !params.brand
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'bg-[#131622] text-[#cbd5e1] hover:text-white border border-[#d4af37]/20'
            }`}
          >
            All ({products.length})
          </Link>
          <Link
            href="/products?gender=Women"
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-colors ${
              params.gender === 'Women'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'bg-[#131622] text-[#cbd5e1] hover:text-white border border-[#d4af37]/20'
            }`}
          >
            Pour Femme
          </Link>
          <Link
            href="/products?gender=Men"
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-colors ${
              params.gender === 'Men'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'bg-[#131622] text-[#cbd5e1] hover:text-white border border-[#d4af37]/20'
            }`}
          >
            Pour Homme
          </Link>
          <Link
            href="/products?gender=Unisex"
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-colors ${
              params.gender === 'Unisex'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'bg-[#131622] text-[#cbd5e1] hover:text-white border border-[#d4af37]/20'
            }`}
          >
            Unisex
          </Link>
        </div>

        <div className="text-xs text-[#94a3b8] tracking-wider uppercase text-[10px]">
          Showing <span className="text-[#f5e4ab] font-bold">{products.length}</span> Verified Perfume{products.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Products Grid displaying all 11 items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {products.map((p) => {
          const primaryImage = p.images[0]?.media?.url || '/uploads/perfumes/perfume_db293e4b7fc0.jpeg';
          const isPublished = p.status === 'PUBLISHED';
          return (
            <div
              key={p.id}
              className="glass-luxury-card rounded-2xl overflow-hidden flex flex-col group"
            >
              <Link href={`/products/${p.slug}`} className="relative aspect-[4/5] overflow-hidden bg-[#07080b] block">
                <img
                  src={primaryImage}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                <span className="absolute top-3 left-3 text-[9px] uppercase font-bold tracking-[0.2em] px-3 py-1 rounded-full bg-[#07080b]/80 text-[#d4af37] border border-[#d4af37]/35 backdrop-blur-md">
                  {p.brand?.name || 'Exclusive'}
                </span>

                {!isPublished && (
                  <span className="absolute top-3 right-3 text-[8px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f5e4ab] border border-[#d4af37]/30 backdrop-blur-md">
                    Vault Inbound
                  </span>
                )}
              </Link>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-[#94a3b8]">
                    {p.gender || 'Unisex'} &middot; {p.size || '100ml'}
                  </div>
                  <Link href={`/products/${p.slug}`}>
                    <h3 className="font-serif-luxury text-xl sm:text-2xl text-white group-hover:text-[#f5e4ab] transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-[#64748b] line-clamp-2 leading-relaxed font-light">
                    {p.shortDescription || `${p.concentration || 'Eau De Parfum'} formulated with refined sillage.`}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#d4af37]/15">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-[#94a3b8]">
                      {isPublished ? 'Price' : 'Pricing'}
                    </span>
                    <span className="text-lg sm:text-xl font-black text-[#d4af37]">
                      {isPublished ? formatGhs(p.priceInGhs) : 'Inquire on WhatsApp'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href={`/products/${p.slug}`}
                      className="text-center py-2.5 px-3 bg-[#161a26] hover:bg-[#202535] text-[#f1f5f9] text-xs font-semibold tracking-wider rounded-xl transition-colors border border-[#d4af37]/20"
                    >
                      Details
                    </Link>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        isPublished
                          ? `Hello! I would like to order ${p.name} priced at ${formatGhs(p.priceInGhs)}. Please confirm availability for delivery.`
                          : `Hello! I would like to inquire about ${p.name} from your website.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-xs font-bold rounded-xl border border-[#25D366]/35 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{isPublished ? 'Order' : 'Inquire'}</span>
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
