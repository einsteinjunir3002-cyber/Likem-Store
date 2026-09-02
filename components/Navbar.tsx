'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageCircle, Menu, X, Search, Sparkles, User } from 'lucide-react';
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#07080b]/90 backdrop-blur-xl border-b border-[#d4af37]/20 shadow-2xl">
      {/* Top Haute Parfumerie micro-banner */}
      <div className="bg-gradient-to-r from-[#07080b] via-[#1a160b] to-[#07080b] text-[11px] text-[#f5e4ab] py-2 px-4 text-center tracking-[0.2em] uppercase font-medium border-b border-[#d4af37]/15">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          <span>Haute Parfumerie • Handpicked Originals Delivered Across Ghana</span>
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex flex-col group">
              <span className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.18em] text-white font-medium uppercase transition-colors group-hover:text-[#f5e4ab] flex items-center gap-2">
                <span className="text-[#d4af37] text-xl">✦</span> {storeName}
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#d4af37] uppercase font-semibold pl-6">
                Parfums &middot; Accra
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar with Gold Border Highlight */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search perfumes, houses (Lattafa, Afnan, Zara)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0e111a]/80 border border-[#d4af37]/25 rounded-full py-2.5 pl-5 pr-11 text-xs tracking-wider text-white placeholder-[#717b94] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all shadow-inner"
            />
            <button type="submit" className="absolute right-4 text-[#d4af37] hover:text-[#f5e4ab] transition-colors" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-xs uppercase tracking-[0.15em] text-[#cbd5e1] hover:text-[#d4af37] font-semibold transition-colors"
            >
              Collection
            </Link>
            <Link
              href="/delivery-faq"
              className="text-xs uppercase tracking-[0.15em] text-[#cbd5e1] hover:text-[#d4af37] font-semibold transition-colors"
            >
              Delivery
            </Link>
            <Link
              href="/contact"
              className="text-xs uppercase tracking-[0.15em] text-[#cbd5e1] hover:text-[#d4af37] font-semibold transition-colors"
            >
              Contact
            </Link>

            {/* Account / Sign In Link */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-[#f5e4ab] hover:text-white font-semibold transition-colors px-3 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#131622]/60 hover:bg-[#131622]"
            >
              <User className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Sign In</span>
            </Link>

            {/* Direct WhatsApp CTA */}
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Hello! I am viewing your luxury perfume collection on your website and would like to place an order.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/40 px-3.5 py-2 rounded-full text-xs font-bold tracking-wider transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-[#25D366]/20" />
              <span>WhatsApp</span>
            </a>

            {/* Luxury Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2.5 text-[#f8fafc] hover:text-[#d4af37] transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-[#e0c463] to-[#d4af37] text-[#07080b] text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/login"
              className="p-2 text-[#f5e4ab] hover:text-white"
              aria-label="Account Login"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              href="/cart"
              className="relative p-2 text-[#f8fafc] hover:text-[#d4af37]"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d4af37] text-[#07080b] text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#94a3b8] hover:text-white"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search perfumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0e111a] border border-[#d4af37]/25 rounded-lg py-2.5 pl-4 pr-10 text-xs text-white placeholder-[#717b94] focus:outline-none focus:border-[#d4af37]"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-[#d4af37]">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0f17] border-b border-[#d4af37]/20 px-6 pt-3 pb-8 space-y-5">
          <div className="flex flex-col space-y-4 pt-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="font-serif-luxury text-lg text-[#f5e4ab] tracking-wider py-2 border-b border-[#1e2330] flex items-center gap-2"
            >
              <User className="w-4 h-4 text-[#d4af37]" />
              <span>Sign In / Owner Portal</span>
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="font-serif-luxury text-lg text-[#f8fafc] tracking-wider py-2 border-b border-[#1e2330]"
            >
              Create Customer Account
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="font-serif-luxury text-lg text-[#f8fafc] tracking-wider py-2 border-b border-[#1e2330]"
            >
              The Perfume Collection
            </Link>
            <Link
              href="/delivery-faq"
              onClick={() => setMobileMenuOpen(false)}
              className="font-serif-luxury text-lg text-[#f8fafc] tracking-wider py-2 border-b border-[#1e2330]"
            >
              Ghana Delivery &amp; FAQ
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="font-serif-luxury text-lg text-[#f8fafc] tracking-wider py-2 border-b border-[#1e2330]"
            >
              Contact Studio
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="font-serif-luxury text-lg text-[#d4af37] tracking-wider py-2 border-b border-[#1e2330] flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              <span className="text-xs bg-[#d4af37]/20 px-2 py-0.5 rounded">{totalItems} items</span>
            </Link>
          </div>

          <div className="pt-2 space-y-3">
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Hello! I saw your perfumes and would like to order.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-black font-bold py-3 rounded-xl text-xs tracking-wider uppercase"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp ({whatsappNumber})
            </a>
            {snapchatHandle && (
              <a
                href={`https://snapchat.com/add/${snapchatHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#FFFC00]/15 text-[#FFFC00] border border-[#FFFC00]/30 font-semibold py-2.5 rounded-xl text-xs"
              >
                Snapchat: @{snapchatHandle}
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
