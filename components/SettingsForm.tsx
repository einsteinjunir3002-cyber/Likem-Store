'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Palette, Sparkles, RefreshCw, Eye, ShieldCheck, Sun, Moon, CheckCircle2 } from 'lucide-react';
import { THEME_PRESETS, SIMPLE_BACKGROUNDS, SIMPLE_ACCENTS, isLightColor } from '@/lib/theme';
import { broadcastThemeChange } from '@/components/ThemeProvider';

interface SettingsFormProps {
  settings: {
    storeName: string;
    tagline: string;
    phoneContact: string;
    whatsappNumber: string;
    snapchatHandle?: string;
    onlineCheckoutEnabled: boolean;
    deliveryNotice: string;
    themePreset?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    cardColor?: string;
  };
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  // Store info
  const [storeName, setStoreName] = useState(settings.storeName || 'The Likem Perfumery');
  const [tagline, setTagline] = useState(settings.tagline || '');
  const [phoneContact, setPhoneContact] = useState(settings.phoneContact || '0502547133');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '+233502547133');
  const [snapchatHandle, setSnapchatHandle] = useState(settings.snapchatHandle || 'lilitracess');
  const [onlineCheckoutEnabled, setOnlineCheckoutEnabled] = useState(settings.onlineCheckoutEnabled ?? false);
  const [deliveryNotice, setDeliveryNotice] = useState(settings.deliveryNotice || '');

  // Theme & Appearance (Simple non-technical selection)
  const [themePreset, setThemePreset] = useState(settings.themePreset || 'cool-cloud-blue');
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || '#0284c7');
  const [secondaryColor, setSecondaryColor] = useState(settings.secondaryColor || '#38bdf8');
  const [accentColor, setAccentColor] = useState(settings.accentColor || '#0369a1');
  const [backgroundColor, setBackgroundColor] = useState(settings.backgroundColor || '#f0f8ff');
  const [cardColor, setCardColor] = useState(settings.cardColor || '#ffffff');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isCurrentBgLight = isLightColor(backgroundColor);

  // Broadcast theme change whenever colors or preset change for live preview
  useEffect(() => {
    broadcastThemeChange({
      themePreset,
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      cardColor,
    });
  }, [themePreset, primaryColor, secondaryColor, accentColor, backgroundColor, cardColor]);

  // Handle selecting a ready-made theme
  const handleSelectPreset = (presetId: string) => {
    setThemePreset(presetId);
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setPrimaryColor(preset.colors.primary);
      setSecondaryColor(preset.colors.secondary);
      setAccentColor(preset.colors.accent);
      setBackgroundColor(preset.colors.background);
      setCardColor(preset.colors.card);
    }
  };

  // Handle picking a background color by friendly name
  const handleSelectBackground = (swatch: typeof SIMPLE_BACKGROUNDS[0]) => {
    setBackgroundColor(swatch.color);
    setCardColor(swatch.cardColor || '#ffffff');
    setThemePreset('custom');
  };

  // Handle picking an accent color by friendly name
  const handleSelectAccent = (accent: typeof SIMPLE_ACCENTS[0]) => {
    setPrimaryColor(accent.color);
    setSecondaryColor(accent.secondary || accent.color);
    setAccentColor(accent.accent || accent.color);
    setThemePreset('custom');
  };

  // Reset to default Cool Glacier Ice
  const handleResetDefault = () => {
    handleSelectPreset('cool-cloud-blue');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName,
          tagline,
          phoneContact,
          whatsappNumber,
          snapchatHandle,
          onlineCheckoutEnabled,
          deliveryNotice,
          themePreset,
          primaryColor,
          secondaryColor,
          accentColor,
          backgroundColor,
          cardColor,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to update settings');

      setMessage({ type: 'success', text: 'Store settings and colors saved successfully!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setMessage(null), 8000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error updating settings' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      {/* Status banner */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all ${
            message.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
          }`}
        >
          {message.type === 'success' ? <Check className="w-5 h-5 shrink-0" /> : <ShieldCheck className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* ============================================================
          SECTION 1: SIMPLE COLOR & THEME SETTINGS (NON-TECHNICAL)
          ============================================================ */}
      <div className="bg-[#151821] border border-[#262b3d] p-6 sm:p-7 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e2330] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#38bdf8]" />
              <h2 className="text-base font-bold text-white">Store Color Themes</h2>
            </div>
            <p className="text-xs text-[#94a3b8] mt-1">
              Pick a ready-made theme or choose simple colors for your background and buttons. No technical knowledge required.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleResetDefault}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b202e] hover:bg-[#252c3f] border border-[#2e374f] text-[#cbd5e1] hover:text-white rounded-lg text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Cool Ice</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{ backgroundColor: primaryColor }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-white font-bold rounded-lg text-xs transition-all hover:brightness-110 shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Colors'}</span>
            </button>
          </div>
        </div>

        {/* ── PART A: READY-MADE THEMES ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#cbd5e1] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Popular Themes</span>
            </h3>
            <span className="text-[11px] text-[#94a3b8]">Click any style to preview</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {THEME_PRESETS.map((preset) => {
              const isSelected = themePreset === preset.id;
              const isPresetLight = isLightColor(preset.colors.background);

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#38bdf8] bg-[#1a2333] ring-2 ring-[#38bdf8]/40 shadow-lg shadow-black/40'
                      : 'border-[#262b3d] bg-[#0e1017] hover:border-[#38415c] hover:bg-[#131620]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-[#93c5fd] transition-colors truncate">
                        {preset.name}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
                      ) : (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                            isPresetLight
                              ? 'bg-sky-500/20 text-sky-300'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {isPresetLight ? 'Clear' : 'Dark'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#94a3b8] mt-1 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  {/* Visual preview dots with friendly labels */}
                  <div className="mt-3 pt-2.5 border-t border-[#1e2330] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                          style={{ backgroundColor: preset.colors.background }}
                          title="Background Color"
                        />
                        <span className="text-[10px] text-[#64748b]">Page</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                          style={{ backgroundColor: preset.colors.primary }}
                          title="Button & Accent Color"
                        />
                        <span className="text-[10px] text-[#64748b]">Buttons</span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[#38bdf8]">Active</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── PART B: SIMPLE CUSTOM MIX & MATCH ── */}
        <div className="pt-4 border-t border-[#1e2330] space-y-6">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#cbd5e1]">
              Or Mix & Match Your Own Colors (2 Simple Steps)
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* STEP 1: CHOOSE BACKGROUND COLOR */}
            <div className="bg-[#0e1017] p-4 rounded-xl border border-[#262b3d] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center text-[10px] font-black">1</span>
                  <span>Choose Background (Page Canvas)</span>
                </span>
                <span className="text-[10px] text-[#38bdf8] bg-sky-500/10 px-2 py-0.5 rounded-full font-bold border border-sky-500/20">25 options</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
                {SIMPLE_BACKGROUNDS.map((bg) => {
                  const isSelected = backgroundColor.toLowerCase() === bg.color.toLowerCase();
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => handleSelectBackground(bg)}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-[#38bdf8] bg-[#1a2333] text-white ring-1 ring-[#38bdf8]/50 shadow-sm'
                          : 'border-[#262b3d] bg-[#131620] text-[#cbd5e1] hover:border-[#3e4866] hover:bg-[#181c26]'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/30 shadow-inner shrink-0"
                        style={{ backgroundColor: bg.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold truncate leading-tight flex items-center justify-between">
                          <span>{bg.name}</span>
                          {isSelected && <span className="text-[9px] text-[#38bdf8] font-bold">✓</span>}
                        </div>
                        <div className="text-[9px] text-[#64748b] truncate">{bg.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: CHOOSE ACCENT COLOR (BUTTONS & HIGHLIGHTS) */}
            <div className="bg-[#0e1017] p-4 rounded-xl border border-[#262b3d] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center text-[10px] font-black">2</span>
                  <span>Choose Button & Accent Color</span>
                </span>
                <span className="text-[10px] text-[#38bdf8] bg-sky-500/10 px-2 py-0.5 rounded-full font-bold border border-sky-500/20">25 colors</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
                {SIMPLE_ACCENTS.map((accent) => {
                  const isSelected = primaryColor.toLowerCase() === accent.color.toLowerCase();
                  return (
                    <button
                      key={accent.id}
                      type="button"
                      onClick={() => handleSelectAccent(accent)}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-[#38bdf8] bg-[#1a2333] text-white ring-1 ring-[#38bdf8]/50 shadow-sm'
                          : 'border-[#262b3d] bg-[#131620] text-[#cbd5e1] hover:border-[#3e4866] hover:bg-[#181c26]'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/30 shadow-inner shrink-0"
                        style={{ backgroundColor: accent.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold truncate leading-tight flex items-center justify-between">
                          <span>{accent.name}</span>
                          {isSelected && <span className="text-[9px] text-[#38bdf8] font-bold">✓</span>}
                        </div>
                        <div className="text-[9px] text-[#64748b] truncate">{accent.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── PART C: LIVE PREVIEW ── */}
        <div className="pt-4 border-t border-[#1e2330] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#38bdf8]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#cbd5e1]">
                Live Store Preview
              </h3>
            </div>
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${
                isCurrentBgLight
                  ? 'text-sky-800 bg-sky-100 border-sky-300'
                  : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              }`}
            >
              {isCurrentBgLight ? '✨ Lively & Clear Mode Active' : '🌙 Twilight Dark Mode Active'}
            </span>
          </div>

          {/* Simulated Storefront Card */}
          <div
            className="p-5 sm:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden shadow-xl"
            style={{
              backgroundColor: backgroundColor,
              borderColor: `${primaryColor}40`,
            }}
          >
            {/* Ambient radial glow */}
            <div
              className="absolute top-0 right-0 w-44 h-44 rounded-full pointer-events-none blur-3xl opacity-25"
              style={{ backgroundColor: primaryColor }}
            />

            {/* Brand Header */}
            <div
              className="flex items-center justify-between pb-3 border-b"
              style={{ borderColor: isCurrentBgLight ? 'rgba(0,0,0,0.08)' : `${primaryColor}25` }}
            >
              <div
                className="text-xs font-bold tracking-widest uppercase flex items-center gap-1.5"
                style={{ color: primaryColor }}
              >
                <span>◆</span>
                <span>{storeName || 'THE LIKEM PERFUMERY'}</span>
              </div>
              <span
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: isCurrentBgLight ? `${primaryColor}18` : `${primaryColor}15`,
                  color: isCurrentBgLight ? accentColor : secondaryColor,
                  border: `1px solid ${primaryColor}40`,
                }}
              >
                NEW ARRIVAL
              </span>
            </div>

            {/* Sample Product Showcase Card */}
            <div
              className="mt-4 p-4 sm:p-5 rounded-xl border transition-all"
              style={{
                backgroundColor: isCurrentBgLight ? '#ffffff' : cardColor,
                borderColor: isCurrentBgLight ? 'rgba(0,0,0,0.08)' : `${primaryColor}30`,
                boxShadow: isCurrentBgLight
                  ? '0 10px 30px -5px rgba(0,0,0,0.06)'
                  : '0 10px 30px -5px rgba(0,0,0,0.5)',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div
                    className="text-[10px] uppercase tracking-wider font-semibold"
                    style={{ color: isCurrentBgLight ? accentColor : `${primaryColor}bb` }}
                  >
                    Eau De Parfum • 100ml
                  </div>
                  <div
                    className="text-base font-bold mt-0.5 font-serif"
                    style={{ color: isCurrentBgLight ? '#0f172a' : '#ffffff' }}
                  >
                    Khamrah Luxury Oud
                  </div>
                  <div
                    className="text-[11px] mt-0.5"
                    style={{ color: isCurrentBgLight ? '#64748b' : '#94a3b8' }}
                  >
                    Roasted Coffee • Amber • Warm Vanilla Spice
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black" style={{ color: primaryColor }}>
                    GH₵ 650.00
                  </div>
                  <div
                    className="text-[10px] line-through"
                    style={{ color: isCurrentBgLight ? '#94a3b8' : '#64748b' }}
                  >
                    GH₵ 780.00
                  </div>
                </div>
              </div>

              {/* Sample WhatsApp Button */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  className="py-2.5 px-3 rounded-lg text-center text-xs font-bold uppercase tracking-wider shadow-md cursor-default flex items-center justify-center gap-1.5"
                  style={{
                    background: `linear-gradient(135deg, ${secondaryColor} 0%, ${primaryColor} 50%, ${accentColor} 100%)`,
                    color: isCurrentBgLight ? '#ffffff' : '#000000',
                  }}
                >
                  <span>Order via WhatsApp</span>
                </div>

                <div
                  className="py-2 px-3 rounded-lg text-center text-xs font-semibold uppercase tracking-wider cursor-default border flex items-center justify-center"
                  style={{
                    color: isCurrentBgLight ? accentColor : secondaryColor,
                    borderColor: `${primaryColor}40`,
                    backgroundColor: isCurrentBgLight ? '#ffffff' : `${primaryColor}0a`,
                  }}
                >
                  View Details
                </div>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span
                className="text-[11px]"
                style={{ color: isCurrentBgLight ? '#64748b' : '#94a3b8' }}
              >
                {isCurrentBgLight
                  ? 'Your store will display this lively, clear background with crisp readable text.'
                  : 'Your store will display this deep night background with radiant luminous glows.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTION 2: STORE INFORMATION & BRANDING
          ============================================================ */}
      <div className="bg-[#151821] border border-[#262b3d] p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-white border-b border-[#1e2330] pb-2">
          Store Information & Branding
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#cbd5e1]">Business / Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white focus:border-[#38bdf8] outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#cbd5e1]">Brand Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white focus:border-[#38bdf8] outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTION 3: SOCIAL CHANNELS & WHATSAPP
          ============================================================ */}
      <div className="bg-[#151821] border border-[#262b3d] p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-white border-b border-[#1e2330] pb-2">
          Social Channels & Direct Contact
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#cbd5e1]">Direct Phone Line</label>
            <input
              type="text"
              value={phoneContact}
              onChange={(e) => setPhoneContact(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white focus:border-[#38bdf8] outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#25D366]">WhatsApp Business Number</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white focus:border-[#25D366] outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#FFFC00]">Snapchat Handle</label>
            <input
              type="text"
              value={snapchatHandle}
              onChange={(e) => setSnapchatHandle(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white focus:border-[#FFFC00] outline-none"
            />
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTION 4: COMMERCE MODE & DELIVERY
          ============================================================ */}
      <div className="bg-[#151821] border border-[#262b3d] p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-white border-b border-[#1e2330] pb-2">
          Commerce Mode & Notices
        </h2>

        <div className="flex items-center justify-between p-3.5 bg-[#0d0e12] border border-[#262b3d] rounded-xl">
          <div>
            <div className="font-bold text-xs text-white">Enable Full Website Checkout</div>
            <div className="text-[11px] text-[#94a3b8]">
              When disabled, customers primarily order through direct WhatsApp checkout with prefilled carts.
            </div>
          </div>
          <input
            type="checkbox"
            checked={onlineCheckoutEnabled}
            onChange={(e) => setOnlineCheckoutEnabled(e.target.checked)}
            className="w-5 h-5 accent-[#38bdf8] cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#cbd5e1]">Delivery Notice Banner</label>
          <textarea
            rows={2}
            value={deliveryNotice}
            onChange={(e) => setDeliveryNotice(e.target.value)}
            className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white focus:border-[#38bdf8] outline-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#151821]/95 backdrop-blur-md p-4 rounded-2xl border border-[#262b3d] shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="text-xs text-[#94a3b8]">
            Colors and settings apply across the entire storefront immediately.
          </div>
          {message && (
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
              }`}
            >
              {message.type === 'success' ? '✓ Saved' : '✕ Error'}
            </span>
          )}
        </div>
        <button
          type="submit"
          onClick={handleSave}
          disabled={saving}
          style={{ backgroundColor: primaryColor }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 shadow-lg hover:brightness-110"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings & Colors'}</span>
        </button>
      </div>
    </form>
  );
}
