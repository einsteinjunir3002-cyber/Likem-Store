import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatGhs } from '@/lib/currency';
import { Search } from 'lucide-react';

export const revalidate = 0;

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q || '').trim();

  const products = query
    ? await prisma.product.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { brand: { name: { contains: query, mode: 'insensitive' } } },
            { fragranceFamily: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          brand: true,
          images: { include: { media: true } },
        },
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#1e2330] pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white">Search Results</h1>
        <p className="text-xs text-[#94a3b8] mt-1">
          {query ? `Showing results for "${query}"` : 'Enter a fragrance name or brand'}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-[#151821] rounded-2xl border border-[#262b3d] p-8 space-y-4">
          <Search className="w-8 h-8 text-[#94a3b8] mx-auto" />
          <h2 className="text-lg font-bold text-white">No matching perfumes found</h2>
          <p className="text-xs text-[#94a3b8] max-w-sm mx-auto">
            Try searching for another fragrance name, or message the seller directly on WhatsApp to ask about sourcing your perfume.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex px-5 py-2.5 bg-[#d4af37] text-black font-bold text-xs rounded-xl"
            >
              Browse Full Catalogue
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => {
            const primaryImage = p.images[0]?.media?.url || '/uploads/perfumes/perfume_db293e4b7fc0.jpeg';
            return (
              <div
                key={p.id}
                className="bg-[#151821] border border-[#262b3d] rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <Link href={`/products/${p.slug}`} className="aspect-square overflow-hidden block">
                  <img src={primaryImage} alt={p.name} className="w-full h-full object-cover" />
                </Link>
                <div className="p-4 space-y-2">
                  <div className="text-[10px] text-[#d4af37] uppercase font-bold">
                    {p.brand?.name || 'Fragrance'}
                  </div>
                  <Link href={`/products/${p.slug}`}>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{p.name}</h3>
                  </Link>
                  <div className="text-sm font-black text-[#d4af37]">
                    {formatGhs(p.priceInGhs)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
