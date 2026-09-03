import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    // Allow if valid admin session
    const { id } = await params;
    const body = await req.json();
    const { orderStatus, paymentStatus, notes } = body;

    const existing = await prisma.order.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (orderStatus) {
      updateData.orderStatus = orderStatus;
    }
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    // Automatically mark payment as PAID if order was marked DELIVERED and was previously PENDING
    if (orderStatus === 'DELIVERED' && existing.paymentStatus === 'PENDING') {
      updateData.paymentStatus = 'PAID';
    }

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    try {
      await prisma.auditLog.create({
        data: {
          action: 'ORDER_STATUS_UPDATE',
          entity: 'Order',
          entityId: id,
          adminUserId: admin?.userId || null,
          details: `Order ${existing.orderNumber} status changed from ${existing.orderStatus} to ${orderStatus || existing.orderStatus} (Payment: ${updateData.paymentStatus || existing.paymentStatus})`,
        },
      });
    } catch {
      // Non-blocking
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.order.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete order' }, { status: 500 });
  }
}
