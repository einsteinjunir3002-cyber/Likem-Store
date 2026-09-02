import React from 'react';
import Link from 'next/link';
import { MessageCircle, ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';

interface FooterProps {
  storeName?: string;
  phoneContact?: string;
  whatsappNumber?: string;
  snapchatHandle?: string;
}

export default function Footer({
  storeName = 'LIKEM Fragrances',
  phoneContact = '0502547133',
  whatsappNumber = '+233502547133',
  snapchatHandle = 'lilitracess',
}: FooterProps) {
  return (
    <footer className="bg-[#050608] border-t border-[#d4af37]/20 text-[#94a3b8] text-xs pt-16 pb-24 md:pb-14 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <span className="font-serif-luxury text-2xl tracking-[0.15em] text-white uppercase flex items-center gap-2">
              <span className="text-[#d4af37] text-lg">✦</span> {storeName}
            </span>
            <p className="text-[11px] text-[#717b94] leading-relaxed font-light">
              Haute parfumerie boutique operating exclusively online in Ghana. Every fragrance is an authentic luxury composition delivered with utmost discretion across Accra, Kumasi, and nationwide.
            </p>
            <div className="text-[11px] text-[#f5e4ab] bg-[#d4af37]/10 border border-[#d4af37]/25 p-3 rounded-xl">
              <div className="font-semibold uppercase tracking-wider text-[10px]">Direct Delivery Studio:</div>
              <div className="text-[#cbd5e1] mt-0.5 font-light">
                We operate as an online studio with direct door-to-door courier dispatch. No physical walk-in shop.
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-bold">The Collection</h4>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <Link href="/products" className="hover:text-[#f5e4ab] transition-colors">
                  All Perfumes &amp; Extraits
                </Link>
              </li>
              <li>
                <Link href="/delivery-faq" className="hover:text-[#f5e4ab] transition-colors">
                  Ghana Delivery Rates &amp; Areas
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#f5e4ab] transition-colors">
                  Bespoke Scent Inquiry
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#f5e4ab] transition-colors">
                  Shopping Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Delivery & Ordering Model */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-bold">Dispatch Operations</h4>
            <div className="space-y-3 text-xs font-light text-[#cbd5e1]">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Greater Accra &amp; Tema: Same-day or next-day courier</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Kumasi &amp; Other Regions: 24 to 48 hours secured parcel</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Payment confirmed via MoMo or arranged on WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-bold">Concierge Channels</h4>
            <div className="space-y-2.5 text-xs font-light">
              <p className="flex items-center gap-2">
                <span className="text-[#94a3b8]">Phone:</span>
                <a href={`tel:${phoneContact}`} className="text-white hover:text-[#d4af37] font-medium">
                  {phoneContact}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#94a3b8]">WhatsApp:</span>
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline font-medium"
                >
                  {whatsappNumber}
                </a>
              </p>
              {snapchatHandle && (
                <p className="flex items-center gap-2">
                  <span className="text-[#94a3b8]">Snapchat:</span>
                  <a
                    href={`https://snapchat.com/add/${snapchatHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFFC00] hover:underline font-medium"
                  >
                    @{snapchatHandle}
                  </a>
                </p>
              )}
            </div>

            <div className="pt-3">
              <Link
                href="/admin/login"
                className="text-[10px] uppercase tracking-widest text-[#475569] hover:text-[#d4af37] transition-colors"
              >
                Owner Portal &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[#d4af37]/15 flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#64748b]">
          <div>
            &copy; {new Date().getFullYear()} {storeName}. All rights reserved. Prices strictly in Ghana Cedis (GH₵).
          </div>
          <div className="mt-2 sm:mt-0 flex gap-4">
            <Link href="/delivery-faq" className="hover:text-white">
              Terms &amp; Dispatch Guide
            </Link>
            <span>&middot;</span>
            <Link href="/contact" className="hover:text-white">
              Direct Inquiries
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
