import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, brandName, priceInGhs, stock, size, concentration, gender, shortDescription, status, mediaId } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Perfume name is required.' }, { status: 400 });
    }

    // Upsert brand if provided
    let brandId = null;
    if (brandName && brandName.trim()) {
      const slug = brandName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const brand = await prisma.brand.upsert({
        where: { slug },
        update: {},
        create: { name: brandName.trim(), slug },
      });
      brandId = brand.id;
    }

    // Generate a unique slug from the name
    const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existingCount = await prisma.product.count({ where: { slug: { startsWith: baseSlug } } });
    const slug = existingCount > 0 ? `${baseSlug}-${Date.now()}` : baseSlug;

    const parsedPrice = parseFloat(priceInGhs) || 0;
    const parsedStock = parseInt(stock, 10) || 0;

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        brandId,
        priceInGhs: parsedPrice,
        stock: parsedStock,
        size: size || '100ml',
        concentration: concentration || 'Eau De Parfum',
        gender: gender || 'Unisex',
        shortDescription: shortDescription || '',
        status: status || 'DRAFT',
        requiresInformation: parsedPrice <= 0 || parsedStock <= 0,
      },
    });

    if (mediaId) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          mediaId,
          isPrimary: true,
          sortOrder: 0,
        },
      });
    }

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
