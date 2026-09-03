import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Plus, MessageCircle } from 'lucide-react';
import AdminOrdersTable from '@/components/AdminOrdersTable';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    orders = [];
  }

  // Convert Prisma Decimals to numbers for Client Component serialization
  const serializableOrders = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    guestName: o.guestName,
    guestPhone: o.guestPhone,
    guestEmail: o.guestEmail,
    deliveryAddress: o.deliveryAddress,
    deliveryRegion: o.deliveryRegion,
    deliveryFeeInGhs: Number(o.deliveryFeeInGhs || 0),
    subtotalInGhs: Number(o.subtotalInGhs || 0),
    totalInGhs: Number(o.totalInGhs || 0),
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    orderStatus: o.orderStatus,
    orderSource: o.orderSource,
    notes: o.notes,
    createdAt: o.createdAt.toISOString(),
    items: (o.items || []).map((it: any) => ({
      id: it.id,
      productName: it.productName,
      unitPriceInGhs: Number(it.unitPriceInGhs || 0),
      quantity: it.quantity,
      totalPriceInGhs: Number(it.totalPriceInGhs || 0),
    })),
  }));

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e2330] pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Orders & WhatsApp Sales</h1>
          <p className="text-xs text-[#94a3b8]">
            Manage client orders, click any delivery status to update (e.g. Delivered), or record new sales.
          </p>
        </div>
        <Link
          href="/admin/orders/new-whatsapp"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] text-black font-bold text-xs rounded-xl hover:bg-[#20ba59] transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Record WhatsApp Sale</span>
        </Link>
      </div>

      {serializableOrders.length === 0 ? (
        <div className="bg-[#151821] border border-[#262b3d] rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#1e2330] flex items-center justify-center text-[#94a3b8] mx-auto">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Orders Recorded Yet</h3>
          <p className="text-xs text-[#94a3b8] max-w-md mx-auto">
            Orders placed via the website or manual WhatsApp entries will appear here with full customer details and real-time delivery status controls.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/orders/new-whatsapp"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d4af37] text-black font-bold text-xs rounded-xl"
            >
              <span>Record First WhatsApp Sale</span>
            </Link>
          </div>
        </div>
      ) : (
        <AdminOrdersTable initialOrders={serializableOrders} />
      )}
    </div>
  );
}
