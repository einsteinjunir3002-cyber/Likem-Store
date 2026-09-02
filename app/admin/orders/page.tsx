import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatGhs } from '@/lib/currency';
import { Plus, MessageCircle, Eye } from 'lucide-react';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e2330] pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Orders & WhatsApp Sales</h1>
          <p className="text-xs text-[#94a3b8]">
            Manage online orders and log sales confirmed via WhatsApp or social media.
          </p>
        </div>
        <Link
          href="/admin/orders/new-whatsapp"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] text-black font-bold text-xs rounded-xl hover:bg-[#20ba59]"
        >
          <Plus className="w-4 h-4" />
          <span>Record WhatsApp Sale</span>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#151821] border border-[#262b3d] rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#1e2330] flex items-center justify-center text-[#94a3b8] mx-auto">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Orders Recorded Yet</h3>
          <p className="text-xs text-[#94a3b8] max-w-md mx-auto">
            Orders placed via the website or manual WhatsApp entries will appear here with full customer details and delivery status.
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
        <div className="bg-[#151821] border border-[#262b3d] rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0d0e12] text-[#94a3b8] uppercase text-[11px] font-bold border-b border-[#262b3d]">
              <tr>
                <th className="p-3 sm:p-4">Order Ref</th>
                <th className="p-3 sm:p-4">Customer</th>
                <th className="p-3 sm:p-4">Source</th>
                <th className="p-3 sm:p-4">Total (GHS)</th>
                <th className="p-3 sm:p-4">Status</th>
                <th className="p-3 sm:p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2330]">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-[#1a1f2e] transition-colors">
                  <td className="p-3 sm:p-4 font-mono font-bold text-[#d4af37]">{o.orderNumber}</td>
                  <td className="p-3 sm:p-4">
                    <div className="font-semibold text-white">{o.guestName || 'Anonymous Customer'}</div>
                    <div className="text-[11px] text-[#94a3b8]">{o.guestPhone}</div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        o.orderSource === 'WHATSAPP'
                          ? 'bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30'
                          : 'bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30'
                      }`}
                    >
                      {o.orderSource}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 font-black text-white">{formatGhs(o.totalInGhs)}</td>
                  <td className="p-3 sm:p-4">
                    <span className="px-2 py-0.5 rounded bg-[#1e2330] text-[#cbd5e1] text-[10px] font-bold uppercase">
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-xs text-[#94a3b8]">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
