'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, ArrowRight, UserCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Auto sign in
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    router.push('/products');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md glass-luxury rounded-3xl p-8 sm:p-10 space-y-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#d4af37] flex items-center justify-center mx-auto shadow-lg">
            <UserPlus className="w-5 h-5" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-bold block">
            LIKEM Haute Parfumerie
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-white font-normal">
            Create an Account
          </h1>
          <p className="text-xs text-[#94a3b8] font-light">
            Register for saved addresses, order tracking, and priority allocations in Ghana.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#cbd5e1] tracking-wider uppercase text-[10px]">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kofi Mensah"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#07080b] border border-[#d4af37]/30 rounded-xl p-3 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#d4af37] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#cbd5e1] tracking-wider uppercase text-[10px]">
              Ghana Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 0502547133"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#07080b] border border-[#d4af37]/30 rounded-xl p-3 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#d4af37] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#cbd5e1] tracking-wider uppercase text-[10px]">
              Email Address (Optional)
            </label>
            <input
              type="email"
              placeholder="e.g. yourname@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#07080b] border border-[#d4af37]/30 rounded-xl p-3 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#d4af37] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#cbd5e1] tracking-wider uppercase text-[10px]">
              Create Password *
            </label>
            <input
              type="password"
              required
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#07080b] border border-[#d4af37]/30 rounded-xl p-3 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#d4af37] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold-luxury flex items-center justify-center gap-2 py-3.5 px-5 rounded-full text-xs transition-all disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Registering...' : 'Register Account'}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center pt-2">
          <div className="border-t border-[#d4af37]/20 w-full" />
          <span className="bg-[#0b0e17] px-3 text-[10px] uppercase tracking-widest text-[#717b94] shrink-0">
            or
          </span>
          <div className="border-t border-[#d4af37]/20 w-full" />
        </div>

        {/* Continue as Guest */}
        <button
          type="button"
          onClick={handleContinueAsGuest}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#131622] hover:bg-[#1a1f2e] border border-[#d4af37]/30 text-[#f1f5f9] text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
        >
          <UserCheck className="w-4 h-4 text-[#d4af37]" />
          <span>Continue as a Guest</span>
        </button>

        <div className="pt-2 text-center text-xs text-[#94a3b8]">
          <span>Already registered? </span>
          <Link href="/login" className="text-[#f5e4ab] font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
