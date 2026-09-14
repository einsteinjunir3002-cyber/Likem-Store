import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatGhs } from '@/lib/currency';
import { Plus, Edit, Eye, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

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

      {/* Desktop Table View (sm+ screens) */}
      <div className="hidden sm:block bg-[#151821] border border-[#262b3d] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-[#0d0e12] text-[#94a3b8] uppercase text-[11px] font-bold border-b border-[#262b3d]">
              <tr>
                <th className="p-4">Perfume</th>
                <th className="p-4">Brand / Size</th>
                <th className="p-4">Price (GHS)</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2330]">
              {products.map((p) => {
                const imgUrl = p.images[0]?.media?.url || '/uploads/perfumes/perfume_db293e4b7fc0.jpeg';
                return (
                  <tr key={p.id} className="hover:bg-[#1a1f2e] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#0d0e12] border border-[#262b3d] shrink-0">
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="font-bold text-white line-clamp-1">{p.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-[#cbd5e1]">
                      <div>{p.brand?.name || 'Unassigned'}</div>
                      <div className="text-[11px] text-[#64748b]">{p.size || '100ml'}</div>
                    </td>
                    <td className="p-4 font-black text-[#d4af37]">
                      {formatGhs(p.priceInGhs)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-semibold ${
                          p.stock > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-4">
                      {p.status === 'PUBLISHED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          <CheckCircle className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                          <AlertCircle className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
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
                          className="px-2.5 py-1 rounded bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-semibold text-xs transition-colors"
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
      </div>

      {/* Mobile Card List View (< sm screens) */}
      <div className="block sm:hidden space-y-3">
        {products.map((p) => {
          const imgUrl = p.images[0]?.media?.url || '/uploads/perfumes/perfume_db293e4b7fc0.jpeg';
          return (
            <div
              key={p.id}
              className="bg-[#151821] border border-[#262b3d] rounded-2xl p-4 space-y-3 shadow-lg"
            >
              {/* Top Row: Perfume info & Status Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0d0e12] border border-[#262b3d] shrink-0">
                    <img src={imgUrl} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{p.name}</h3>
                    <p className="text-xs text-[#94a3b8] truncate">
                      {p.brand?.name || 'Unassigned'} • <span className="text-[#64748b]">{p.size || '100ml'}</span>
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {p.status === 'PUBLISHED' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      <CheckCircle className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                      <AlertCircle className="w-3 h-3" /> Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Middle Row: Price & Stock metrics */}
              <div className="flex items-center justify-between bg-[#0d0e12] px-3.5 py-2 rounded-xl border border-[#1e2330]">
                <div>
                  <span className="text-[10px] text-[#64748b] block font-bold uppercase tracking-wider">Price</span>
                  <span className="font-black text-[#d4af37] text-sm">{formatGhs(p.priceInGhs)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#64748b] block font-bold uppercase tracking-wider">Physical Stock</span>
                  <span
                    className={`font-bold text-xs ${
                      p.stock > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {p.stock} units
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <Link
                  href={`/admin/products/edit/${p.id}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#d4af37] text-black font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5 shadow-md hover:bg-[#c29d2b]"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit / Price</span>
                </Link>
                <Link
                  href={`/products/${p.slug}`}
                  target="_blank"
                  className="p-2.5 rounded-xl bg-[#1e2330] text-[#94a3b8] hover:text-white border border-[#262b3d] flex items-center justify-center transition-colors"
                  title="Preview Storefront"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
