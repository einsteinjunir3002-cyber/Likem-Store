import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const productCount = await prisma.product.count();
    const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    const dbInfo: any = await prisma.$queryRawUnsafe('SELECT current_user, current_database();');

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      dbUser: dbInfo?.[0]?.current_user,
      dbName: dbInfo?.[0]?.current_database,
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
