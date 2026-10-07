import { NextResponse } from 'next/server';
import { getSafeProducts } from '@/lib/catalog';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

interface SitemapItem {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  images?: string[];
}

export async function GET() {
  let products: Awaited<ReturnType<typeof getSafeProducts>> = [];
  try {
    products = await getSafeProducts();
  } catch {
    products = [];
  }

  const staticRoutes: SitemapItem[] = [
    { url: absoluteUrl('/'), lastmod: new Date().toISOString(), changefreq: 'daily', priority: '1.0' },
    { url: absoluteUrl('/products'), lastmod: new Date().toISOString(), changefreq: 'daily', priority: '0.9' },
    { url: absoluteUrl('/delivery-faq'), lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.5' },
    { url: absoluteUrl('/contact'), lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.5' },
  ];

  const productRoutes: SitemapItem[] = products
    .filter((p) => p.status === 'PUBLISHED' && p.slug)
    .map((p) => {
      const images = (p.images || [])
        .map((img) => img?.media?.url)
        .filter((u): u is string => !!u)
        .map((u) => absoluteUrl(u));

      return {
        url: absoluteUrl(`/products/${p.slug}`),
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8',
        images,
      };
    });

  const allUrls: SitemapItem[] = [...staticRoutes, ...productRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls
  .map((item) => {
    const imagesXml = (item.images || [])
      .map((imgUrl) => `    <image:image><image:loc>${escapeXml(imgUrl)}</image:loc></image:image>`)
      .join('\n');

    return `  <url>
    <loc>${escapeXml(item.url)}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
${imagesXml ? `${imagesXml}\n` : ''}  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
