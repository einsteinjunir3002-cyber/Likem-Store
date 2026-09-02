import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { guestName, guestPhone, deliveryAddress, deliveryRegion, items } = body;

    if (!guestName || !guestPhone || !deliveryAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required order details' },
        { status: 400 }
      );
    }

    // Validate products and compute totals strictly server-side
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json({ error: 'One or more selected perfumes are unavailable' }, { status: 400 });
    }

    // Validate stock and compute subtotal
    let subtotalInGhs = 0;
    const orderItemsData = [];

    for (const item of items) {
      const dbProd = dbProducts.find((p) => p.id === item.productId);
      if (!dbProd) continue;

      if (dbProd.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${dbProd.name}. Available: ${dbProd.stock}` },
          { status: 400 }
        );
      }

      const unitPrice = Number(dbProd.priceInGhs);
      const itemTotal = unitPrice * item.quantity;
      subtotalInGhs += itemTotal;

      orderItemsData.push({
        productId: dbProd.id,
        variantId: item.variantId || null,
        productName: dbProd.name,
        unitPriceInGhs: unitPrice,
        quantity: item.quantity,
        totalPriceInGhs: itemTotal,
      });
    }

    // Look up delivery fee
    const regionRecord = await prisma.deliveryRegion.findUnique({
      where: { regionName: deliveryRegion },
    });
    const deliveryFeeInGhs = regionRecord ? Number(regionRecord.baseFeeInGhs) : 30;
    const totalInGhs = subtotalInGhs + deliveryFeeInGhs;

    // Generate Order Number: LIKEM-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `LIKEM-2026-${randomSuffix}`;

    // Execute order creation and stock adjustment in a single Prisma transaction
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          guestName,
          guestPhone,
          deliveryAddress,
          deliveryRegion,
          subtotalInGhs,
          deliveryFeeInGhs,
          totalInGhs,
          paymentMethod: 'PAYSTACK_MOMO',
          paymentStatus: 'PENDING',
          orderStatus: 'PENDING',
          orderSource: 'WEBSITE',
          items: {
            create: orderItemsData,
          },
        },
      });

      // Deduct inventory and write audit trail
      for (const item of items) {
        const dbProd = dbProducts.find((p) => p.id === item.productId);
        if (!dbProd) continue;

        const newStock = Math.max(0, dbProd.stock - item.quantity);

        await tx.product.update({
          where: { id: dbProd.id },
          data: { stock: newStock },
        });

        await tx.inventoryLog.create({
          data: {
            productId: dbProd.id,
            change: -item.quantity,
            previousStock: dbProd.stock,
            newStock,
            reason: `ORDER_${orderNumber}`,
          },
        });
      }

      return createdOrder;
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      totalInGhs: order.totalInGhs,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Server error creating order' }, { status: 500 });
  }
}
