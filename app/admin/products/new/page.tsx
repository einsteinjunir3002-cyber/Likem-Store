'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const FIELD = ({ label, highlight, children }: { label: string; highlight?: boolean; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className={`text-xs font-bold block ${highlight ? 'text-[#d4af37]' : 'text-[#cbd5e1]'}`}>{label}</label>
    {children}
  </div>
);

const INPUT_CLS = 'w-full bg-[#0d0e12] border border-[#262b3d] rounded-xl p-2.5 text-sm text-white placeholder-[#475569] focus:border-[#d4af37] focus:outline-none transition-colors';
const GOLD_INPUT_CLS = 'w-full bg-[#0d0e12] border border-[#d4af37]/60 rounded-xl p-2.5 text-sm font-black text-[#d4af37] placeholder-[#64748b] focus:border-[#d4af37] focus:outline-none transition-colors';

export default function AddNewPerfumePage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [priceInGhs, setPriceInGhs] = useState('');
  const [stock, setStock] = useState('');
  const [size, setSize] = useState('100ml');
  const [concentration, setConcentration] = useState('Eau De Parfum');
  const [gender, setGender] = useState('Unisex');
  const [shortDescription, setShortDescription] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, brandName, priceInGhs, stock, size, concentration, gender, shortDescription, status }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create perfume');

      setResult({ type: 'success', message: `"${data.product.name}" added successfully!` });

      // Redirect to edit page after 1.2s so user can add image
      setTimeout(() => {
        router.push(`/admin/products/edit/${data.product.id}`);
      }, 1200);
    } catch (err: any) {
      setResult({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1e2330] pb-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-[#d4af37] font-bold">
          <Sparkles className="w-4 h-4" />
          <span>New Perfume</span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-black text-white">Add New Perfume</h1>
        <p className="text-xs text-[#94a3b8] mt-1">
          Fill in the details below. You can add a photo from the Media Library after saving.
        </p>
      </div>

      {/* Result Banner */}
      {result && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold border ${
            result.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {result.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{result.message}</span>
          {result.type === 'success' && <span className="ml-1 text-[#94a3b8]">Redirecting to edit page…</span>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-[#151821] border border-[#262b3d] rounded-2xl p-6 shadow-xl">

        {/* Perfume Name */}
        <FIELD label="Perfume Name *">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Petra, Tharwah Gold, 9PM Rebel"
            className={INPUT_CLS}
          />
        </FIELD>

        {/* Brand + Price row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FIELD label="Brand / Perfume House">
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Lattafa, Afnan, Fragrance World"
              className={INPUT_CLS}
            />
          </FIELD>
          <FIELD label="Price in Ghana Cedis (GH₵) *" highlight>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={priceInGhs}
              onChange={(e) => setPriceInGhs(e.target.value)}
              placeholder="e.g. 350.00"
              className={GOLD_INPUT_CLS}
            />
          </FIELD>
        </div>

        {/* Stock + Size + Gender row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FIELD label="Physical Stock (units) *">
            <input
              type="number"
              min="0"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="e.g. 5"
              className={INPUT_CLS}
            />
          </FIELD>
          <FIELD label="Bottle Size">
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g. 100ml, 50ml"
              className={INPUT_CLS}
            />
          </FIELD>
          <FIELD label="Target Audience">
            <select value={gender} onChange={(e) => setGender(e.target.value)} className={INPUT_CLS}>
              <option value="Unisex">Unisex</option>
              <option value="Women">Women</option>
              <option value="Men">Men</option>
            </select>
          </FIELD>
        </div>

        {/* Concentration */}
        <FIELD label="Concentration / Type">
          <select value={concentration} onChange={(e) => setConcentration(e.target.value)} className={INPUT_CLS}>
            <option>Eau De Parfum</option>
            <option>Eau De Toilette</option>
            <option>Parfum / Extrait</option>
            <option>Eau De Cologne</option>
            <option>Body Mist</option>
            <option>Oil Perfume</option>
          </select>
        </FIELD>

        {/* Short Description */}
        <FIELD label="Short Description (shown on product page)">
          <textarea
            rows={3}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Describe the scent profile, occasion, or key notes…"
            className={INPUT_CLS + ' resize-none'}
          />
        </FIELD>

        {/* Status */}
        <div className="bg-[#0d0e12] border border-[#262b3d] rounded-xl p-4 space-y-2">
          <label className="text-xs font-bold text-white block">Publication Status</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStatus('DRAFT')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                status === 'DRAFT'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                  : 'bg-[#151821] text-[#64748b] border-[#262b3d] hover:border-[#374151]'
              }`}
            >
              Draft — Hidden from public
            </button>
            <button
              type="button"
              onClick={() => setStatus('PUBLISHED')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                status === 'PUBLISHED'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                  : 'bg-[#151821] text-[#64748b] border-[#262b3d] hover:border-[#374151]'
              }`}
            >
              Published — Live on store
            </button>
          </div>
          <p className="text-[11px] text-[#64748b]">
            You can publish anytime. Only published perfumes appear to customers.
          </p>
        </div>

        {/* Submit */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#c29d2b] text-black font-black text-xs rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Creating Perfume…' : 'Create Perfume & Save'}</span>
          </button>
          <Link
            href="/admin/products"
            className="px-5 py-3 rounded-xl bg-[#1e2330] text-[#94a3b8] hover:text-white text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Info note */}
      <div className="bg-[#0d0e12] border border-[#262b3d] rounded-xl p-4 text-xs text-[#64748b] space-y-1">
        <p className="font-bold text-[#94a3b8]">💡 After saving:</p>
        <p>You'll be taken to the Edit page where you can assign a photo from your Media Library.</p>
      </div>
    </div>
  );
}
