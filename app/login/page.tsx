'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, Sparkles, User, ShieldCheck, UserCheck } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // If owner login, redirect straight to admin panel with full privileges
      if (data.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      router.refresh();
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md glass-luxury rounded-3xl p-8 sm:p-10 space-y-7 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#d4af37] flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-5 h-5" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-bold block">
            LIKEM Haute Parfumerie
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-white font-normal">
            Welcome Back
          </h1>
          <p className="text-xs text-[#94a3b8] font-light">
            Sign in to your account, manage store as Owner, or continue browsing.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#cbd5e1] tracking-wider uppercase text-[10px]">
              Username, Email or Phone
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Esq. Likem or phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-[#07080b] border border-[#d4af37]/30 rounded-xl p-3 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#d4af37] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#cbd5e1] tracking-wider uppercase text-[10px]">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter password"
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
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </form>

        {/* Divider with or continue as guest */}
        <div className="relative flex items-center justify-center pt-2">
          <div className="border-t border-[#d4af37]/20 w-full" />
          <span className="bg-[#0b0e17] px-3 text-[10px] uppercase tracking-widest text-[#717b94] shrink-0">
            or
          </span>
          <div className="border-t border-[#d4af37]/20 w-full" />
        </div>

        {/* Continue as Guest Button */}
        <button
          type="button"
          onClick={handleContinueAsGuest}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#131622] hover:bg-[#1a1f2e] border border-[#d4af37]/30 text-[#f1f5f9] text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
        >
          <UserCheck className="w-4 h-4 text-[#d4af37]" />
          <span>Continue as a Guest</span>
        </button>

        {/* Links to Register */}
        <div className="pt-2 text-center text-xs text-[#94a3b8]">
          <span>Don&apos;t have an account? </span>
          <Link href="/register" className="text-[#f5e4ab] font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
