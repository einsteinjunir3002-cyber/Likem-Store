import React from 'react';
import Link from 'next/link';
import { getCurrentAdmin } from '@/lib/auth';
import { getStoreSettings } from '@/lib/settings';
import { isLightColor } from '@/lib/theme';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | The Likem Perfumery',
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  const settings = await getStoreSettings();
  const isLight = isLightColor(settings.backgroundColor);
  const primaryColor = settings.primaryColor || '#0284c7';

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${
        isLight ? 'text-slate-800' : 'text-[#f8fafc]'
      }`}
      style={{
        backgroundColor: settings.backgroundColor || '#f0f8ff',
      }}
    >
      {/* ── Mobile Sticky Top Nav (phones only) ── */}
      <header
        className={`md:hidden sticky top-0 z-40 backdrop-blur-md border-b shadow-sm shrink-0 transition-colors ${
          isLight
            ? 'bg-white/90 border-slate-200/90 text-slate-800'
            : 'bg-[#11131a]/95 border-[#1e2330] text-[#f8fafc]'
        }`}
      >
        {/* Brand bar */}
        <div
          className={`px-4 py-2.5 flex items-center justify-between border-b ${
            isLight ? 'border-slate-200/70' : 'border-[#1e2330]/80'
          }`}
        >
          <Link href="/admin" className="flex items-center gap-2 font-black text-xs tracking-wider uppercase">
            <span style={{ color: primaryColor }}>◆</span> LIKEM ADMIN
          </Link>
          <Link
            href="/"
            target="_blank"
            className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border transition-colors ${
              isLight
                ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                : 'bg-[#181c26] text-[#cbd5e1] border-transparent hover:bg-[#202533]'
            }`}
          >
            <ExternalLink className="w-3 h-3" style={{ color: primaryColor }} />
            <span>Store</span>
          </Link>
        </div>

        {/* Horizontal scrollable nav links */}
        <nav className="flex items-center overflow-x-auto gap-1 px-2 py-2 scrollbar-none">
          {[
            { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/admin/products', label: 'Products', icon: Package },
            { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
            { href: '/admin/media', label: 'Media', icon: ImageIcon },
            { href: '/admin/settings', label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors shrink-0 text-[9px] font-bold uppercase tracking-wide ${
                  isLight
                    ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    : 'text-[#94a3b8] hover:bg-[#181c26] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {/* ── Desktop Sidebar (md+ screens) ── */}
      <aside
        className={`hidden md:flex md:w-64 border-r flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen backdrop-blur-md transition-colors ${
          isLight
            ? 'bg-white/90 border-slate-200/90 text-slate-800 shadow-sm'
            : 'bg-[#11131a] border-[#1e2330] text-[#cbd5e1]'
        }`}
      >
        <div>
          <div
            className={`p-6 border-b flex items-center justify-between ${
              isLight ? 'border-slate-200/80' : 'border-[#1e2330]'
            }`}
          >
            <Link href="/admin" className="flex items-center gap-2 font-black text-sm tracking-wider uppercase">
              <span style={{ color: primaryColor }}>◆</span> LIKEM STUDIO ADMIN
            </Link>
          </div>

          <nav className="p-4 space-y-1 text-xs font-semibold">
            {[
              { href: '/admin', label: 'Dashboard & Setup', icon: LayoutDashboard },
              { href: '/admin/products', label: 'Products & Completion', icon: Package },
              { href: '/admin/orders', label: 'Orders & WhatsApp Sales', icon: ShoppingBag },
              { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
              { href: '/admin/settings', label: 'Store & Appearance Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                    isLight
                      ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      : 'text-[#cbd5e1] hover:bg-[#181c26] hover:text-[#d4af37]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t space-y-2 ${isLight ? 'border-slate-200/80' : 'border-[#1e2330]'}`}>
          <Link
            href="/"
            target="_blank"
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-[11px] border transition-colors ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                : 'bg-[#181c26] border-transparent text-[#cbd5e1] hover:bg-[#202533]'
            }`}
          >
            <span>View Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" style={{ color: primaryColor }} />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
