'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, message }),
      });
      setSubmitted(true);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
          Direct Communication
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Contact Our Studio</h1>
        <p className="text-sm text-[#94a3b8] max-w-md mx-auto">
          Inquire about a specific perfume, verify stock, or arrange special delivery arrangements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact info channels */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-[#151821] border border-[#262b3d] p-6 rounded-2xl space-y-6">
            <h3 className="text-base font-bold text-white">Direct Channels</h3>

            <div className="space-y-4 text-xs">
              <a
                href="https://wa.me/233502547133"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-xl transition-all"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
                <div>
                  <div className="font-bold text-white">WhatsApp</div>
                  <div className="text-[#25D366] font-semibold">0502547133</div>
                </div>
              </a>

              <a
                href="tel:0502547133"
                className="flex items-center gap-3 p-3 bg-[#1e2330] hover:bg-[#252b3d] border border-[#262b3d] rounded-xl transition-all"
              >
                <Phone className="w-5 h-5 text-[#d4af37] shrink-0" />
                <div>
                  <div className="font-bold text-white">Direct Phone Call</div>
                  <div className="text-[#cbd5e1]">0502547133</div>
                </div>
              </a>

              <a
                href="https://snapchat.com/add/lilitracess"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#FFFC00]/10 hover:bg-[#FFFC00]/20 border border-[#FFFC00]/30 rounded-xl transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-[#FFFC00] text-black font-black flex items-center justify-center text-[10px]">
                  S
                </div>
                <div>
                  <div className="font-bold text-white">Snapchat</div>
                  <div className="text-[#FFFC00] font-semibold">@lilitracess</div>
                </div>
              </a>
            </div>

            <div className="p-3 bg-[#0d0e12] border border-[#262b3d] rounded-xl text-[11px] text-[#94a3b8] leading-relaxed">
              <span className="text-[#d4af37] font-semibold">Delivery Note:</span> As an independent online studio, all purchases are sent via direct courier dispatch across Ghana.
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-7">
          <div className="bg-[#151821] border border-[#262b3d] p-6 sm:p-8 rounded-2xl">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Enquiry Received</h3>
                <p className="text-xs text-[#94a3b8]">
                  Thank you for reaching out. We will contact you via WhatsApp or phone shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-white">Send Us a Message</h3>

                <div className="space-y-1">
                  <label className="text-xs text-[#cbd5e1]">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Osei"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#cbd5e1]">Phone Number (WhatsApp preferred) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0502547133"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#cbd5e1]">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#cbd5e1]">Your Message or Perfume Request *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us which perfume you are looking for or any delivery questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#0d0e12] border border-[#262b3d] rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#d4af37] hover:bg-[#c29d2b] text-black font-bold text-xs tracking-wide transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Sending...' : 'Submit Enquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
