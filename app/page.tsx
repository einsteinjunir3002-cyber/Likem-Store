import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatGhs } from '@/lib/currency';
import {
  MessageCircle,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Layers,
  Star,
  Truck,
  Shield,
  Phone,
} from 'lucide-react';

export const revalidate = 0;

// All 11 real perfume images for the rotating hero mosaic
const HERO_IMAGES = [
  '/uploads/perfumes/perfume_db293e4b7fc0.jpeg',
  '/uploads/perfumes/perfume_1eca40c304c2.jpeg',
  '/uploads/perfumes/perfume_66faa191e330.jpeg',
  '/uploads/perfumes/perfume_4ffb9383656c.jpeg',
];

const MOSAIC_IMAGES = [
  '/uploads/perfumes/perfume_342bf1c154bb.jpeg',
  '/uploads/perfumes/perfume_5f91ad90c271.jpeg',
  '/uploads/perfumes/perfume_6fc5669d7f3d.jpeg',
  '/uploads/perfumes/perfume_81d67a41557c.jpeg',
  '/uploads/perfumes/perfume_ee4645975528.jpeg',
  '/uploads/perfumes/perfume_ee7a1d8dbb34.jpeg',
  '/uploads/perfumes/perfume_1d6ab477b29b.jpeg',
];

