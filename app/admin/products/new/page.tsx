'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, CheckCircle, AlertCircle, Sparkles, Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';

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
  const [status, setStatus] = useState('PUBLISHED');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Photo upload states
  const [mediaId, setMediaId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload photo');

      setMediaId(data.media.id);
      setPreviewUrl(data.media.url);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setMediaId(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          brandName,
          priceInGhs,
          stock,
          size,
          concentration,
          gender,
          shortDescription,
          status,
          mediaId,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create perfume');

      setResult({ type: 'success', message: `"${data.product.name}" created successfully!` });

      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
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
          Add a perfume to your catalog, upload its photo, and set inventory & pricing.
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
          {result.type === 'success' && <span className="ml-1 text-[#94a3b8]">Redirecting to product list…</span>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#151821] border border-[#262b3d] rounded-2xl p-6 shadow-xl">
        {/* Photo Upload Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#d4af37] block uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" />
            <span>Perfume Photo / Image</span>
          </label>

          {previewUrl ? (
            <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-[#d4af37]/50 bg-[#0d0e12] group">
              <img src={previewUrl} alt="Perfume preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 bg-black/80 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="relative border-2 border-dashed border-[#262b3d] hover:border-[#d4af37]/60 bg-[#0d0e12] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-xs text-[#d4af37]">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Uploading image...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-[#151821] flex items-center justify-center text-[#94a3b8] group-hover:text-[#d4af37] transition-colors">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-white block group-hover:text-[#d4af37] transition-colors">
                      Click to upload perfume photo
                    </span>
                    <span className="text-[11px] text-[#64748b]">JPG, PNG, or WebP (Max 10MB)</span>
                  </div>
                </>
              )}
            </label>
          )}

          {uploadError && <p className="text-xs text-red-400 font-medium">{uploadError}</p>}
        </div>

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
              onClick={() => setStatus('PUBLISHED')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                status === 'PUBLISHED'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                  : 'bg-[#151821] text-[#64748b] border-[#262b3d] hover:border-[#374151]'
              }`}
            >
              Published — Live on store
            </button>
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
          </div>
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
    </div>
  );
}
