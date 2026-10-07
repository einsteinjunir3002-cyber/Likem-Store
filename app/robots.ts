import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Private administrative dashboard
          '/admin',
          '/admin/',
          // Internal backend APIs (NOTE: /api/media is intentionally NOT blocked so product images can be indexed)
          '/api/admin',
          '/api/auth',
          '/api/orders',
          '/api/payments',
          '/api/enquiries',
          '/api/products',
          '/api/health',
          // NOTE: Public pages with noindex (such as /cart, /wishlist, /login, /register, /search)
          // are allowed in robots.txt so search engines can crawl them, read their <meta name="robots" content="noindex" />
          // tag, and cleanly drop them from search results without orphan URL indexing.
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
