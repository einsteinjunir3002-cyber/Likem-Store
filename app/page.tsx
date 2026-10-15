import Link from 'next/link';
import type { Metadata } from 'next';
import { getStoreSettings } from '@/lib/settings';
import { getSafeProducts } from '@/lib/catalog';
import { formatGhs } from '@/lib/currency';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Layers,
  ShieldCheck,
  Truck,
  Shield,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { WhatsAppIcon, SnapchatIcon } from '@/components/SocialIcons';
import WishlistButton from '@/components/WishlistButton';

export const revalidate = 0;

export const metadata: Metadata = {
  title: { absolute: 'The Likem Perfumery | Authentic Luxury Perfumes in Ghana' },
  description:
    'The Likem Perfumery is an online perfume boutique in Ghana. Shop authentic oriental, designer and rare extrait de parfum fragrances with WhatsApp ordering and delivery across Ghana.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'The Likem Perfumery | Authentic Luxury Perfumes in Ghana',
    description:
      'Authentic luxury fragrances with WhatsApp ordering and delivery across Ghana.',
    url: '/',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, alt: 'Fragrances from The Likem Perfumery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Likem Perfumery | Authentic Luxury Perfumes in Ghana',
    description: 'Authentic luxury fragrances with WhatsApp ordering and delivery across Ghana.',
    images: [DEFAULT_OG_IMAGE],
  },
};

const HERO_IMAGES = [
  '/uploads/perfumes/perfume_db293e4b7fc0.jpeg',
  '/uploads/perfumes/perfume_1eca40c304c2.jpeg',
  '/uploads/perfumes/perfume_66faa191e330.jpeg',
  '/uploads/perfumes/perfume_4ffb9383656c.jpeg',
];

const MOSAIC_FALLBACKS = [
  '/uploads/perfumes/perfume_342bf1c154bb.jpeg',
  '/uploads/perfumes/perfume_5f91ad90c271.jpeg',
  '/uploads/perfumes/perfume_6fc5669d7f3d.jpeg',
  '/uploads/perfumes/perfume_81d67a41557c.jpeg',
  '/uploads/perfumes/perfume_ee4645975528.jpeg',
  '/uploads/perfumes/perfume_ee7a1d8dbb34.jpeg',
  '/uploads/perfumes/perfume_1d6ab477b29b.jpeg',
];

