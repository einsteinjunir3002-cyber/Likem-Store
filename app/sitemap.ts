import { MetadataRoute } from 'next';
import { getSafeProducts } from '@/lib/catalog';
import { absoluteUrl } from '@/lib/seo';

// Revalidate every 1 hour (3600s) on Vercel's edge cache so crawls are lightning fast
// while newly published products automatically refresh.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: Awaited<ReturnType<typeof getSafeProducts>> = [];
  try {
    // Same data source as the storefront (database, with static-catalog fallback).
    products = await getSafeProducts();
  } catch {
    products = [];
  }

  // Only PUBLISHED products are indexable (drafts are excluded from sitemap).
  const productUrls: MetadataRoute.Sitemap = products
    .filter((p) => p.status === 'PUBLISHED' && p.slug)
    .map((p) => {
      const images = (p.images || [])
        .map((img) => img?.media?.url)
        .filter((u): u is string => !!u)
        .map((u) => absoluteUrl(u));
      return {
        url: absoluteUrl(`/products/${p.slug}`),
        ...(p.updatedAt ? { lastModified: new Date(p.updatedAt) } : {}),
        ...(images.length ? { images } : {}),
      };
    });

  // Public, indexable pages only. Excluded on purpose: /admin, /login, /register,
  // /cart, /wishlist, /search and all /api routes.
  const staticUrls: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/') },
    { url: absoluteUrl('/products') },
    { url: absoluteUrl('/delivery-faq') },
    { url: absoluteUrl('/contact') },
  ];

  return [...staticUrls, ...productUrls];
}
