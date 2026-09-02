import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, deliveryAddress, deliveryRegion, deliveryFeeInGhs, items, notes } = body;

    if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Customer name, phone, and items are required' }, { status: 400 });
    }

    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let subtotalInGhs = 0;
    const orderItemsData = [];

    for (const item of items) {
      const dbProd = dbProducts.find((p) => p.id === item.productId);
      if (!dbProd) continue;

      const unitPrice = item.customPrice !== undefined ? Number(item.customPrice) : Number(dbProd.priceInGhs);
      const itemTotal = unitPrice * item.quantity;
      subtotalInGhs += itemTotal;

      orderItemsData.push({
        productId: dbProd.id,
        productName: dbProd.name,
        unitPriceInGhs: unitPrice,
        quantity: item.quantity,
        totalPriceInGhs: itemTotal,
      });
    }

    const deliveryFee = Number(deliveryFeeInGhs) || 0;
    const totalInGhs = subtotalInGhs + deliveryFee;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `WA-2026-${randomSuffix}`;

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          guestName: customerName,
          guestPhone: customerPhone,
          deliveryAddress,
          deliveryRegion,
          deliveryFeeInGhs: deliveryFee,
          subtotalInGhs,
          totalInGhs,
          paymentMethod: 'WHATSAPP',
          paymentStatus: 'PAID', // Admin is recording an agreed WhatsApp sale
          orderStatus: 'CONFIRMED',
          orderSource: 'WHATSAPP',
          notes,
          items: {
            create: orderItemsData,
          },
        },
      });

      // Deduct inventory and log
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
            reason: `WHATSAPP_SALE_${orderNumber}`,
          },
        });
      }

      return createdOrder;
    });

    return NextResponse.json({ success: true, orderNumber: order.orderNumber, orderId: order.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
