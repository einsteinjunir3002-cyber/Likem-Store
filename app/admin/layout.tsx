import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import {
  LayoutDashboard,
  Package,
  CheckCircle,
  ShoppingBag,
  Layers,
  Settings,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  // If viewing admin route without cookie, let the login page handle itself
  return (
    <div className="min-h-screen bg-[#090a0e] text-[#f8fafc] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 bg-[#11131a] border-r border-[#1e2330] flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-[#1e2330] flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2 font-black text-sm tracking-wider uppercase">
              <span className="text-[#d4af37]">◆</span> LIKEM STUDIO ADMIN
            </Link>
          </div>

          <nav className="p-4 space-y-1 text-xs font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[#cbd5e1] hover:bg-[#181c26] hover:text-[#d4af37] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard & Setup</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[#cbd5e1] hover:bg-[#181c26] hover:text-[#d4af37] transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Products & Completion</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[#cbd5e1] hover:bg-[#181c26] hover:text-[#d4af37] transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders & WhatsApp Sales</span>
            </Link>

            <Link
              href="/admin/media"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[#cbd5e1] hover:bg-[#181c26] hover:text-[#d4af37] transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Media Library (11 photos)</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[#cbd5e1] hover:bg-[#181c26] hover:text-[#d4af37] transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Store & Delivery Settings</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#1e2330] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#181c26] hover:bg-[#202533] text-[11px] text-[#cbd5e1]"
          >
            <span>View Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
