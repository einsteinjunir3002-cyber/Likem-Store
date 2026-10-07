/**
 * Central SEO configuration.
 *
 * The production domain is supplied through an environment variable so that
 * switching from the Vercel URL to a custom domain needs NO code change:
 *
 *   NEXT_PUBLIC_SITE_URL="https://www.your-domain.com"
 *
 * (NEXT_PUBLIC_APP_URL, VERCEL_PROJECT_PRODUCTION_URL, and VERCEL_URL are also honoured.)
 */

// Primary production custom domain
const FALLBACK_SITE_URL = 'https://www.thelikemperfumery.com';

function normalizeUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  let value = raw.trim();
  if (!value) return null;
  // Ignore the template placeholder shipped in .env.example
  if (/yourdomain\.com/i.test(value)) return null;
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  try {
    const url = new URL(value);
    return url.origin; // origin = scheme + host (+ port), no trailing slash/path
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  return (
    normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeUrl(process.env.NEXT_PUBLIC_APP_URL) ||
    FALLBACK_SITE_URL
  );
}

/** Build an absolute canonical URL from a site-relative path. */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return clean === '/' ? getSiteUrl() : `${getSiteUrl()}${clean}`;
}

/** Default Open Graph / Twitter image: a real product photo already in /public. */
export const DEFAULT_OG_IMAGE = '/uploads/perfumes/perfume_db293e4b7fc0.jpeg';

export const DEFAULT_STORE_NAME = 'The Likem Perfumery';

/** Convert a Ghanaian number (0502547133 / +233502547133) to E.164 (+233502547133). */
export function toE164(phone: string | undefined | null): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return undefined;
  if (digits.startsWith('233')) return `+${digits}`;
  if (digits.startsWith('0') && digits.length === 10) return `+233${digits.slice(1)}`;
  return `+${digits}`;
}

/** Trim text to a meta-description-friendly length without cutting words mid-way. */
export function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[ ,.;:–-]+$/, '')}…`;
}

/** Breadcrumb JSON-LD builder. Items: [{ name, path }] */
export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
