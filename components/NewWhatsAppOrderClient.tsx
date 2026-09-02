'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Save } from 'lucide-react';
import Link from 'next/link';

interface NewWhatsAppOrderProps {
  products: Array<{ id: string; name: string; priceInGhs: number; stock: number }>;
  regions: Array<{ regionName: string; baseFeeInGhs: number }>;
}

export default function NewWhatsAppOrderClient({ products, regions }: NewWhatsAppOrderProps) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryRegion, setDeliveryRegion] = useState(regions[0]?.regionName || 'Greater Accra');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState('1');
  const [customPrice, setCustomPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedProd = products.find((p) => p.id === selectedProductId);
  const regionObj = regions.find((r) => r.regionName === deliveryRegion);
  const deliveryFee = regionObj ? regionObj.baseFeeInGhs : 30;

  const unitPrice = customPrice ? parseFloat(customPrice) : selectedProd ? selectedProd.priceInGhs : 0;
  const qtyNum = parseInt(quantity, 10) || 1;
  const total = unitPrice * qtyNum + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      setError('Please select a perfume.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/orders/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          deliveryAddress,
          deliveryRegion,
          deliveryFeeInGhs: deliveryFee,
          items: [
            {
              productId: selectedProductId,
              quantity: qtyNum,
              customPrice: customPrice ? parseFloat(customPrice) : undefined,
            },
          ],
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record WhatsApp sale');

      router.push('/admin/orders');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2 border-b border-[#1e2330] pb-4">
        <Link href="/admin/orders" className="text-xs text-[#94a3b8] hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>
      </div>

      <div className="bg-[#151821] border border-[#262b3d] p-6 sm:p-8 rounded-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Record WhatsApp Sale</h1>
            <p className="text-xs text-[#94a3b8]">
              Log an order arranged on WhatsApp to deduct physical stock and keep financial records.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#cbd5e1]">Customer Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kwesi Manu"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#cbd5e1]">Customer WhatsApp / Phone *</label>
              <input
                type="tel"
                required
                placeholder="e.g. 0541234567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#cbd5e1]">Select Perfume *</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Catalogue Price: GH₵{p.priceInGhs.toFixed(2)} | Stock: {p.stock})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#cbd5e1]">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#cbd5e1]">Agreed Unit Price (GH₵ - optional override)</label>
              <input
                type="number"
                step="0.01"
                placeholder={selectedProd ? String(selectedProd.priceInGhs) : '350.00'}
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#cbd5e1]">Delivery Region</label>
              <select
                value={deliveryRegion}
                onChange={(e) => setDeliveryRegion(e.target.value)}
                className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
              >
                {regions.map((r) => (
                  <option key={r.regionName} value={r.regionName}>
                    {r.regionName} (GH₵{r.baseFeeInGhs.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#cbd5e1]">Delivery Address / Location</label>
              <input
                type="text"
                placeholder="e.g. Dzorwulu, Accra"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="p-3 bg-[#0d0e12] border border-[#262b3d] rounded-xl flex justify-between items-center text-sm font-bold">
            <span className="text-[#94a3b8]">Recorded Total:</span>
            <span className="text-[#d4af37] text-base">GH₵{total.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-black text-xs transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Recording...' : 'Record Sale & Deduct Physical Stock'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
