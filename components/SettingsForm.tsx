'use client';

import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';

interface SettingsFormProps {
  settings: {
    storeName: string;
    tagline: string;
    phoneContact: string;
    whatsappNumber: string;
    snapchatHandle?: string;
    onlineCheckoutEnabled: boolean;
    deliveryNotice: string;
  };
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [phoneContact, setPhoneContact] = useState(settings.phoneContact);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [snapchatHandle, setSnapchatHandle] = useState(settings.snapchatHandle || '');
  const [onlineCheckoutEnabled, setOnlineCheckoutEnabled] = useState(settings.onlineCheckoutEnabled);
  const [deliveryNotice, setDeliveryNotice] = useState(settings.deliveryNotice);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

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
        }),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      setMessage('Settings updated successfully!');
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      <div className="bg-[#151821] border border-[#262b3d] p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-white border-b border-[#1e2330] pb-2">
          Store Information & Branding
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#cbd5e1]">Business / Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#cbd5e1]">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#151821] border border-[#262b3d] p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-white border-b border-[#1e2330] pb-2">
          Social Channels & Contact
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#cbd5e1]">Direct Phone</label>
            <input
              type="text"
              value={phoneContact}
              onChange={(e) => setPhoneContact(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#25D366]">WhatsApp Business Number</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#FFFC00]">Snapchat Handle</label>
            <input
              type="text"
              value={snapchatHandle}
              onChange={(e) => setSnapchatHandle(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#151821] border border-[#262b3d] p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-white border-b border-[#1e2330] pb-2">
          Commerce Mode Selection
        </h2>

        <div className="flex items-center justify-between p-3 bg-[#0d0e12] border border-[#262b3d] rounded-xl">
          <div>
            <div className="font-bold text-xs text-white">Enable Full Website Checkout</div>
            <div className="text-[11px] text-[#94a3b8]">
              When disabled, customers primarily order through WhatsApp.
            </div>
          </div>
          <input
            type="checkbox"
            checked={onlineCheckoutEnabled}
            onChange={(e) => setOnlineCheckoutEnabled(e.target.checked)}
            className="w-5 h-5 accent-[#d4af37]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#cbd5e1]">Delivery Notice Banner</label>
          <textarea
            rows={2}
            value={deliveryNotice}
            onChange={(e) => setDeliveryNotice(e.target.value)}
            className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#c29d2b] text-black font-bold text-xs rounded-xl transition-all disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        <span>{saving ? 'Saving...' : 'Save Settings'}</span>
      </button>
    </form>
  );
}
