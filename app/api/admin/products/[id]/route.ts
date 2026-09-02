import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, brandName, priceInGhs, stock, size, concentration, gender, shortDescription, status } = body;

    // Handle Brand
    let brandId = null;
    if (brandName && brandName.trim()) {
      const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const brand = await prisma.brand.upsert({
        where: { slug },
        update: {},
        create: { name: brandName.trim(), slug },
      });
      brandId = brand.id;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        brandId,
        priceInGhs: priceInGhs || 0,
        stock: stock || 0,
        size,
        concentration,
        gender,
        shortDescription,
        status: status || 'DRAFT',
        requiresInformation: priceInGhs <= 0 || stock <= 0,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
