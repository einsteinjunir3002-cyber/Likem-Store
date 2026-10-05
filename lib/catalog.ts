import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  brand?: { name: string; slug: string } | null;
  category?: { name: string; slug: string } | null;
  size?: string | null;
  concentration?: string | null;
  gender?: string | null;
  priceInGhs: number;
  stock?: number;
  status: string;
  shortDescription?: string | null;
  description?: string | null;
  images: Array<{
    id?: string;
    media: {
      url: string;
    };
  }>;
  [key: string]: any;
}

const CATALOG_FILE = path.join(process.cwd(), 'data', 'catalog.json');

export function getStaticFallbackCatalog(): CatalogProduct[] {
  try {
    if (fs.existsSync(CATALOG_FILE)) {
      const content = fs.readFileSync(CATALOG_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading catalog file:', e);
  }
  return [];
}

export async function getSafeProducts(): Promise<CatalogProduct[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      include: {
        brand: true,
        images: {
          include: { media: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: [{ status: 'desc' }, { createdAt: 'desc' }],
    });

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts as unknown as CatalogProduct[];
    }
  } catch (error) {
    // Database may be paused on Supabase free tier or offline
    console.warn('Prisma database query failed, using static catalog fallback:', (error as any)?.message);
  }

  return getStaticFallbackCatalog();
}

export async function getSafeProductBySlug(slug: string): Promise<CatalogProduct | null> {
  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        images: {
          include: { media: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (dbProduct) {
      return dbProduct as unknown as CatalogProduct;
    }
  } catch (error) {
    console.warn(`Prisma product lookup for slug "${slug}" failed, checking catalog:`, (error as any)?.message);
  }

  const catalog = getStaticFallbackCatalog();
  return catalog.find((p) => p.slug === slug) || null;
}
