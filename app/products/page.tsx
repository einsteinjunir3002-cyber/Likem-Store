import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatGhs } from '@/lib/currency';
import { MessageCircle, Filter } from 'lucide-react';

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
  if (params.brand) whereClause.brand = { slug: params.brand };
  if (params.gender) whereClause.gender = params.gender;

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      brand: true,
      images: {
        include: { media: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: [{ status: 'desc' }, { createdAt: 'desc' }],
  });

  const whatsappNumber = (settings?.whatsappNumber || '233502547133').replace(/[^0-9]/g, '');

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">

      {/* ── Page Header ── */}
      <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto px-2">
        <span className="section-label">
          The Full Gallery · All {products.length} Fragrances
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
            { label: `All (${products.length})`, href: '/products', active: !params.gender && !params.brand },
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
            <span className="text-[#f5e4ab] font-bold">{products.length}</span> perfumes
          </div>
        </div>
      </div>

      {/* ── Products Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
        {products.map((p) => {
          const primaryImage = p.images[0]?.media?.url || '/uploads/perfumes/perfume_db293e4b7fc0.jpeg';
          const isPublished = p.status === 'PUBLISHED';

          return (
            <div
              key={p.id}
              className="glass-luxury-card rounded-xl sm:rounded-2xl overflow-hidden flex flex-col group"
            >
              {/* Image */}
              <Link
                href={`/products/${p.slug}`}
                className="relative overflow-hidden bg-[#080a10] block"
                style={{ aspectRatio: '4/5' }}
              >
                <img
                  src={primaryImage}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-110
                             transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/80 via-transparent
                                to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[7px] sm:text-[9px]
                                 uppercase font-bold tracking-wide px-2 sm:px-3 py-0.5 sm:py-1
                                 rounded-full bg-[#080a10]/80 text-[#d4af37]
                                 border border-[#d4af37]/35 backdrop-blur-md">
                  {p.brand?.name || 'Exclusive'}
                </span>

                {!isPublished && (
                  <span className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[7px] sm:text-[8px]
                                   uppercase font-bold tracking-wide px-1.5 sm:px-2.5 py-0.5 rounded-full
                                   bg-[#d4af37]/20 text-[#f5e4ab] border border-[#d4af37]/30">
                    Soon
                  </span>
                )}
              </Link>

              {/* Info */}
              <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="text-[8px] sm:text-[10px] uppercase tracking-wide text-[#94a3b8]">
                    {p.gender || 'Unisex'} · {p.size || '100ml'}
                  </div>
                  <Link href={`/products/${p.slug}`}>
                    <h3 className="font-serif-luxury text-base sm:text-xl lg:text-2xl text-white
                                   group-hover:text-[#f5e4ab] transition-colors line-clamp-1">
                      {p.name}
                    </h3>
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
                      className="text-center py-2 px-1 sm:px-3 bg-[#161a26] hover:bg-[#202535]
                                 text-[#f1f5f9] text-[9px] sm:text-xs font-semibold tracking-wider
                                 rounded-lg sm:rounded-xl transition-colors border border-[#d4af37]/20"
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
                      className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-3
                                 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366]
                                 text-[9px] sm:text-xs font-bold rounded-lg sm:rounded-xl
                                 border border-[#25D366]/35 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3 flex-shrink-0" />
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
