'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatGhs, generateWhatsAppOrderUrl } from '@/lib/currency';
import { MessageCircle, ShoppingBag, Share2, Check, MapPin, Sparkles } from 'lucide-react';

interface ProductClientActionsProps {
  product: {
    id: string;
    name: string;
    brandName?: string;
    priceInGhs: number;
    size?: string;
    imageUrl?: string;
    stock: number;
    slug: string;
  };
  whatsappNumber: string;
  regions: Array<{ regionName: string; baseFeeInGhs: number; estimatedDays: string }>;
  onlineCheckoutEnabled: boolean;
}

export default function ProductClientActions({
  product,
  whatsappNumber,
  regions,
  onlineCheckoutEnabled,
}: ProductClientActionsProps) {
  const { addItem } = useCart();
  const [selectedRegion, setSelectedRegion] = useState(regions[0]?.regionName || 'Greater Accra (Accra & Tema)');
  const [copied, setCopied] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const currentRegionInfo = regions.find((r) => r.regionName === selectedRegion) || regions[0];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      brand: product.brandName,
      priceInGhs: product.priceInGhs,
      quantity: 1,
      size: product.size,
      imageUrl: product.imageUrl,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappUrl = generateWhatsAppOrderUrl({
    phone: whatsappNumber,
    productName: product.name,
    priceInGhs: product.priceInGhs,
    variantSize: product.size,
    customerRegion: selectedRegion,
  });

  return (
    <div className="space-y-6">
      {/* Price Display */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#94a3b8]">Curated Price</span>
        <div className="font-serif-luxury text-4xl sm:text-5xl font-medium gold-gradient-text">
          {formatGhs(product.priceInGhs)}
        </div>
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              isOutOfStock ? 'bg-red-500' : 'bg-emerald-400'
            }`}
          />
          <span className="text-[#cbd5e1] font-light">
            {isOutOfStock
              ? 'Currently allocated - Chat with seller on WhatsApp to reserve next batch'
              : `In Vault (${product.stock} bottle${product.stock === 1 ? '' : 's'} available in Ghana)`}
          </span>
        </div>
      </div>

      {/* Region Selector for delivery calculation */}
      <div className="glass-luxury p-5 rounded-2xl space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Select Ghana Delivery Location</span>
        </label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="w-full bg-[#07080b] border border-[#d4af37]/30 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#d4af37]"
        >
          {regions.map((r) => (
            <option key={r.regionName} value={r.regionName}>
              {r.regionName} — Est. Delivery: {formatGhs(r.baseFeeInGhs)} ({r.estimatedDays})
            </option>
          ))}
        </select>
        {currentRegionInfo && (
          <p className="text-[11px] text-[#94a3b8] font-light">
            Estimated dispatch to {selectedRegion}: <span className="text-[#f5e4ab] font-medium">{currentRegionInfo.estimatedDays}</span>.
          </p>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-3.5">
        {/* WhatsApp Order Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#25D366]/20"
        >
          <MessageCircle className="w-4 h-4 fill-black" />
          <span>Order on WhatsApp ({formatGhs(product.priceInGhs)})</span>
        </a>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full font-bold text-xs uppercase tracking-wider transition-all border ${
            addedToCart
              ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
              : 'bg-[#131622] hover:bg-[#1c2130] border-[#d4af37]/35 text-[#f1f5f9]'
          } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {addedToCart ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag / Combine Items'}</span>
            </>
          )}
        </button>
      </div>

      {/* Social Share & Copy Link */}
      <div className="flex items-center justify-between pt-4 border-t border-[#d4af37]/15 text-xs text-[#94a3b8]">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] uppercase tracking-wider">Share perfume:</span>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Check out ${product.name} on LIKEM Fragrances: ${
                typeof window !== 'undefined' ? window.location.href : ''
              }`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 rounded-full transition-colors"
            title="Share to WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-[#0d0f17] hover:bg-[#181c28] rounded-full border border-[#d4af37]/25 text-white text-[11px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        <div className="text-[10px] tracking-widest uppercase text-[#64748b]">
          SKU: {product.slug.toUpperCase()}
        </div>
      </div>

      {/* Sticky Bottom Action Bar on Mobile Viewports */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#07080b]/95 backdrop-blur-xl border-t border-[#d4af37]/30 p-3.5 shadow-2xl flex items-center gap-3">
        <div className="flex-1">
          <div className="text-[9px] uppercase tracking-wider text-[#94a3b8]">Price</div>
          <div className="font-serif-luxury text-xl font-medium text-[#d4af37]">
            {formatGhs(product.priceInGhs)}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="p-3 rounded-full bg-[#131622] border border-[#d4af37]/30 text-white shrink-0"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-full bg-[#25D366] text-black font-extrabold text-xs uppercase tracking-wider shadow-md"
        >
          <MessageCircle className="w-4 h-4 fill-black" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
