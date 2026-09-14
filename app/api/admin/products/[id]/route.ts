import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        images: { include: { media: true }, take: 1 },
      },
    });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      name,
      brandName,
      priceInGhs,
      stock,
      size,
      concentration,
      gender,
      shortDescription,
      status,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Perfume name is required.' }, { status: 400 });
    }

    // Upsert brand if provided
    let brandId: string | null = null;
    if (brandName && brandName.trim()) {
      const slug = brandName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const brand = await prisma.brand.upsert({
        where: { slug },
        update: { name: brandName.trim() },
        create: { name: brandName.trim(), slug },
      });
      brandId = brand.id;
    }

    const parsedPrice = parseFloat(priceInGhs) || 0;
    const parsedStock = parseInt(stock, 10) || 0;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
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

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
