'use client';

import React, { useState } from 'react';
import { formatGhs } from '@/lib/currency';
import {
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  ChevronDown,
  MessageCircle,
  Phone,
  MapPin,
  Eye,
  ExternalLink,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

interface OrderItem {
  id: string;
  productName: string;
  unitPriceInGhs: any;
  quantity: number;
  totalPriceInGhs: any;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  guestName: string | null;
  guestPhone: string | null;
  guestEmail: string | null;
  deliveryAddress: string | null;
  deliveryRegion: string | null;
  deliveryFeeInGhs: any;
  subtotalInGhs: any;
  totalInGhs: any;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  orderSource: string;
  notes: string | null;
  createdAt: string | Date;
  items?: OrderItem[];
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; icon: any }> = {
  PENDING: {
    label: 'Pending',
    bg: 'rgba(245, 158, 11, 0.12)',
    text: '#fbbf24',
    border: 'rgba(245, 158, 11, 0.35)',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmed',
    bg: 'rgba(59, 130, 246, 0.12)',
    text: '#60a5fa',
    border: 'rgba(59, 130, 246, 0.35)',
    icon: PackageCheck,
  },
  PROCESSING: {
    label: 'Processing',
    bg: 'rgba(168, 85, 247, 0.12)',
    text: '#c084fc',
    border: 'rgba(168, 85, 247, 0.35)',
    icon: PackageCheck,
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    bg: 'rgba(14, 165, 233, 0.12)',
    text: '#38bdf8',
    border: 'rgba(14, 165, 233, 0.35)',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Delivered',
    bg: 'rgba(16, 185, 129, 0.15)',
    text: '#34d399',
    border: 'rgba(16, 185, 129, 0.40)',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'rgba(239, 68, 68, 0.12)',
    text: '#f87171',
    border: 'rgba(239, 68, 68, 0.35)',
    icon: XCircle,
  },
};

export default function AdminOrdersTable({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update order status');
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus, paymentStatus: data.order.paymentStatus } : o))
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus, paymentStatus: data.order.paymentStatus } : null));
      }

      showToast(`Order status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
    } catch (err: any) {
      alert(err.message || 'Error updating order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTogglePaymentStatus = async (orderId: string, currentStatus: string) => {
    const nextPayment = currentStatus === 'PAID' ? 'PENDING' : 'PAID';
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: nextPayment }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update payment');
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: nextPayment } : o))
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus: nextPayment } : null));
      }

      showToast(`Payment marked as ${nextPayment}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.guestName && o.guestName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.guestPhone && o.guestPhone.includes(searchTerm));

    const matchesFilter = statusFilter === 'ALL' || o.orderStatus === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10b981] text-black font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#131622] p-3 rounded-2xl border border-[#262b3d]">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by order ref, name, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0a0c12] border border-[#262b3d] rounded-xl px-3 py-2 text-xs text-white placeholder-[#64748b] focus:border-[#d4af37] focus:outline-none pl-9"
          />
          <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'PENDING', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => setStatusFilter(statusKey)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wide uppercase transition-all shrink-0 ${
                statusFilter === statusKey
                  ? 'bg-[#d4af37] text-black'
                  : 'bg-[#1e2330] text-[#94a3b8] hover:text-white'
              }`}
            >
              {statusKey === 'ALL' ? 'All Orders' : STATUS_CONFIG[statusKey]?.label || statusKey}
            </button>
          ))}
        </div>
      </div>

      {/* Main Orders Table */}
      <div className="bg-[#151821] border border-[#262b3d] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0d0e12] text-[#94a3b8] uppercase text-[10px] font-bold tracking-wider border-b border-[#262b3d]">
              <tr>
                <th className="p-3 sm:p-4">Order Ref</th>
                <th className="p-3 sm:p-4">Customer</th>
                <th className="p-3 sm:p-4">Source</th>
                <th className="p-3 sm:p-4">Total (GHS)</th>
                <th className="p-3 sm:p-4">Delivery Status (Click to Change)</th>
                <th className="p-3 sm:p-4">Date</th>
                <th className="p-3 sm:p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2330]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[#64748b]">
                    No orders match the selected search or filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const cfg = STATUS_CONFIG[o.orderStatus] || STATUS_CONFIG.PENDING;
                  const Icon = cfg.icon;
                  const isUpdating = updatingId === o.id;

                  return (
                    <tr key={o.id} className="hover:bg-[#1a1f2e] transition-colors">
                      {/* Order Number */}
                      <td className="p-3 sm:p-4">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(o)}
                          className="font-mono font-bold text-[#d4af37] hover:underline flex items-center gap-1.5"
                        >
                          <span>{o.orderNumber}</span>
                        </button>
                        <div className="text-[10px] text-[#64748b] font-medium mt-0.5">
                          {o.paymentStatus === 'PAID' ? (
                            <span className="text-emerald-400 font-bold">PAID</span>
                          ) : (
                            <span className="text-amber-400 font-bold">UNPAID</span>
                          )}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="p-3 sm:p-4">
                        <div className="font-semibold text-white">{o.guestName || 'Anonymous Customer'}</div>
                        <div className="text-[11px] text-[#94a3b8] flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-[#64748b]" />
                          <span>{o.guestPhone || 'No phone'}</span>
                        </div>
                      </td>

                      {/* Source */}
                      <td className="p-3 sm:p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            o.orderSource === 'WHATSAPP'
                              ? 'bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30'
                              : 'bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30'
                          }`}
                        >
                          {o.orderSource}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="p-3 sm:p-4 font-black text-white">{formatGhs(o.totalInGhs)}</td>

                      {/* Interactive Status Dropdown Selector */}
                      <td className="p-3 sm:p-4">
                        <div className="relative inline-block">
                          <select
                            disabled={isUpdating}
                            value={o.orderStatus}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            style={{
                              backgroundColor: cfg.bg,
                              color: cfg.text,
                              borderColor: cfg.border,
                            }}
                            className="appearance-none font-bold text-xs py-1.5 pl-3 pr-8 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#d4af37] cursor-pointer disabled:opacity-50 transition-all"
                          >
                            <option value="PENDING" className="bg-[#151821] text-amber-400">
                              🟡 Pending
                            </option>
                            <option value="CONFIRMED" className="bg-[#151821] text-blue-400">
                              🔵 Confirmed
                            </option>
                            <option value="PROCESSING" className="bg-[#151821] text-purple-400">
                              🟣 Processing
                            </option>
                            <option value="OUT_FOR_DELIVERY" className="bg-[#151821] text-sky-400">
                              🚚 Out for Delivery
                            </option>
                            <option value="DELIVERED" className="bg-[#151821] text-emerald-400">
                              🟢 Delivered
                            </option>
                            <option value="CANCELLED" className="bg-[#151821] text-red-400">
                              🔴 Cancelled
                            </option>
                          </select>
                          <ChevronDown
                            className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-75"
                            style={{ color: cfg.text }}
                          />
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-3 sm:p-4 text-xs text-[#94a3b8] whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>

                      {/* View Button */}
                      <td className="p-3 sm:p-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(o)}
                          className="px-2.5 py-1 rounded-lg bg-[#1e2330] hover:bg-[#283042] text-[#d4af37] text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================================================================
          ORDER DETAILS MODAL (Pop-up when clicking "View" or Order Number)
          ================================================================ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#151821] border border-[#d4af37]/35 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#262b3d] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold block">
                  Order Details
                </span>
                <h3 className="font-mono text-2xl font-bold text-white">{selectedOrder.orderNumber}</h3>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()} via {selectedOrder.orderSource}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-[#1e2330] text-[#94a3b8] hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Status & Payment Bar */}
            <div className="grid grid-cols-2 gap-3 bg-[#0d0e12] p-4 rounded-2xl border border-[#262b3d]">
              <div>
                <label className="text-[9px] uppercase tracking-wider text-[#64748b] block mb-1 font-bold">
                  Delivery Status
                </label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className="w-full bg-[#1e2330] text-white border border-[#374151] rounded-xl px-3 py-2 text-xs font-bold cursor-pointer focus:border-[#d4af37]"
                >
                  <option value="PENDING">🟡 Pending</option>
                  <option value="CONFIRMED">🔵 Confirmed</option>
                  <option value="PROCESSING">🟣 Processing</option>
                  <option value="OUT_FOR_DELIVERY">🚚 Out for Delivery</option>
                  <option value="DELIVERED">🟢 Delivered</option>
                  <option value="CANCELLED">🔴 Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-wider text-[#64748b] block mb-1 font-bold">
                  Payment Status
                </label>
                <button
                  type="button"
                  onClick={() => handleTogglePaymentStatus(selectedOrder.id, selectedOrder.paymentStatus)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selectedOrder.paymentStatus === 'PAID'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{selectedOrder.paymentStatus === 'PAID' ? 'PAID (Click to change)' : 'PENDING (Click to mark Paid)'}</span>
                </button>
              </div>
            </div>

            {/* Customer & Delivery Information */}
            <div className="space-y-2 bg-[#0d0e12] p-4 rounded-2xl border border-[#262b3d]">
              <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider block">
                Customer & Destination
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#64748b] block text-[10px]">Client Name:</span>
                  <span className="text-white font-medium">{selectedOrder.guestName || 'Anonymous'}</span>
                </div>
                <div>
                  <span className="text-[#64748b] block text-[10px]">Phone Number:</span>
                  <span className="text-white font-mono">{selectedOrder.guestPhone || 'None'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[#64748b] block text-[10px]">Delivery Address & Region:</span>
                  <span className="text-white">
                    {selectedOrder.deliveryAddress || 'Not specified'} {selectedOrder.deliveryRegion ? `(${selectedOrder.deliveryRegion})` : ''}
                  </span>
                </div>
                {selectedOrder.notes && (
                  <div className="sm:col-span-2 bg-[#151821] p-2.5 rounded-xl border border-[#1e2330]">
                    <span className="text-[#64748b] block text-[10px]">Delivery Notes:</span>
                    <span className="text-xs text-[#cbd5e1]">{selectedOrder.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items Breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider block">
                Perfumes in Order
              </span>
              <div className="divide-y divide-[#1e2330] border border-[#262b3d] rounded-2xl overflow-hidden bg-[#0d0e12]">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((it) => (
                    <div key={it.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{it.productName}</div>
                        <div className="text-[10px] text-[#94a3b8]">
                          Qty: {it.quantity} × {formatGhs(it.unitPriceInGhs)}
                        </div>
                      </div>
                      <div className="font-bold text-white font-mono">{formatGhs(it.totalPriceInGhs)}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-xs text-[#64748b]">Order summary items recorded.</div>
                )}
                <div className="p-3 bg-[#151821] flex justify-between text-xs font-bold border-t border-[#262b3d]">
                  <span className="text-[#94a3b8]">Total Amount:</span>
                  <span className="text-[#d4af37] font-mono text-sm">{formatGhs(selectedOrder.totalInGhs)}</span>
                </div>
              </div>
            </div>

            {/* Action Bar (WhatsApp message to customer) */}
            {selectedOrder.guestPhone && (
              <a
                href={`https://wa.me/${selectedOrder.guestPhone.replace(/[^0-9]/g, '').replace(/^0/, '233')}?text=${encodeURIComponent(
                  `Hello ${selectedOrder.guestName || 'valued client'}! Regarding your order ${selectedOrder.orderNumber} from The Likem Perfumery, current status is: ${STATUS_CONFIG[selectedOrder.orderStatus]?.label || selectedOrder.orderStatus}. Thank you!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Message Client on WhatsApp ({selectedOrder.guestPhone})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
