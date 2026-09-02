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

      <div className="bg-[#151821] border border-[#262b3d] rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#0d0e12] text-[#94a3b8] uppercase text-[11px] font-bold border-b border-[#262b3d]">
            <tr>
              <th className="p-3 sm:p-4">Perfume</th>
              <th className="p-3 sm:p-4">Brand / Size</th>
              <th className="p-3 sm:p-4">Price (GHS)</th>
              <th className="p-3 sm:p-4">Stock</th>
              <th className="p-3 sm:p-4">Status</th>
              <th className="p-3 sm:p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2330]">
            {products.map((p) => {
              const imgUrl = p.images[0]?.media?.url || '/uploads/perfumes/perfume_db293e4b7fc0.jpeg';
              return (
                <tr key={p.id} className="hover:bg-[#1a1f2e] transition-colors">
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#0d0e12] border border-[#262b3d] shrink-0">
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="font-bold text-white line-clamp-1">{p.name}</div>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-[#cbd5e1]">
                    <div>{p.brand?.name || 'Unassigned'}</div>
                    <div className="text-[11px] text-[#64748b]">{p.size || '100ml'}</div>
                  </td>
                  <td className="p-3 sm:p-4 font-black text-[#d4af37]">
                    {formatGhs(p.priceInGhs)}
                  </td>
                  <td className="p-3 sm:p-4">
                    <span
                      className={`font-semibold ${
                        p.stock > 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-3 sm:p-4">
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
                  <td className="p-3 sm:p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="p-1.5 text-[#94a3b8] hover:text-white"
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
  );
}
