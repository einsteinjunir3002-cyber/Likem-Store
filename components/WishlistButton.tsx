'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface WishlistButtonProps {
  productId: string;
  productName?: string;
  className?: string;
}

export const WISHLIST_STORAGE_KEY = 'likem_wishlist';
export const WISHLIST_EVENT = 'likem_wishlist_updated';

export function getWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleWishlist(productId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getWishlist();
    let updated: string[];
    let isNowSaved = false;

    if (current.includes(productId)) {
      updated = current.filter((id) => id !== productId);
      isNowSaved = false;
    } else {
      updated = [...current, productId];
      isNowSaved = true;
    }

    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: { updated, productId, isNowSaved } }));
    return isNowSaved;
  } catch {
    return false;
  }
}

export default function WishlistButton({
  productId,
  productName,
  className = '',
}: WishlistButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const current = getWishlist();
    setIsSaved(current.includes(productId));

    const handleUpdate = () => {
      const updated = getWishlist();
      setIsSaved(updated.includes(productId));
    };

    window.addEventListener(WISHLIST_EVENT, handleUpdate);
    return () => window.removeEventListener(WISHLIST_EVENT, handleUpdate);
  }, [productId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextState = toggleWishlist(productId);
    setIsSaved(nextState);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 600);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isSaved ? `Remove ${productName || 'perfume'} from wishlist` : `Add ${productName || 'perfume'} to wishlist`}
      title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist (Love)'}
      className={`relative z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-md active:scale-90 ${
        isSaved
          ? 'bg-red-500/20 border border-red-500/40 text-red-500 hover:bg-red-500/30'
          : 'bg-[#050508]/60 hover:bg-[#050508]/90 border border-white/15 text-white/75 hover:text-white'
      } ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-300 ${
          isSaved ? 'fill-red-500 text-red-500 scale-110' : 'text-white/85'
        } ${animate ? 'scale-125' : ''}`}
      />
    </button>
  );
}