export default async function HomePage() {
  const settings = await prisma.storeSettings.findUnique({
    where: { id: 'default' },
  });

  const allProducts = await prisma.product.findMany({
    include: {
      brand: true,
      images: {
        include: { media: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: [{ status: 'desc' }, { createdAt: 'desc' }],
  });

  const publishedProducts = allProducts.filter((p) => p.status === 'PUBLISHED');
  const whatsappNumber = (settings?.whatsappNumber || '233502547133').replace(/[^0-9]/g, '');

  return (
    <div className="overflow-x-hidden">
      {/* ============================================================
          HERO SECTION — Grand Luxury Parfumerie Entrance
          ============================================================ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Multi-layer atmospheric background */}
        <div className="absolute inset-0 bg-[#050508]" />
        <div className="hero-glow-top" />
        <div className="hero-glow-right" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.025] pointer-events-none" />

        {/* Animated grain texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(212,175,55,0.04) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(212,175,55,0.03) 0%, transparent 40%)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center min-h-[80vh]">

            {/* ── Left: Hero Copy ── */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-9 text-center lg:text-left">
              {/* Eyebrow label */}
              <div className="inline-flex items-center gap-2.5 badge-gold animate-fadeIn">
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
                <span>Haute Parfumerie · Ghanaian Online Boutique</span>
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
              </div>

              {/* Main headline */}
              <div className="space-y-5 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                <h1 className="font-serif-luxury text-6xl sm:text-7xl lg:text-8xl font-light leading-[1.04] tracking-tight text-white">
                  The Art of<br />
                  <span className="text-shimmer italic font-medium">Extraordinary</span>
                  <br />
                  <span className="text-white/90">Fragrance.</span>
                </h1>
                <p className="text-sm sm:text-base text-[#94a3b8] max-w-xl leading-relaxed font-light tracking-wide mx-auto lg:mx-0">
                  Immerse yourself in authentic oriental luxury, iconic designer compositions,
                  and rare extraits de parfum. Curated for the discerning fragrance lover
                  with seamless door-to-door delivery across Ghana.
                </p>
              </div>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fadeInUp"
                style={{ animationDelay: '0.2s' }}
              >
                <Link
                  href="/products"
                  className="btn-gold-luxury inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full text-[11px]"
                >
                  <ShoppingBag className="w-4 h-4 stroke-2" />
                  <span>Explore {allProducts.length} Fragrances</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    'Hello! I am admiring your perfume collection and would like to place an order.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-luxury inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full text-[11px]"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>

              {/* Trust metrics */}
              <div
                className="pt-8 animate-fadeInUp"
                style={{ animationDelay: '0.35s' }}
              >
                <div className="gold-divider mb-8" />
                <div className="grid grid-cols-3 gap-6 text-center lg:text-left">
                  <div className="space-y-1">
                    <div className="font-serif-luxury text-3xl sm:text-4xl text-[#d4af37] font-light tabular-nums">
                      {allProducts.length}+
                    </div>
                    <div className="text-[10px] tracking-[0.2em] uppercase text-[#64748b]">
                      Fragrances
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-serif-luxury text-3xl sm:text-4xl text-[#d4af37] font-light">
                      GH₵
                    </div>
                    <div className="text-[10px] tracking-[0.2em] uppercase text-[#64748b]">
                      Direct Pricing
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-serif-luxury text-3xl sm:text-4xl text-[#d4af37] font-light">
                      24h
                    </div>
                    <div className="text-[10px] tracking-[0.2em] uppercase text-[#64748b]">
                      Nationwide Dispatch
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Hero Image Mosaic ── */}
            <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end animate-fadeIn" style={{ animationDelay: '0.25s' }}>
              <div className="relative w-full max-w-sm lg:max-w-none lg:w-[420px]">
                {/* Main featured image */}
                <div className="relative rounded-3xl overflow-hidden glass-luxury p-2.5 animate-float" style={{ animationDuration: '6s' }}>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#080a10]">
                    <img
                      src={HERO_IMAGES[0]}
                      alt="Featured Luxury Fragrance"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2000ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/20 to-transparent" />
                    {/* Floating product plaque */}
                    <div className="absolute bottom-4 left-4 right-4 glass-luxury-dark rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37] font-bold">
                          Lattafa Pride
                        </span>
                        <span className="text-[10px] text-[#94a3b8] font-serif-luxury italic">
                          Eau De Parfum
                        </span>
                      </div>
                      <div className="font-serif-luxury text-2xl text-white font-normal">
                        Tharwah Gold
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-base font-black text-[#d4af37]">GH₵450.00</span>
                        <Link
                          href="/products"
                          className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#f5e4ab] hover:text-[#d4af37] transition-colors"
                        >
                          <span>View</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating mini cards */}
                <div className="absolute -top-4 -right-4 w-28 glass-luxury rounded-2xl p-2 animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}>
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img src={HERO_IMAGES[1]} alt="Fragrance" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 w-24 glass-luxury rounded-2xl p-2 animate-float" style={{ animationDelay: '2s', animationDuration: '7s' }}>
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img src={HERO_IMAGES[2]} alt="Fragrance" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Stars badge */}
                <div className="absolute top-1/2 -right-10 lg:-right-14 glass-luxury-dark rounded-2xl px-4 py-3 flex flex-col items-center gap-1 animate-gold-pulse">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 text-[#d4af37] fill-[#d4af37]" />
                    ))}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-[#f5e4ab] font-bold">Top Rated</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none" />
      </section>

      {/* ============================================================
          SIGNATURE SECTION DIVIDER
          ============================================================ */}
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="gold-divider-strong opacity-40" />
      </div>

      {/* ============================================================
          PERFUME COLLECTION GRID — All 11 Fragrances
          ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-14">
        {/* Section header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="ornament-line">
            <div className="section-label">The Signature Repertoire</div>
          </div>
          <h2 className="font-serif-luxury text-5xl sm:text-6xl font-light text-white leading-tight">
            Our Curated{' '}
            <span className="gold-gradient-text italic">Collection</span>
          </h2>
          <p className="text-sm text-[#64748b] font-light leading-relaxed max-w-lg mx-auto">
            Every photograph is taken in our studio of our actual stock in Ghana. Browse our
            active bottles — all available for immediate WhatsApp order or online checkout.
          </p>
        </div>

        {/* Products grid — luxury masonry-style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
          {allProducts.map((p, index) => {
            const primaryImage =
              p.images[0]?.media?.url ||
              `/uploads/perfumes/perfume_${index % 11 === 0 ? 'db293e4b7fc0' : '1eca40c304c2'}.jpeg`;
            const isPublished = p.status === 'PUBLISHED';

            return (
              <div
                key={p.id}
                className="glass-luxury-card perfume-card-shine rounded-2xl overflow-hidden flex flex-col group"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                {/* Image area */}
                <Link href={`/products/${p.slug}`} className="relative overflow-hidden bg-[#080a10] block" style={{ aspectRatio: '4/5' }}>
                  <img
                    src={primaryImage}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[800ms] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />

                  {/* Brand badge */}
                  <span className="absolute top-3 left-3 badge-gold text-[8px]">
                    {p.brand?.name || 'Exclusive'}
                  </span>

                  {/* Status tag */}
                  {!isPublished && (
                    <span className="absolute top-3 right-3 text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#f5e4ab] border border-[#d4af37]/25 backdrop-blur-sm">
                      Coming Soon
                    </span>
                  )}

                  {/* Quick view overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-[#050508]/80 backdrop-blur-sm text-[#f5e4ab] text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-2 rounded-full border border-[#d4af37]/30">
                      View Details
                    </span>
                  </div>
                </Link>

                {/* Product info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-[#475569]">
                      {p.gender || 'Unisex'} · {p.size || '100ml'} · {p.concentration || 'EDP'}
                    </div>
                    <Link href={`/products/${p.slug}`}>
                      <h3 className="font-serif-luxury text-lg sm:text-xl text-white group-hover:text-[#f5e4ab] transition-colors duration-300 leading-tight line-clamp-1">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-[#475569] line-clamp-2 leading-relaxed font-light">
                      {p.shortDescription ||
                        `${p.concentration || 'Eau De Parfum'} · Refined sillage & longevity.`}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="gold-divider" />
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#475569]">Price</span>
                      <span className="font-black text-[#d4af37] text-base">
                        {isPublished ? formatGhs(p.priceInGhs) : 'Inquire'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/products/${p.slug}`}
                        className="text-center py-2 px-2 bg-[#0e111a] hover:bg-[#161b28] text-[#e2e8f0] text-[10px] font-semibold tracking-wider rounded-xl transition-all border border-[#d4af37]/15 hover:border-[#d4af37]/35"
                      >
                        Details
                      </Link>
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                          isPublished
                            ? `Hello! I would like to order *${p.name}* priced at ${formatGhs(p.priceInGhs)}. Please confirm availability and delivery.`
                            : `Hello! I would like to inquire about *${p.name}*. Please share price and availability.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-[10px] font-bold rounded-xl border border-[#25D366]/25 hover:border-[#25D366]/50 transition-all"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>{isPublished ? 'Order' : 'Inquire'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all CTA */}
        <div className="text-center pt-4">
          <Link
            href="/products"
            className="btn-gold-luxury inline-flex items-center gap-3 px-10 py-4 rounded-full text-[11px]"
          >
            <Layers className="w-4 h-4" />
            <span>View Complete Collection ({allProducts.length} Fragrances)</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </section>

      {/* ============================================================
          PHILOSOPHY / PROMISE SECTION
          ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-luxury rounded-3xl p-10 sm:p-16 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/04 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d4af37]/03 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
            <div className="ornament-line">
              <div className="section-label">Uncompromising Standards</div>
            </div>
            <h2 className="font-serif-luxury text-4xl sm:text-5xl text-white font-light leading-snug">
              Direct Door-to-Door Delivery{' '}
              <span className="gold-gradient-warm italic">Across Ghana</span>
            </h2>
            <p className="text-sm text-[#64748b] font-light leading-relaxed">
              We operate exclusively as an independent digital perfume house, bypassing
              brick-and-mortar markups to bring you pristine originals at honest prices.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                roman: 'I',
                color: '#d4af37',
                title: 'Genuine Originals',
                desc: 'Every photograph displayed on this website is taken in our studio of our actual physical bottles. What you see is precisely what arrives in your hands.',
              },
              {
                icon: MessageCircle,
                roman: 'II',
                color: '#25D366',
                title: 'WhatsApp Concierge',
                desc: 'Tap any perfume to open a pre-addressed WhatsApp dialog. Confirm scent notes, batch details, and delivery timing directly with our curator.',
              },
              {
                icon: Truck,
                roman: 'III',
                color: '#60a5fa',
                title: 'Nationwide Dispatch',
                desc: 'Same-day dispatch in Greater Accra & Tema. Secured cushioned parcels to Kumasi, Takoradi, Tamale, and all regions within 24–48 hours.',
              },
            ].map((feature) => (
              <div
                key={feature.roman}
                className="relative p-8 rounded-2xl border transition-all duration-500 group hover:border-[#d4af37]/30"
                style={{
                  background: 'rgba(8, 10, 18, 0.85)',
                  borderColor: 'rgba(212, 175, 55, 0.12)',
                }}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${feature.color}08 0%, transparent 70%)`,
                  }}
                />
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-serif-luxury text-xl font-light mb-5"
                  style={{
                    background: `${feature.color}15`,
                    border: `1px solid ${feature.color}30`,
                    color: feature.color,
                  }}
                >
                  {feature.roman}
                </div>
                <h3 className="font-serif-luxury text-2xl text-white mb-3 font-normal">
                  {feature.title}
                </h3>
                <p className="text-xs text-[#64748b] font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          IMAGE MOSAIC STRIP (Showcase all 11 images)
          ============================================================ */}
      <section className="py-16 overflow-hidden">
        <div className="text-center mb-10 px-4">
          <div className="section-label mb-3">The Vault</div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-white font-light">
            Every Bottle, <span className="gold-gradient-text italic">Real & In Stock</span>
          </h2>
        </div>
        <div className="flex gap-4 px-4 overflow-x-auto pb-4 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[...allProducts, ...allProducts].map((p, i) => {
            const img = p.images[0]?.media?.url || MOSAIC_IMAGES[i % MOSAIC_IMAGES.length];
            return (
              <Link
                key={`${p.id}-${i}`}
                href={`/products/${p.slug}`}
                className="flex-shrink-0 w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden glass-luxury-card group relative"
              >
                <img
                  src={img}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="font-serif-luxury text-sm text-white leading-tight line-clamp-1">{p.name}</div>
                  <div className="text-[10px] text-[#d4af37] font-bold mt-0.5">
                    {p.status === 'PUBLISHED' ? formatGhs(p.priceInGhs) : 'Inquire'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          SOCIAL / WHATSAPP COMMUNITY CTA
          ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="glass-luxury rounded-3xl p-12 sm:p-20 text-center relative overflow-hidden">
          {/* Decorative orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#d4af37]/06 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8 max-w-xl mx-auto">
            <div className="ornament-line">
              <div className="section-label">Join Our Fragrance Circle</div>
            </div>
            <h2 className="font-serif-luxury text-4xl sm:text-6xl text-white font-light leading-tight">
              Follow Our{' '}
              <span className="gold-gradient-text italic">WhatsApp Status</span>
            </h2>
            <p className="text-sm text-[#64748b] font-light leading-relaxed">
              Be the first to see unboxing drops, new Arabian and French arrivals, and
              limited holiday gift collections curated exclusively for our community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello! I would like to connect and see your latest fragrances.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-extrabold text-[11px] uppercase tracking-wider transition-all shadow-2xl"
                style={{
                  background: '#25D366',
                  color: '#000',
                  boxShadow: '0 8px 32px rgba(37, 211, 102, 0.30)',
                }}
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Connect on WhatsApp</span>
              </a>

              <a
                href={`tel:${settings?.phoneContact || '0502547133'}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-wider transition-all btn-outline-luxury"
              >
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span>{settings?.phoneContact || '0502547133'}</span>
              </a>
            </div>

            {settings?.snapchatHandle && (
              <a
                href={`https://snapchat.com/add/${settings.snapchatHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition-all"
                style={{
                  background: 'rgba(255, 252, 0, 0.10)',
                  border: '1px solid rgba(255, 252, 0, 0.30)',
                  color: '#FFFC00',
                }}
              >
                <span>📸 Snapchat: @{settings.snapchatHandle}</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
