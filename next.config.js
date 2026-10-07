/** @type {import('next').NextConfig} */
const noindex = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }];

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // 301 Redirect secondary Vercel alias to primary canonical domain to prevent duplicate indexing
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'the-likem-perfumery.vercel.app',
          },
        ],
        destination: 'https://thelikemperfumery.vercel.app/:path*',
        permanent: true,
      },
    ];
  },
  // Belt-and-braces: private areas also send a noindex header (works even for
  // non-HTML responses). /api/media is intentionally excluded so images stay crawlable.
  async headers() {
    return [
      { source: '/admin/:path*', headers: noindex },
      { source: '/api/admin/:path*', headers: noindex },
      { source: '/api/auth/:path*', headers: noindex },
      { source: '/api/orders/:path*', headers: noindex },
      { source: '/api/payments/:path*', headers: noindex },
      { source: '/api/enquiries', headers: noindex },
      { source: '/api/products', headers: noindex },
      { source: '/api/health', headers: noindex },
    ];
  },
};

module.exports = nextConfig;