export default async function HomePage() {
  // The homepage is public so that search engines (which carry no cookies) can crawl it.

  let settings = null;
  try {
    settings = await getStoreSettings();
  } catch (e) {
    settings = null;
  }

  const allProducts = await getSafeProducts();
  const publishedProducts = allProducts.filter((p) => p.status === 'PUBLISHED');

  const storeName = settings?.storeName || 'The Likem Perfumery';
  const whatsappNumber = (settings?.whatsappNumber || '233502547133').replace(/[^0-9]/g, '');
  const phoneContact = settings?.phoneContact || '0502547133';
  const snapchatHandle = settings?.snapchatHandle || 'lilitracess';

  const bannerImage = settings?.bannerImageUrl || '/uploads/perfumes/perfume_hero_angham.jpg';

  return (
    <div className="overflow-x-hidden">

      {/* ==================================================================
          HERO — 100% Perfume Background Banner (PerfumePlug Style)
          ================================================================== */}
      <section className="relative w-full min-h-[640px] sm:min-h-[720px] lg:min-h-[800px] flex items-center justify-center overflow-hidden bg-[#050508]">

        {/* ── Full-width Perfume Picture in the Background (100% pic in 100% banner dimensions) ── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={bannerImage}
            alt="Luxury Fragrance Banner"
            className="w-full h-full object-cover object-center transition-all duration-700"
          />
          {/* Subtle luxury overlay - perfume photo is 100% vibrant & clearly visible, not pitch black */}
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/90 via-transparent to-[#050508]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30" />
        </div>

        {/* ── Ambient Glows ── */}
        <div className="hero-glow-top z-[1]" />
        <div className="hero-glow-right z-[1]" />

        {/* ── Texts in Front of the Banner Image ── */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 pt-24 sm:pt-32 w-full text-center flex flex-col items-center">
          <div className="space-y-6 sm:space-y-8 max-w-2xl mx-auto">

            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-[#d4af37]/40 bg-black/50 backdrop-blur-md text-[#f5e4ab] shadow-lg animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
              <span>Haute Parfumerie · {storeName}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
            </div>

            {/* Headline */}
            <div className="space-y-3 sm:space-y-5 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <h1 className="font-serif-luxury leading-[1.06] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
                style={{ fontSize: 'clamp(2.5rem, 7.5vw, 5.25rem)' }}>
                <span className="sr-only">{storeName} — </span>
                The Art of<br />
                <span className="text-shimmer italic font-medium">Extraordinary</span>
                <br />
                <span className="text-white">Fragrance.</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-100/95 leading-relaxed font-light max-w-xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Authentic oriental luxury, iconic designer compositions, and rare extraits de
                parfum — curated for the discerning fragrance lover with nationwide delivery
                across Ghana.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center animate-fadeInUp"
              style={{ animationDelay: '0.2s' }}>
              <Link
                href="/products"
                className="btn-gold-luxury inline-flex items-center justify-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-[11px] font-bold uppercase tracking-wider w-full xs:w-auto shadow-xl"
              >
                <ShoppingBag className="w-4 h-4 stroke-2 flex-shrink-0" />
                <span>Explore Fragrances</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] flex-shrink-0" />
              </Link>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hello! I am admiring your fragrance collection on ${storeName} and would like to place an order.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-luxury inline-flex items-center justify-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-[11px] font-bold uppercase tracking-wider w-full xs:w-auto bg-black/50 backdrop-blur-md shadow-xl text-white hover:text-white"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                <span>Connect on WhatsApp</span>
              </a>
            </div>

            {/* Trust stats & Delivery Notice (Ends the Hero Banner) */}
            <div className="pt-6 sm:pt-10 w-full animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
              <div className="gold-divider mb-6 sm:mb-8 max-w-2xl mx-auto" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-center">
                {[
                  { value: 'Curated', label: 'Originals' },
                  { value: 'GH₵', label: 'Direct Pricing' },
                  { value: '24–48h', label: 'Dispatch' },
                  { value: '5–10 Days', label: 'Delivery Time' },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="font-serif-luxury text-[#d4af37] font-light text-2xl sm:text-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      {stat.value}
                    </div>
                    <div className="text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-slate-200 font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-200 font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                <Truck className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Nationwide delivery is done in 5 to 10 working days across Ghana.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom subtle edge transition */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none z-10" />
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
        <div className="gold-divider-strong opacity-40" />
      </div>

      {/* ==================================================================
          COLLECTION GRID
          ================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10 sm:space-y-14">

        {/* Section header */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto px-2">
          <div className="ornament-line">
            <div className="section-label">The Signature Repertoire</div>
          </div>
          <h2 className="font-serif-luxury font-light text-white leading-tight"
            style={{ fontSize: 'clamp(2rem, 6vw, 3.75rem)' }}>
            Our Curated{' '}
            <span className="gold-gradient-text italic">Collection</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#64748b] font-light leading-relaxed max-w-lg mx-auto">
            Every photograph is taken of our actual stock in Ghana. Browse our authentic
            original fragrances — all available for immediate WhatsApp order or online checkout.
          </p>
        </div>

        {/* Products grid — 2 col mobile, 3 col tablet, 4 col desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-7">
          {publishedProducts.map((p, index) => {
            const primaryImage =
              p.images[0]?.media?.url ||
              MOSAIC_FALLBACKS[index % MOSAIC_FALLBACKS.length];
            const isPublished = true;

            return (
              <div
                key={p.id}
                className="glass-luxury-card perfume-card-shine rounded-xl sm:rounded-2xl
                           overflow-hidden flex flex-col group"
              >
                {/* Image & Wishlist Button */}
                <div className="relative overflow-hidden bg-[#080a10] block" style={{ aspectRatio: '4/5' }}>
                  <Link href={`/products/${p.slug}`} className="block w-full h-full">
                    <img
                      src={primaryImage}
                      alt={p.brand?.name ? `${p.name} perfume by ${p.brand.name}` : `${p.name} perfume`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110
                                 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/80
                                    via-transparent to-transparent opacity-60
                                    group-hover:opacity-30 transition-opacity duration-500" />
                  </Link>

                  {/* Brand badge */}
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 badge-gold
                                   text-[7px] sm:text-[8px] px-2 sm:px-3 py-0.5 pointer-events-none z-10">
                    {p.brand?.name || 'Exclusive'}
                  </span>

                  {/* Jumia-style Love / Wishlist Heart Button */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20">
                    <WishlistButton productId={p.id} productName={p.name} />
                  </div>

                  {!isPublished && (
                    <span className="absolute bottom-2 right-2 text-[7px]
                                     sm:text-[8px] uppercase font-bold tracking-wide px-2 py-0.5
                                     rounded-full bg-[#d4af37]/15 text-[#f5e4ab]
                                     border border-[#d4af37]/25 backdrop-blur-sm z-10">
                      Soon
                    </span>
                  )}

                  {/* Quick view on hover (desktop only) */}
                  <Link
                    href={`/products/${p.slug}`}
                    className="hidden sm:flex absolute inset-0 items-center justify-center
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <span className="bg-[#050508]/80 backdrop-blur-sm text-[#f5e4ab]
                                     text-[10px] uppercase tracking-[0.2em] font-bold
                                     px-4 py-2 rounded-full border border-[#d4af37]/30">
                      View Details
                    </span>
                  </Link>
                </div>

                {/* Info */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
                  <div className="space-y-1">
                    <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em]
                                    sm:tracking-[0.2em] text-[#475569]">
                      {p.gender || 'Unisex'} · {p.size || '100ml'}
                    </div>
                    <Link href={`/products/${p.slug}`}>
                      <h3 className="font-serif-luxury text-base sm:text-lg lg:text-xl
                                     text-white group-hover:text-[#f5e4ab] transition-colors
                                     duration-300 leading-tight line-clamp-1">
                        {p.name}
                      </h3>
                    </Link>
                    {/* Description — hidden on mobile to save space */}
                    <p className="hidden sm:block text-[11px] text-[#475569] line-clamp-2
                                  leading-relaxed font-light">
                      {p.shortDescription ||
                        `${p.concentration || 'Eau De Parfum'} · Refined sillage & longevity.`}
                    </p>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="gold-divider" />
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em]
                                       text-[#475569]">
                        Price
                      </span>
                      <span className="font-black text-[#d4af37] text-sm sm:text-base">
                        {isPublished ? formatGhs(p.priceInGhs) : 'Inquire'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      <Link
                        href={`/products/${p.slug}`}
                        aria-label={`View details for ${p.name}`}
                        className="text-center py-2 sm:py-2.5 px-1 sm:px-2
                                   bg-[#0e111a] hover:bg-[#161b28] text-[#e2e8f0]
                                   text-[9px] sm:text-[10px] font-semibold tracking-wider
                                   rounded-lg sm:rounded-xl transition-all
                                   border border-[#d4af37]/15 hover:border-[#d4af37]/35"
                      >
                        Details
                      </Link>
                      <a
                        aria-label={`${isPublished ? 'Order' : 'Ask about'} ${p.name} on WhatsApp`}
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                          isPublished
                            ? `Hello! I would like to order *${p.name}* from ${storeName} priced at ${formatGhs(p.priceInGhs)}. Please confirm availability and delivery.`
                            : `Hello! I would like to inquire about *${p.name}* on ${storeName}. Please share price and availability.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5
                                   px-1 sm:px-2 bg-[#25D366]/10 hover:bg-[#25D366]/20
                                   text-[#25D366] text-[9px] sm:text-[10px] font-bold
                                   rounded-lg sm:rounded-xl border border-[#25D366]/25
                                   hover:border-[#25D366]/50 transition-all"
                      >
                        <WhatsAppIcon className="w-3 h-3 flex-shrink-0" />
                        <span>{isPublished ? 'Order' : 'Ask'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all CTA — generalized without hardcoded count */}
        <div className="text-center pt-2">
          <Link
            href="/products"
            className="btn-gold-luxury inline-flex items-center gap-2.5 sm:gap-3
                       px-7 sm:px-10 py-3.5 sm:py-4 rounded-full text-[11px]"
          >
            <Layers className="w-4 h-4 flex-shrink-0" />
            <span>View Complete Collection</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] flex-shrink-0" />
          </Link>
        </div>
      </section>

      {/* ==================================================================
          PHILOSOPHY / PROMISE SECTION
          ================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="glass-luxury rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#d4af37]/04 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d4af37]/03 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4 mb-8 sm:mb-14">
            <div className="ornament-line">
              <div className="section-label">Uncompromising Standards</div>
            </div>
            <h2 className="font-serif-luxury text-white font-light leading-snug"
              style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}>
              Direct Door-to-Door Delivery{' '}
              <span className="gold-gradient-warm italic">Across Ghana</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] font-light leading-relaxed">
              We operate as an independent digital perfume house, bypassing brick-and-mortar
              markups to bring you pristine originals at honest prices.
            </p>
          </div>

          {/* Feature cards — 1 col mobile, 3 col md+ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                roman: 'I',
                color: '#d4af37',
                title: 'Genuine Originals',
                desc: 'Every photograph displayed on this website is taken of our actual physical bottles. What you see is precisely what arrives in your hands.',
              },
              {
                roman: 'II',
                color: '#25D366',
                title: 'WhatsApp & Snapchat Concierge',
                desc: 'Connect directly via WhatsApp or Snapchat to confirm scent notes, batch details, and delivery timing with our curator.',
              },
              {
                roman: 'III',
                color: '#60a5fa',
                title: 'Nationwide Dispatch',
                desc: 'Same-day dispatch in Accra & Tema. Secured parcels to Kumasi, Takoradi, Tamale, and all regions within 24–48 hours.',
              },
            ].map((feature) => (
              <div
                key={feature.roman}
                className="relative p-5 sm:p-7 lg:p-8 rounded-xl sm:rounded-2xl glass-luxury-card
                           transition-all duration-500 group"
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center
                             justify-center font-serif-luxury text-lg sm:text-xl font-light mb-4 sm:mb-5"
                  style={{
                    background: `${feature.color}15`,
                    border: `1px solid ${feature.color}30`,
                    color: feature.color,
                  }}
                >
                  {feature.roman}
                </div>
                <h3 className="font-serif-luxury text-xl sm:text-2xl mb-2 sm:mb-3 font-normal"
                    style={{ color: 'var(--text-primary, #0f172a)' }}>
                  {feature.title}
                </h3>
                <p className="text-xs font-normal leading-relaxed"
                   style={{ color: 'var(--text-secondary, #475569)' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          SOCIAL MEDIA & DIRECT COMMUNICATION CTA
          ================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-16 sm:pb-24">
        <div className="glass-luxury rounded-2xl sm:rounded-3xl p-8 sm:p-14 lg:p-20
                        text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 70%)' }}
          />

          <div className="relative z-10 space-y-6 sm:space-y-8 max-w-xl mx-auto">
            <div className="ornament-line">
              <div className="section-label">Follow Our Social Media Handles</div>
            </div>
            <h2 className="font-serif-luxury text-white font-light leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 7vw, 3.5rem)' }}>
              WhatsApp · Snapchat · <span className="gold-gradient-text italic">SMS or Call</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-light leading-relaxed">
              Follow our social media handles on WhatsApp and Snapchat, or send an SMS or Call via{' '}
              <span className="text-[#f5e4ab] font-medium">{phoneContact}</span>. We trade actively
              on both Snapchat and WhatsApp with prompt door-to-door courier dispatch across Ghana.
            </p>

            {/* Social & Contact Buttons with official icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">

              {/* 1. Official WhatsApp */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hello! I am contacting ${storeName} to view your fragrances and place an order.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5
                           px-6 py-4 rounded-2xl font-extrabold text-[11px] uppercase
                           tracking-wider transition-all shadow-lg hover:brightness-110"
                style={{
                  background: '#25D366',
                  color: '#000',
                  boxShadow: '0 8px 24px rgba(37, 211, 102, 0.25)',
                }}
              >
                <WhatsAppIcon className="w-5 h-5 flex-shrink-0" />
                <span>Connect on WhatsApp</span>
              </a>

              {/* 2. Official Snapchat */}
              {snapchatHandle && (
                <a
                  href={`https://snapchat.com/add/${snapchatHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5
                             px-6 py-4 rounded-2xl font-extrabold text-[11px] uppercase
                             tracking-wider transition-all shadow-lg hover:brightness-105"
                  style={{
                    background: '#FFFC00',
                    color: '#000',
                    boxShadow: '0 8px 24px rgba(255, 252, 0, 0.20)',
                  }}
                >
                  <SnapchatIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Connect on Snapchat</span>
                </a>
              )}

              {/* 3. Call Via Phone */}
              <a
                href={`tel:${phoneContact}`}
                className="w-full inline-flex items-center justify-center gap-2.5
                           px-6 py-3.5 rounded-2xl font-bold text-[11px] uppercase
                           tracking-wider transition-all btn-outline-luxury hover:text-[#d4af37]"
              >
                <Phone className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                <span>Call: {phoneContact}</span>
              </a>

              {/* 4. Send SMS */}
              <a
                href={`sms:${phoneContact}?body=${encodeURIComponent(
                  `Hello! I would like to inquire about fragrances at ${storeName}.`
                )}`}
                className="w-full inline-flex items-center justify-center gap-2.5
                           px-6 py-3.5 rounded-2xl font-bold text-[11px] uppercase
                           tracking-wider transition-all btn-outline-luxury hover:text-[#f5e4ab]"
              >
                <MessageSquare className="w-4 h-4 text-[#f5e4ab] flex-shrink-0" />
                <span>Send SMS: {phoneContact}</span>
              </a>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
