import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatGhs } from '@/lib/currency';
import { Plus, Eye, AlertCircle, CheckCircle } from 'lucide-react';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      brand: true,
      images: { include: { media: true }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e2330] pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Product Catalogue Management</h1>
          <p className="text-xs text-[#94a3b8]">
            Manage prices, physical stock, descriptions, and publishing status.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d4af37] text-black font-bold text-xs rounded-xl hover:bg-[#c29d2b]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Perfume</span>
        </Link>
      </div>

      {/* Single horizontally-scrollable table — works on all screen sizes */}
      <div className="bg-[#151821] border border-[#262b3d] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="text-left text-xs" style={{ minWidth: '660px', width: '100%' }}>
            <thead className="bg-[#0d0e12] text-[#94a3b8] uppercase text-[10px] font-bold border-b border-[#262b3d]">
              <tr>
                {/* Sticky Perfume column so users always know which product row they're on */}
                <th className="p-3 sticky left-0 bg-[#0d0e12] z-10" style={{ minWidth: '150px' }}>Perfume</th>
                <th className="p-3" style={{ minWidth: '105px' }}>Brand / Size</th>
                <th className="p-3" style={{ minWidth: '95px' }}>Price (GHS)</th>
                <th className="p-3" style={{ minWidth: '75px' }}>Stock</th>
                <th className="p-3" style={{ minWidth: '95px' }}>Status</th>
                <th className="p-3 text-right" style={{ minWidth: '115px' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2330]">
              {products.map((p) => {
                const imgUrl = p.images[0]?.media?.url || '/uploads/perfumes/perfume_db293e4b7fc0.jpeg';
                return (
                  <tr key={p.id} className="hover:bg-[#1a1f2e] transition-colors">
                    {/* Sticky product name cell */}
                    <td className="p-3 sticky left-0 bg-[#151821] z-10 group-hover:bg-[#1a1f2e]">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#0d0e12] border border-[#262b3d] shrink-0">
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="font-bold text-white leading-tight" style={{ maxWidth: '88px' }}>
                          {p.name}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#cbd5e1]">
                      <div>{p.brand?.name || 'Unassigned'}</div>
                      <div className="text-[10px] text-[#64748b]">{p.size || '100ml'}</div>
                    </td>
                    <td className="p-3 font-black text-[#d4af37] whitespace-nowrap">
                      {formatGhs(p.priceInGhs)}
                    </td>
                    <td className="p-3">
                      <span className={`font-semibold whitespace-nowrap ${p.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-3">
                      {p.status === 'PUBLISHED' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 whitespace-nowrap">
                          <CheckCircle className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/30 whitespace-nowrap">
                          <AlertCircle className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-[#94a3b8] hover:text-white transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/edit/${p.id}`}
                          className="px-2.5 py-1 rounded-lg bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-semibold text-xs transition-colors whitespace-nowrap"
                        >
                          Edit / Price
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Swipe hint — only shown on small screens */}
        <div className="sm:hidden px-4 py-2 border-t border-[#1e2330] flex items-center justify-center gap-2 text-[10px] text-[#64748b]">
          <span>← Swipe to see Status &amp; Actions →</span>
        </div>
      </div>
    </div>
  );
}
