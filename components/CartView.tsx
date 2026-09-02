'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatGhs, generateWhatsAppCartUrl } from '@/lib/currency';
import { Trash2, Plus, Minus, MessageCircle, CreditCard, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartViewProps {
  whatsappNumber: string;
  onlineCheckoutEnabled: boolean;
  regions: Array<{ regionName: string; baseFeeInGhs: number; estimatedDays: string }>;
}

export default function CartView({ whatsappNumber, onlineCheckoutEnabled, regions }: CartViewProps) {
  const { items, removeItem, updateQuantity, clearCart, subtotalInGhs, totalItems } = useCart();
  const [selectedRegion, setSelectedRegion] = useState(regions[0]?.regionName || 'Greater Accra (Accra & Tema)');
  const [checkoutMode, setCheckoutMode] = useState<'WHATSAPP' | 'ONLINE'>('WHATSAPP');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const currentRegion = regions.find((r) => r.regionName === selectedRegion) || regions[0];
  const deliveryFee = currentRegion ? currentRegion.baseFeeInGhs : 30;
  const grandTotal = subtotalInGhs + deliveryFee;

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    const url = generateWhatsAppCartUrl({
      phone: whatsappNumber,
      items: items.map((i) => ({
        name: i.name,
        size: i.size,
        price: i.priceInGhs,
        quantity: i.quantity,
      })),
      deliveryRegion: selectedRegion,
      deliveryFee: deliveryFee,
      total: grandTotal,
    });

    window.open(url, '_blank');
  };

  const handleOnlineCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!guestName.trim() || !guestPhone.trim() || !deliveryAddress.trim()) {
      setErrorMessage('Please provide your name, phone number, and delivery address.');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName,
          guestPhone,
          deliveryAddress,
          deliveryRegion: selectedRegion,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            variantId: i.variantId,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize order');
      }

      clearCart();
      setOrderSuccess(data.orderNumber);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white">Order Confirmed!</h1>
        <p className="text-sm text-[#cbd5e1]">
          Thank you, <span className="font-bold text-white">{guestName}</span>. Your order reference is{' '}
          <span className="text-[#d4af37] font-mono font-bold">{orderSuccess}</span>.
        </p>
        <p className="text-xs text-[#94a3b8]">
          We will contact you directly via phone (<span className="text-white">{guestPhone}</span>) or WhatsApp to confirm your dispatch to <span className="text-white">{deliveryAddress}, {selectedRegion}</span>.
        </p>
        <div className="pt-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] text-black font-bold text-sm rounded-xl"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Your Cart is Empty</h1>
        <p className="text-sm text-[#94a3b8]">
          Explore our perfume selection and find your signature fragrance.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] text-black font-bold text-sm rounded-xl"
          >
            <span>Browse Fragrances</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-black text-white">Shopping Cart ({totalItems} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart items list */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#151821] border border-[#262b3d] rounded-2xl overflow-hidden divide-y divide-[#1e2330]">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="p-4 sm:p-5 flex gap-4 items-center">
                {item.imageUrl && (
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-[#0d0e12] shrink-0 border border-[#262b3d]">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">{item.name}</h3>
                  <div className="text-xs text-[#94a3b8]">
                    {item.size || '100ml'} {item.brand ? `• ${item.brand}` : ''}
                  </div>
                  <div className="text-sm font-black text-[#d4af37]">
                    {formatGhs(item.priceInGhs)} each
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#262b3d] rounded-lg bg-[#0d0e12]">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                      className="p-1.5 text-[#94a3b8] hover:text-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                      className="p-1.5 text-[#94a3b8] hover:text-white"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="p-2 text-[#ef4444] hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-[#94a3b8] hover:text-[#ef4444] transition-colors"
          >
            Clear shopping cart
          </button>
        </div>

        {/* Order Summary & Mode Selection */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#151821] border border-[#262b3d] rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-[#1e2330] pb-3">
              Order Summary
            </h2>

            {/* Region Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#cbd5e1] uppercase tracking-wider block">
                Destination Region (Ghana)
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              >
                {regions.map((r) => (
                  <option key={r.regionName} value={r.regionName}>
                    {r.regionName} (+{formatGhs(r.baseFeeInGhs)})
                  </option>
                ))}
              </select>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-sm border-t border-[#1e2330] pt-4">
              <div className="flex justify-between text-[#94a3b8]">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-white font-semibold">{formatGhs(subtotalInGhs)}</span>
              </div>
              <div className="flex justify-between text-[#94a3b8]">
                <span>Est. Delivery ({selectedRegion})</span>
                <span className="text-white font-semibold">{formatGhs(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white border-t border-[#262b3d] pt-3">
                <span>Estimated Total</span>
                <span className="text-[#d4af37] text-xl">{formatGhs(grandTotal)}</span>
              </div>
            </div>

            {/* Mode A / Mode B Selection */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#0d0e12] rounded-xl border border-[#262b3d]">
                <button
                  type="button"
                  onClick={() => setCheckoutMode('WHATSAPP')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    checkoutMode === 'WHATSAPP'
                      ? 'bg-[#25D366] text-black shadow-md'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Order</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCheckoutMode('ONLINE')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    checkoutMode === 'ONLINE'
                      ? 'bg-[#d4af37] text-black shadow-md'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Website Order</span>
                </button>
              </div>

              {/* Action content based on selected mode */}
              {checkoutMode === 'WHATSAPP' ? (
                <div className="space-y-3">
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    Clicking below will format your full order details and open WhatsApp directly with the seller to confirm payment and dispatch arrangements.
                  </p>
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-black text-base shadow-lg transition-all"
                  >
                    <MessageCircle className="w-5 h-5 fill-black" />
                    <span>Send Order via WhatsApp ({formatGhs(grandTotal)})</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleOnlineCheckout} className="space-y-3">
                  {errorMessage && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg">
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs text-[#cbd5e1]">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ama Mensah"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-[#cbd5e1]">Phone Number (Ghana MoMo / Contact) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0502547133"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-[#cbd5e1]">Delivery Address / Landmark *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. East Legon, near American House, Accra"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#d4af37] hover:bg-[#c29d2b] text-black font-black text-sm transition-all disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing Order...' : `Confirm Order (${formatGhs(grandTotal)})`}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
