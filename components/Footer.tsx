import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Clock, Phone, MapPin, MessageSquare } from 'lucide-react';
import { WhatsAppIcon, SnapchatIcon } from '@/components/SocialIcons';

interface FooterProps {
  storeName?: string;
  phoneContact?: string;
  whatsappNumber?: string;
  snapchatHandle?: string;
}

export default function Footer({
  storeName = 'The Likem Perfumery',
  phoneContact = '0502547133',
  whatsappNumber = '+233502547133',
  snapchatHandle = 'lilitracess',
}: FooterProps) {
  const waNum = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer
      className="relative overflow-hidden text-xs pt-12 sm:pt-20 pb-24 md:pb-16"
      style={{
        background: 'linear-gradient(180deg, #050508 0%, #04040a 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.14)',
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">

          {/* ── Brand Column ── */}
          <div className="md:col-span-4 space-y-5">
            {/* Logo */}
            <Link href="/" className="flex flex-col group w-fit">
              <span className="font-serif-luxury text-2xl tracking-[0.16em] text-white uppercase flex items-center gap-2.5 group-hover:text-[#f5e4ab] transition-colors">
                <span className="text-[#d4af37] text-lg">✦</span>
                {storeName}
              </span>
              <span className="text-[8px] tracking-[0.42em] text-[#d4af37]/60 uppercase font-semibold pl-7">
                Parfums · Accra · Ghana
              </span>
            </Link>

            <p className="text-[11px] text-[#475569] leading-relaxed font-light max-w-xs">
              Haute parfumerie boutique operating exclusively online in Ghana.
              Every fragrance is an authentic luxury composition delivered with
              utmost care across Accra, Kumasi, and nationwide.
            </p>

            <div
              className="p-4 rounded-2xl text-[11px] space-y-1"
              style={{
                background: 'rgba(212,175,55,0.06)',
                border: '1px solid rgba(212,175,55,0.18)',
              }}
            >
              <div className="flex items-center gap-2 text-[#d4af37] font-bold uppercase tracking-wider text-[9px] mb-2">
                <MapPin className="w-3 h-3" />
                Online Delivery Studio
              </div>
              <p className="text-[#64748b] font-light leading-relaxed">
                We trade directly via WhatsApp and Snapchat with prompt courier
                dispatch. No physical walk-in shop.
              </p>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="section-label">Shop</h4>
            <ul className="space-y-3">
              {[
                { href: '/products', label: 'All Fragrances' },
                { href: '/products', label: 'New Arrivals' },
                { href: '/cart', label: 'Shopping Bag' },
                { href: '/search', label: 'Search Perfumes' },
              ].map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-[#64748b] hover:text-[#f5e4ab] transition-colors font-light text-[11px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Info Links ── */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="section-label">Info</h4>
            <ul className="space-y-3">
              {[
                { href: '/delivery-faq', label: 'Delivery & FAQ' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/login', label: 'Sign In' },
                { href: '/register', label: 'Create Account' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#64748b] hover:text-[#f5e4ab] transition-colors font-light text-[11px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Dispatch Operations & Social Concierge ── */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="section-label">Dispatch Operations</h4>
            <div className="space-y-4">
              {[
                {
                  icon: Truck,
                  title: 'Accra & Tema',
                  desc: 'Same-day or next-day courier dispatch',
                },
                {
                  icon: Clock,
                  title: 'Kumasi & Regions',
                  desc: '24–48 hours secured parcel delivery',
                },
                {
                  icon: ShieldCheck,
                  title: 'Payment & Ordering',
                  desc: 'MoMo, Card, or arranged via WhatsApp & Snapchat',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(212,175,55,0.10)', border: '1px solid rgba(212,175,55,0.20)' }}
                  >
                    <item.icon className="w-3.5 h-3.5 text-[#d4af37]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#cbd5e1] tracking-wide">{item.title}</div>
                    <div className="text-[#475569] font-light leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social media & direct channels with official icons */}
            <div className="pt-4 space-y-2.5">
              <h4 className="section-label">Follow Our Handles & Concierge</h4>
              <div className="flex flex-col gap-2.5">

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${waNum}?text=${encodeURIComponent(
                    `Hello! I would like to contact ${storeName}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] hover:brightness-125 transition-all"
                  style={{ color: '#25D366' }}
                >
                  <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
                  <span>Connect on WhatsApp</span>
                </a>

                {/* Snapchat */}
                {snapchatHandle && (
                  <a
                    href={`https://snapchat.com/add/${snapchatHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[11px] hover:brightness-125 transition-all"
                    style={{ color: '#FFFC00' }}
                  >
                    <SnapchatIcon className="w-4 h-4 flex-shrink-0" />
                    <span>Connect on Snapchat (@{snapchatHandle})</span>
                  </a>
                )}

                {/* Call */}
                <a
                  href={`tel:${phoneContact}`}
                  className="flex items-center gap-2 text-[11px] text-[#94a3b8] hover:text-[#d4af37] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                  <span>Call: {phoneContact}</span>
                </a>

                {/* SMS */}
                <a
                  href={`sms:${phoneContact}?body=${encodeURIComponent(`Hello ${storeName}!`)}`}
                  className="flex items-center gap-2 text-[11px] text-[#94a3b8] hover:text-[#f5e4ab] transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#f5e4ab] flex-shrink-0" />
                  <span>Send SMS: {phoneContact}</span>
                </a>

              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="gold-divider mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-[#475569]">
          <div>
            © {new Date().getFullYear()} {storeName}. All rights reserved.
            Prices in Ghana Cedis (GH₵) only.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/delivery-faq" className="hover:text-[#94a3b8] transition-colors">
              Terms & Dispatch Guide
            </Link>
            <span className="text-[#1a202c]">·</span>
            <Link href="/contact" className="hover:text-[#94a3b8] transition-colors">
              Direct Inquiries
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
