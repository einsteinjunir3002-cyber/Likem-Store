'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatGhs, generateWhatsAppCartUrl } from '@/lib/currency';
import { Trash2, Plus, Minus, CreditCard, ArrowRight, ShieldCheck, ShoppingBag, Sparkles, Heart } from 'lucide-react';
import { WhatsAppIcon } from '@/components/SocialIcons';

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
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="badge-gold mx-auto">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          <span>The Likem Perfumery</span>
        </div>
        <h1 className="font-serif-luxury text-4xl font-normal text-white">Order Confirmed!</h1>
        <p className="text-sm text-[#cbd5e1]">
          Thank you, <span className="font-bold text-white">{guestName}</span>. Your order reference is{' '}
          <span className="text-[#d4af37] font-mono font-bold">{orderSuccess}</span>.
        </p>
        <p className="text-xs text-[#94a3b8] leading-relaxed max-w-md mx-auto">
          We will contact you directly via phone (<span className="text-white">{guestPhone}</span>) or WhatsApp to confirm dispatch to <span className="text-white">{deliveryAddress}, {selectedRegion}</span>.
        </p>
        <div className="pt-4">
          <Link
            href="/products"
            className="btn-gold-luxury inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs"
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
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto glass-luxury text-[#d4af37]">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif-luxury text-3xl font-light text-white">Your Bag is Empty</h2>
          <p className="text-xs text-[#94a3b8] font-light leading-relaxed">
            Discover our luxury fragrances from Lattafa, French, and Arabian houses.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/products"
            className="btn-gold-luxury inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs"
          >
            <span>Explore Fragrances</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/wishlist"
            className="btn-outline-luxury inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs text-[#f5e4ab]"
          >
            <Heart className="w-3.5 h-3.5 text-red-400" />
            <span>View Wishlist</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <span className="section-label">Your Selection</span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-white">
          Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

        {/* ── Cart items list ── */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-luxury rounded-2xl overflow-hidden divide-y divide-[#d4af37]/10">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="p-3 sm:p-5 flex gap-3 sm:gap-4 items-center"
              >
                {/* Fixed-dimension, non-overflowing thumbnail */}
                {item.imageUrl ? (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] sm:min-w-[80px] sm:min-h-[80px] sm:max-w-[80px] sm:max-h-[80px] rounded-xl overflow-hidden bg-[#080a10] shrink-0 border border-[#d4af37]/20 relative aspect-square">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] sm:min-w-[80px] sm:min-h-[80px] sm:max-w-[80px] sm:max-h-[80px] rounded-xl bg-[#080a10] shrink-0 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                )}

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
                  <h3 className="font-serif-luxury text-sm sm:text-lg font-normal text-white truncate">
                    {item.name}
                  </h3>
                  <div className="text-[10px] sm:text-xs text-[#94a3b8] truncate">
                    {item.size || '100ml'} {item.brand ? `· ${item.brand}` : ''}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#d4af37]">
                    {formatGhs(item.priceInGhs)} each
                  </div>
                </div>

                {/* Quantity & Remove controls */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 shrink-0">
                  <div className="flex items-center border border-[#d4af37]/25 rounded-lg bg-[#080a10]/80">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                      className="p-1 sm:p-1.5 text-[#94a3b8] hover:text-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 sm:w-8 text-center text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                      className="p-1 sm:p-1.5 text-[#94a3b8] hover:text-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="p-1.5 sm:p-2 text-[#ef4444] hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={clearCart}
              className="text-[11px] text-[#94a3b8] hover:text-[#ef4444] transition-colors"
            >
              Clear shopping bag
            </button>
            <Link
              href="/products"
              className="text-[11px] text-[#d4af37] hover:underline"
            >
              + Add more fragrances
            </Link>
          </div>
        </div>

        {/* ── Order Summary & Dispatch Details ── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-luxury rounded-2xl p-5 sm:p-7 space-y-6">
            <h2 className="font-serif-luxury text-xl font-normal text-white border-b border-[#d4af37]/15 pb-3">
              Order Summary
            </h2>

            {/* Region Selection */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-[#cbd5e1] tracking-wider block">
                Destination Region (Ghana)
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-[#080a10] border border-[#d4af37]/25 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                {regions.map((r) => (
                  <option key={r.regionName} value={r.regionName}>
                    {r.regionName} (+{formatGhs(r.baseFeeInGhs)})
                  </option>
                ))}
              </select>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs border-t border-[#d4af37]/15 pt-4">
              <div className="flex justify-between text-[#94a3b8]">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                <span className="text-white font-semibold">{formatGhs(subtotalInGhs)}</span>
              </div>
              <div className="flex justify-between text-[#94a3b8]">
                <span className="truncate pr-2">Est. Dispatch ({selectedRegion})</span>
                <span className="text-white font-semibold shrink-0">{formatGhs(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white border-t border-[#d4af37]/15 pt-3">
                <span>Estimated Total</span>
                <span className="text-[#d4af37] text-lg sm:text-xl font-black">{formatGhs(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Mode Toggle */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#080a10] rounded-xl border border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => setCheckoutMode('WHATSAPP')}
                  className={`py-2.5 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    checkoutMode === 'WHATSAPP'
                      ? 'bg-[#25D366] text-black shadow-md'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCheckoutMode('ONLINE')}
                  className={`py-2.5 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    checkoutMode === 'ONLINE'
                      ? 'bg-[#d4af37] text-black shadow-md'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Online Form</span>
                </button>
              </div>

              {/* Mode Content */}
              {checkoutMode === 'WHATSAPP' ? (
                <div className="space-y-3">
                  <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                    Clicking below will format your order items and open WhatsApp directly with our concierge to confirm delivery and payment.
                  </p>
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-[#25D366] hover:brightness-110 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all"
                  >
                    <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
                    <span>Order via WhatsApp ({formatGhs(grandTotal)})</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleOnlineCheckout} className="space-y-3">
                  {errorMessage && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#cbd5e1]">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ama Mensah"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full input-luxury rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#cbd5e1]">Phone Number (Ghana) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0502547133"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full input-luxury rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#cbd5e1]">Delivery Address / Landmark *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. East Legon, near American House, Accra"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full input-luxury rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full btn-gold-luxury py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all disabled:opacity-50"
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
