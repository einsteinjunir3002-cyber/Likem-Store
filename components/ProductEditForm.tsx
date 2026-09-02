'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Check } from 'lucide-react';
import Link from 'next/link';

interface ProductFormProps {
  product: {
    id: string;
    name: string;
    brandName?: string;
    priceInGhs: number;
    stock: number;
    size?: string;
    concentration?: string;
    gender?: string;
    shortDescription?: string;
    status: string;
    imageUrl?: string;
  };
}

export default function ProductEditForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(product.name);
  const [brandName, setBrandName] = useState(product.brandName || '');
  const [priceInGhs, setPriceInGhs] = useState(String(product.priceInGhs || ''));
  const [stock, setStock] = useState(String(product.stock || '0'));
  const [size, setSize] = useState(product.size || '100ml');
  const [concentration, setConcentration] = useState(product.concentration || 'Eau De Parfum');
  const [gender, setGender] = useState(product.gender || 'Unisex');
  const [shortDescription, setShortDescription] = useState(product.shortDescription || '');
  const [status, setStatus] = useState(product.status);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          brandName,
          priceInGhs: parseFloat(priceInGhs) || 0,
          stock: parseInt(stock, 10) || 0,
          size,
          concentration,
          gender,
          shortDescription,
          status,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update perfume details');
      }

      setMessage('Perfume updated successfully!');
      router.refresh();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between border-b border-[#1e2330] pb-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <span className="text-xs text-[#d4af37] font-mono font-bold">
          ID: {product.id.slice(0, 8)}
        </span>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Image preview & status */}
        <div className="md:col-span-4 space-y-4">
          <div className="aspect-square bg-[#151821] border border-[#262b3d] rounded-2xl overflow-hidden p-2">
            <img
              src={product.imageUrl || '/uploads/perfumes/perfume_db293e4b7fc0.jpeg'}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="bg-[#151821] p-4 rounded-xl border border-[#262b3d] space-y-2">
            <label className="text-xs font-bold text-white uppercase block">
              Publication Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
            >
              <option value="DRAFT">DRAFT (Hidden from Public)</option>
              <option value="PUBLISHED">PUBLISHED (Live on Store)</option>
            </select>
            <p className="text-[11px] text-[#64748b]">
              Only published perfumes appear on the customer storefront.
            </p>
          </div>
        </div>

        {/* Right: Editable Fields */}
        <div className="md:col-span-8 space-y-4 bg-[#151821] border border-[#262b3d] p-6 rounded-2xl">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#cbd5e1]">Perfume Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#cbd5e1]">Brand / Perfume House</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Lattafa, Afnan, Fragrance World"
                className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#d4af37]">Price in Ghana Cedis (GH₵) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={priceInGhs}
                onChange={(e) => setPriceInGhs(e.target.value)}
                placeholder="e.g. 350.00"
                className="w-full bg-[#0d0e12] border border-[#d4af37] rounded-lg p-2.5 text-sm font-black text-[#d4af37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#cbd5e1]">Physical Stock *</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#cbd5e1]">Bottle Size</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#cbd5e1]">Target Audience</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2 text-xs text-white"
              >
                <option value="Unisex">Unisex</option>
                <option value="Women">Women</option>
                <option value="Men">Men</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#cbd5e1]">Short Description</label>
            <textarea
              rows={3}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#c29d2b] text-black font-bold text-xs rounded-xl transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Perfume & Update Catalog'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
