'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { formatGhs } from '@/lib/currency';
import { useCart } from '@/context/CartContext';
import { getWishlist, toggleWishlist, WISHLIST_EVENT } from '@/components/WishlistButton';
import { WhatsAppIcon } from '@/components/SocialIcons';

interface SerializedProduct {
  id: string;
  name: string;
  slug: string;
  priceInGhs: number;
  brandName: string;
  size: string;
  concentration: string;
  gender: string;
  isPublished: boolean;
  imageUrl: string;
}

interface WishlistViewProps {
  products: SerializedProduct[];
  whatsappNumber: string;
}

export default function WishlistView({ products, whatsappNumber }: WishlistViewProps) {
  const { addItem } = useCart();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const waNum = whatsappNumber.replace(/[^0-9]/g, '');

  useEffect(() => {
    setWishlistIds(getWishlist());
    setLoaded(true);

    const handleUpdate = () => {
      setWishlistIds(getWishlist());
    };

    window.addEventListener(WISHLIST_EVENT, handleUpdate);
    return () => window.removeEventListener(WISHLIST_EVENT, handleUpdate);
  }, []);

  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleRemove = (id: string) => {
    toggleWishlist(id);
  };

  const handleAddToCart = (product: SerializedProduct) => {
    addItem({
      productId: product.id,
      name: product.name,
      priceInGhs: product.priceInGhs,
      imageUrl: product.imageUrl,
      size: product.size,
      brand: product.brandName,
      quantity: 1,
    });
    setAddedNotice(`Added "${product.name}" to shopping bag!`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  if (!loaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#d4af37]/30 border-t-[#d4af37] animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#d4af37]/15 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 section-label">
            <Heart className="w-3 h-3 fill-red-500 text-red-500" />
            <span>Personal Fragrance Vault</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-white">
            My Wishlist ({savedProducts.length})
          </h1>
          <p className="text-xs text-[#94a3b8] font-light">
            Perfumes you have favorited while browsing. Tap to add to bag or order directly on WhatsApp.
          </p>
        </div>

        {savedProducts.length > 0 && (
          <Link
            href="/products"
            className="text-xs text-[#f5e4ab] hover:text-[#d4af37] transition-colors"
          >
            + Browse more fragrances
          </Link>
        )}
      </div>

      {/* Added notice toast */}
      {addedNotice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
          <span>{addedNotice}</span>
          <Link href="/cart" className="font-bold underline text-white">
            View Bag
          </Link>
        </div>
      )}

      {/* Empty state */}
      {savedProducts.length === 0 ? (
        <div className="max-w-md mx-auto py-20 text-center space-y-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto bg-red-500/10 border border-red-500/20 text-red-400">
            <Heart className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-light text-white">
              No Saved Fragrances Yet
            </h2>
            <p className="text-xs text-[#94a3b8] font-light leading-relaxed">
              While browsing our collection, tap the heart (❤️) icon on any perfume bottle to save it here for later!
            </p>
          </div>
          <Link
            href="/products"
            className="btn-gold-luxury inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Perfumes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        /* Saved products grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {savedProducts.map((p) => (
            <div
              key={p.id}
              className="glass-luxury-card rounded-xl sm:rounded-2xl overflow-hidden flex flex-col group relative"
            >
              {/* Image */}
              <div className="relative overflow-hidden bg-[#080a10] block" style={{ aspectRatio: '4/5' }}>
                <Link href={`/products/${p.slug}`} className="block w-full h-full">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/80 via-transparent to-transparent opacity-60" />
                </Link>

                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[7px] sm:text-[9px] uppercase font-bold tracking-wide px-2 sm:px-3 py-0.5 rounded-full bg-[#080a10]/80 text-[#d4af37] border border-[#d4af37]/35 backdrop-blur-md pointer-events-none z-10">
                  {p.brandName}
                </span>

                {/* Remove heart button */}
                <button
                  type="button"
                  onClick={() => handleRemove(p.id)}
                  aria-label="Remove from wishlist"
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-500 flex items-center justify-center transition-all shadow-md active:scale-90"
                  title="Remove from wishlist"
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </button>
              </div>

              {/* Info */}
              <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="text-[8px] sm:text-[10px] uppercase tracking-wide text-[#94a3b8]">
                    {p.gender} · {p.size}
                  </div>
                  <Link href={`/products/${p.slug}`}>
                    <h3 className="font-serif-luxury text-base sm:text-xl text-white group-hover:text-[#f5e4ab] transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                  </Link>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#d4af37]/15">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[8px] sm:text-[10px] uppercase tracking-wide text-[#94a3b8]">Price</span>
                    <span className="text-sm sm:text-lg font-black text-[#d4af37]">
                      {p.isPublished ? formatGhs(p.priceInGhs) : 'Inquire'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(p)}
                      className="py-2 px-2 bg-[#161a26] hover:bg-[#202535] text-[#f1f5f9] text-[9px] sm:text-xs font-semibold rounded-lg sm:rounded-xl transition-colors border border-[#d4af37]/20 flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Bag</span>
                    </button>
                    <a
                      href={`https://wa.me/${waNum}?text=${encodeURIComponent(
                        p.isPublished
                          ? `Hello! I have *${p.name}* on my wishlist and would like to order it for ${formatGhs(p.priceInGhs)}.`
                          : `Hello! I would like to inquire about *${p.name}* on my wishlist.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 py-2 px-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-[9px] sm:text-xs font-bold rounded-lg sm:rounded-xl border border-[#25D366]/35 transition-colors"
                    >
                      <WhatsAppIcon className="w-3 h-3 flex-shrink-0" />
                      <span>Order</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
