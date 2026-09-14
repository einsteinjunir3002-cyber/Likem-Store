'use client';

import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export default function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      router.refresh();
    } catch {
      alert('Failed to delete product. Try again.');
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-2 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold transition-colors disabled:opacity-60 flex items-center gap-1 whitespace-nowrap"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          {loading ? 'Deleting…' : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 rounded-lg bg-[#1e2330] text-[#94a3b8] hover:text-white text-[10px] font-bold transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Delete ${productName}`}
      className="p-1.5 text-[#475569] hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
