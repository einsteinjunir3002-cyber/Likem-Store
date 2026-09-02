import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

export const revalidate = 0;

export default async function AdminMediaPage() {
  const mediaItems = await prisma.media.findMany({
    include: {
      productImages: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="border-b border-[#1e2330] pb-4">
        <h1 className="text-2xl font-black text-white">Media Library</h1>
        <p className="text-xs text-[#94a3b8]">
          Managed application images imported from Desktop/LIKEM/MEDIA.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaItems.map((m) => {
          const associatedProduct = m.productImages[0]?.product;
          return (
            <div
              key={m.id}
              className="bg-[#151821] border border-[#262b3d] rounded-2xl overflow-hidden flex flex-col justify-between group"
            >
              <div className="aspect-square bg-[#0d0e12] overflow-hidden relative">
                <img src={m.url} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 right-2 text-[10px] bg-black/80 px-2 py-0.5 rounded text-white font-mono">
                  {m.width}x{m.height}
                </span>
              </div>

              <div className="p-4 space-y-2 text-xs">
                <div className="font-mono text-[11px] text-[#94a3b8] truncate">{m.filename}</div>
                <div className="text-[11px]">
                  {associatedProduct ? (
                    <Link
                      href={`/admin/products/edit/${associatedProduct.id}`}
                      className="text-[#d4af37] font-semibold hover:underline flex items-center gap-1"
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>{associatedProduct.name}</span>
                    </Link>
                  ) : (
                    <span className="text-[#64748b]">Unassigned</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
