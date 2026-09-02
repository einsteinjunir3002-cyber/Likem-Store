import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const brand = url.searchParams.get('brand');
    const gender = url.searchParams.get('gender');
    const search = url.searchParams.get('search');

    const where: any = {
      status: 'PUBLISHED',
    };

    if (category) where.category = { slug: category };
    if (brand) where.brand = { slug: brand };
    if (gender) where.gender = gender;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
        images: { include: { media: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
