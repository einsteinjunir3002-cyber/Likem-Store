'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShoppingBag, Home, Package } from 'lucide-react';
import { WhatsAppIcon } from '@/components/SocialIcons';

interface StorefrontChromeProps {
  children: React.ReactNode;
  storeName?: string;
  phoneContact?: string;
  whatsappNumber?: string;
  snapchatHandle?: string;
}

export default function StorefrontChrome({
  children,
  storeName,
  phoneContact,
  whatsappNumber,
  snapchatHandle,
}: StorefrontChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  const waNum = (whatsappNumber || '233502547133').replace(/[^0-9]/g, '');

  if (isAdmin) {
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar
        storeName={storeName}
        whatsappNumber={whatsappNumber}
        snapchatHandle={snapchatHandle}
      />

      {/* Main content — add bottom padding on mobile for the sticky bar */}
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>

      <Footer
        storeName={storeName}
        phoneContact={phoneContact}
        whatsappNumber={whatsappNumber}
        snapchatHandle={snapchatHandle}
      />

      {/* ============================================================
          MOBILE BOTTOM NAV BAR — fixed bottom, only on mobile
          ============================================================ */}
      <div
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center"
        style={{
          background: 'rgba(5, 5, 8, 0.97)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(212, 175, 55, 0.18)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Home */}
        <Link
          href="/"
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[9px]
                      uppercase tracking-wider font-semibold transition-colors ${
            pathname === '/' ? 'text-[#d4af37]' : 'text-[#64748b]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        {/* Collection */}
        <Link
          href="/products"
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[9px]
                      uppercase tracking-wider font-semibold transition-colors ${
            pathname?.startsWith('/products') ? 'text-[#d4af37]' : 'text-[#64748b]'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>Shop</span>
        </Link>

        {/* WhatsApp — centre, official green pill */}
        <a
          href={`https://wa.me/${waNum}?text=${encodeURIComponent(
            `Hello! I am viewing fragrances on ${storeName || 'The Likem Perfumery'} and would like to place an order.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 mx-2 flex flex-col items-center justify-center gap-0.5
                     px-4 py-2 rounded-full font-extrabold text-[9px] uppercase tracking-wider
                     shadow-lg transition-all"
          style={{
            background: '#25D366',
            color: '#000',
            boxShadow: '0 4px 16px rgba(37, 211, 102, 0.35)',
          }}
        >
          <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
          <span>WhatsApp</span>
        </a>

        {/* Cart */}
        <Link
          href="/cart"
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[9px]
                      uppercase tracking-wider font-semibold transition-colors ${
            pathname === '/cart' ? 'text-[#d4af37]' : 'text-[#64748b]'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Cart</span>
        </Link>

        {/* Contact */}
        <Link
          href="/contact"
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[9px]
                      uppercase tracking-wider font-semibold transition-colors ${
            pathname === '/contact' ? 'text-[#d4af37]' : 'text-[#64748b]'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          <span>Contact</span>
        </Link>
      </div>
    </>
  );
}
