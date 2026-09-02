import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatGhs } from '@/lib/currency';
import { MessageCircle, ShoppingBag, Sparkles, ArrowRight, Layers } from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  const settings = await prisma.storeSettings.findUnique({
    where: { id: 'default' },
  });

  // Query ALL products with their real imported images
  const allProducts = await prisma.product.findMany({
    include: {
      brand: true,
      images: {
        include: { media: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: [
      { status: 'desc' }, // Published first, then drafts
      { createdAt: 'desc' },
    ],
  });

  const publishedProducts = allProducts.filter((p) => p.status === 'PUBLISHED');
  const draftProducts = allProducts.filter((p) => p.status === 'DRAFT');

  const whatsappNumber = (settings?.whatsappNumber || '233502547133').replace(/[^0-9]/g, '');

  return (
    <div className="space-y-20 sm:space-y-32 pb-24">
      {/* Haute Parfumerie Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#d4af37]/20">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#d4af37]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#b88d1d]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#161a26]/90 border border-[#d4af37]/35 text-xs font-semibold text-[#f5e4ab] shadow-inner tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Haute Parfumerie &middot; Ghanaian Online Studio</span>
              </div>

              <div className="space-y-4">
                <h1 className="font-serif-luxury text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.08]">
                  The Art of <br />
                  <span className="gold-gradient-text italic font-medium">Extraordinary</span> Fragrance.
                </h1>
                <p className="text-sm sm:text-base text-[#94a3b8] max-w-xl leading-relaxed font-light tracking-wide mx-auto lg:mx-0">
                  Immerse yourself in authentic oriental luxury, iconic designer compositions, and rare extraits de parfum. Curated for the discerning fragrance lover with seamless door-to-door delivery across Ghana.
                </p>
              </div>

              {/* Luxury CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="btn-gold-luxury inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-xs shadow-xl"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2]" />
                  <span>Explore All {allProducts.length} Fragrances</span>
                </Link>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    'Hello! I am admiring your perfume collection and would like to inquire about placing an order.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#131622]/90 hover:bg-[#1a1f2e] border border-[#d4af37]/30 text-[#f5e4ab] font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>

              {/* Reassurance Accents */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-[#d4af37]/15 text-xs text-[#cbd5e1]">
                <div className="space-y-1">
                  <div className="font-serif-luxury text-xl sm:text-2xl text-[#d4af37] font-normal">
                    {allProducts.length} Bottles
                  </div>
                  <div className="text-[10px] tracking-wider uppercase text-[#94a3b8]">In Our Media Vault</div>
                </div>
                <div className="space-y-1">
                  <div className="font-serif-luxury text-xl sm:text-2xl text-[#d4af37] font-normal">GH₵</div>
                  <div className="text-[10px] tracking-wider uppercase text-[#94a3b8]">Direct Cedi Pricing</div>
                </div>
                <div className="space-y-1">
                  <div className="font-serif-luxury text-xl sm:text-2xl text-[#d4af37] font-normal">24-48h</div>
                  <div className="text-[10px] tracking-wider uppercase text-[#94a3b8]">Nationwide Dispatch</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden glass-luxury p-3 group">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#07080b]">
                  <img
                    src="/uploads/perfumes/perfume_db293e4b7fc0.jpeg"
                    alt="Featured Perfume - Tharwah Gold"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/30 to-transparent" />

                  {/* Floating Perfumery Plaque */}
                  <div className="absolute bottom-4 left-4 right-4 p-5 rounded-xl bg-[#090b12]/90 backdrop-blur-md border border-[#d4af37]/30 shadow-2xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-bold">
                        Lattafa Pride &middot; Collection
                      </span>
                      <span className="text-xs text-white font-serif-luxury italic">100ml Eau De Parfum</span>
                    </div>
                    <div className="font-serif-luxury text-2xl font-normal text-white">Tharwah Gold</div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-black text-[#d4af37]">GH₵450.00</span>
                      <Link
                        href="/products/tharwah-gold"
                        className="text-[10px] uppercase font-bold tracking-widest text-[#f5e4ab] hover:underline flex items-center gap-1"
                      >
                        <span>View Fragrance</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Perfumes Showcase (At least 4 distinct bottles prominently displayed) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold">
            Selective Olfactory Creations
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl font-normal text-white">
            The Signature Repertoire
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] font-light">
            Every photograph is taken of our active stock in Ghana. Browse our active bottles below or inquire directly via WhatsApp.
          </p>
        </div>

        {/* Display all 11 real perfumes in luxury cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {allProducts.map((p) => {
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
                    <p className="text-[11px] text-[#64748b] line-clamp-2 leading-relaxed">
                      {p.shortDescription || `${p.concentration || 'Eau De Parfum'} formulated with refined sillage.`}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#d4af37]/15">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-[#94a3b8]">
                        {isPublished ? 'Price' : 'Pricing'}
                      </span>
                      <span className="text-lg sm:text-xl font-black text-[#d4af37]">
                        {isPublished ? formatGhs(p.priceInGhs) : 'Inquire'}
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
                            ? `Hello! I would like to order ${p.name} priced at ${formatGhs(p.priceInGhs)}. Please confirm delivery arrangements.`
                            : `Hello! I would like to inquire about the price and availability of ${p.name} on your website.`
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

        {/* Prompt to browse all or view in collection */}
        <div className="text-center pt-4">
          <Link
            href="/products"
            className="btn-gold-luxury inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs"
          >
            <Layers className="w-4 h-4" />
            <span>View Complete Collection Gallery ({allProducts.length} Items)</span>
          </Link>
        </div>
      </section>

      {/* The Parfumerie Experience & Dispatch Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-luxury rounded-3xl p-8 sm:p-16 space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold">
              Uncompromising Standards
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-white font-normal">
              Direct Door-to-Door Delivery Across Ghana
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-light leading-relaxed">
              We operate exclusively as an independent digital perfume house. By bypassing brick-and-mortar showroom markups, we dedicate our resources to sourcing pristine original bottles and expediting courier dispatches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#0b0d14]/90 border border-[#d4af37]/20 space-y-4 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/35 flex items-center justify-center font-serif-luxury text-2xl text-[#d4af37]">
                I
              </div>
              <h3 className="font-serif-luxury text-2xl text-white">Genuine Liquid Gold</h3>
              <p className="text-xs text-[#94a3b8] font-light leading-relaxed">
                All 11 perfume photographs displayed on this website are taken in our studio of our actual physical bottles. What you see is precisely what arrives in your hands.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0b0d14]/90 border border-[#d4af37]/20 space-y-4 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/15 border border-[#25D366]/35 flex items-center justify-center font-serif-luxury text-2xl text-[#25D366]">
                II
              </div>
              <h3 className="font-serif-luxury text-2xl text-white">Direct WhatsApp Concierge</h3>
              <p className="text-xs text-[#94a3b8] font-light leading-relaxed">
                Experience personal Ghanaian social commerce. Tap any perfume to open a pre-addressed WhatsApp dialog with the curator to confirm olfactory notes, batch details, and delivery timings.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0b0d14]/90 border border-[#d4af37]/20 space-y-4 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/15 border border-[#38bdf8]/35 flex items-center justify-center font-serif-luxury text-2xl text-[#38bdf8]">
                III
              </div>
              <h3 className="font-serif-luxury text-2xl text-white">Secured Ghana Dispatch</h3>
              <p className="text-xs text-[#94a3b8] font-light leading-relaxed">
                Prompt dispatch across Greater Accra and Tema via trusted motorcycle couriers. Secured, cushioned parcel dispatches to Kumasi, Takoradi, Tamale, and all regions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media & WhatsApp Status Community */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-luxury rounded-3xl p-10 sm:p-16 text-center space-y-8 relative overflow-hidden">
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold">
              Join Our Fragrance Circle
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl text-white">
              Follow Our Daily WhatsApp Status
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-light">
              Be the first to see unboxing drops, new Arabian and French arrivals, and limited holiday gift collections.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 pt-2">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#25D366]/20"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>Connect on WhatsApp: {settings?.whatsappNumber}</span>
            </a>

            {settings?.snapchatHandle && (
              <a
                href={`https://snapchat.com/add/${settings.snapchatHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#FFFC00] hover:bg-[#eedc00] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#FFFC00]/20"
              >
                <span>Snapchat: @{settings.snapchatHandle}</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
