import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const productCount = await prisma.product.count();
    const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      currency: settings?.currencyCode || 'GHS',
      productsTracked: productCount,
      store: settings?.storeName,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    );
  }
}
