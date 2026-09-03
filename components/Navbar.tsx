'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageCircle, Menu, X, Search, Sparkles, User, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface NavbarProps {
  storeName?: string;
  whatsappNumber?: string;
  snapchatHandle?: string;
}

export default function Navbar({
  storeName = 'LIKEM Fragrances',
  whatsappNumber = '233502547133',
  snapchatHandle = 'lilitracess',
}: NavbarProps) {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const waNum = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050508]/95 backdrop-blur-2xl shadow-2xl shadow-black/50 border-b border-[#d4af37]/20'
          : 'bg-[#050508]/80 backdrop-blur-xl border-b border-[#d4af37]/10'
      }`}
    >
      {/* Announcement Banner */}
      <div
        className="text-[9px] sm:text-[10px] text-[#f5e4ab] py-1.5 sm:py-2 px-4 text-center
                   tracking-[0.18em] sm:tracking-[0.22em] uppercase font-semibold
                   border-b border-[#d4af37]/10"
        style={{
          background: 'linear-gradient(90deg, #050508 0%, #130f04 40%, #050508 80%, #0d0a00 100%)',
        }}
      >
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-2.5 h-2.5 text-[#d4af37] flex-shrink-0" />
          <span className="hidden sm:inline">
            <span className="text-shimmer font-bold">Haute Parfumerie</span>
            <span className="text-[#64748b] mx-1.5">·</span>
            <span>Handpicked Originals Delivered Across Ghana</span>
          </span>
          <span className="sm:hidden text-shimmer font-bold">Luxury Fragrances · Ghana</span>
          <Sparkles className="w-2.5 h-2.5 text-[#d4af37] flex-shrink-0" />
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-[72px]">

          {/* ── Brand Logo ── */}
          <Link href="/" className="flex flex-col group flex-shrink-0 min-w-0">
            <span className="font-serif-luxury tracking-[0.12em] sm:tracking-[0.16em] text-white
                             font-medium uppercase transition-colors group-hover:text-[#f5e4ab]
                             flex items-center gap-1.5 sm:gap-2.5 leading-none"
              style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)' }}>
              <span
                className="text-[#d4af37] transition-transform group-hover:rotate-45 duration-500
                           flex-shrink-0"
                style={{ display: 'inline-block', fontSize: '0.9em' }}
              >
                ✦
              </span>
              <span className="truncate">{storeName}</span>
            </span>
            <span className="text-[7px] sm:text-[8px] tracking-[0.35em] sm:tracking-[0.42em]
                             text-[#d4af37]/70 uppercase font-semibold pl-5 sm:pl-7 -mt-0.5">
              Parfums · Accra
            </span>
          </Link>

          {/* ── Desktop Search ── */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-sm mx-8 relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search fragrances, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full input-luxury rounded-full py-2.5 pl-5 pr-11 text-xs tracking-wide placeholder:text-[#475569]"
                style={{ fontSize: '12px' }}
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37] hover:text-[#f5e4ab] transition-colors"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* ── Desktop Nav Actions ── */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/products"
              className="text-[11px] uppercase tracking-[0.18em] text-[#94a3b8] hover:text-[#d4af37] font-semibold transition-colors duration-300"
            >
              Collection
            </Link>
            <Link
              href="/delivery-faq"
              className="text-[11px] uppercase tracking-[0.18em] text-[#94a3b8] hover:text-[#d4af37] font-semibold transition-colors duration-300"
            >
              Delivery
            </Link>
            <Link
              href="/contact"
              className="text-[11px] uppercase tracking-[0.18em] text-[#94a3b8] hover:text-[#d4af37] font-semibold transition-colors duration-300"
            >
              Contact
            </Link>

            {/* Divider */}
            <div className="h-5 w-px bg-[#d4af37]/20" />

            {/* Sign In */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-[#f5e4ab] hover:text-white font-semibold transition-all px-3.5 py-2 rounded-full border border-[#d4af37]/25 bg-[#0e111a]/60 hover:bg-[#0e111a] hover:border-[#d4af37]/50"
            >
              <User className="w-3 h-3 text-[#d4af37]" />
              <span>Sign In</span>
            </Link>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${waNum}?text=${encodeURIComponent(
                'Hello! I am viewing your luxury perfume collection and would like to place an order.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold tracking-wider transition-all"
              style={{
                background: 'rgba(37,211,102,0.10)',
                border: '1px solid rgba(37,211,102,0.35)',
                color: '#25D366',
              }}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 text-[#94a3b8] hover:text-[#d4af37] transition-colors duration-300 group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5] group-hover:scale-110 transition-transform duration-300" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 text-[#050508] text-[9px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #e8c97a, #d4af37)' }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* ── Mobile Icons ── */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/login"
              className="p-2 text-[#94a3b8] hover:text-[#d4af37]"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              href="/cart"
              className="relative p-2 text-[#94a3b8] hover:text-[#d4af37]"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-[#050508] text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center"
                  style={{ background: '#d4af37' }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#94a3b8] hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Search ── */}
        <div className="pb-2 sm:pb-3 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search perfumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full input-luxury rounded-xl py-2 pl-4 pr-10 text-[11px]"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37]">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-b border-[#d4af37]/15 px-6 pt-4 pb-8 space-y-4"
          style={{ background: 'rgba(5, 5, 8, 0.98)', backdropFilter: 'blur(24px)' }}
        >
          <nav className="flex flex-col space-y-1">
            {[
              { href: '/products', label: 'The Perfume Collection' },
              { href: '/delivery-faq', label: 'Ghana Delivery & FAQ' },
              { href: '/contact', label: 'Contact Studio' },
              { href: '/cart', label: `Shopping Cart (${totalItems})`, gold: true },
              { href: '/login', label: 'Sign In / Owner Portal', accent: true },
              { href: '/register', label: 'Create Account' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-serif-luxury text-lg py-3 border-b border-[#0e111a] flex items-center justify-between transition-colors ${
                  item.gold ? 'text-[#d4af37]' : item.accent ? 'text-[#f5e4ab]' : 'text-[#cbd5e1] hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
              </Link>
            ))}
          </nav>

          <div className="pt-4 space-y-3">
            <a
              href={`https://wa.me/${waNum}?text=${encodeURIComponent('Hello! I saw your perfumes and would like to order.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider"
              style={{ background: '#25D366', color: '#000' }}
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
            {snapchatHandle && (
              <a
                href={`https://snapchat.com/add/${snapchatHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 font-semibold py-3 rounded-2xl text-xs"
                style={{
                  background: 'rgba(255,252,0,0.10)',
                  border: '1px solid rgba(255,252,0,0.25)',
                  color: '#FFFC00',
                }}
              >
                📸 Snapchat: @{snapchatHandle}
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
