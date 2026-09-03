'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, Eye, EyeOff, UserCheck, Sparkles, User } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        throw new Error(data.error || 'Invalid credentials. Please verify and try again.');
      }

      // If owner credentials, silently routes to admin suite
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
    // Set guest browsing session cookie for 30 days
    document.cookie = 'likem_guest=true; path=/; max-age=2592000; SameSite=Lax';
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-80"
          style={{ background: 'radial-gradient(ellipse at top, rgba(212,175,55,0.07) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-72 h-72"
          style={{ background: 'radial-gradient(ellipse at right bottom, rgba(212,175,55,0.05) 0%, transparent 60%)' }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="glass-luxury rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Card top glow line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />

          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-gold-pulse"
              style={{
                background: 'rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.30)',
              }}
            >
              <Lock className="w-6 h-6 text-[#d4af37]" />
            </div>

            <div className="badge-gold mx-auto w-fit">
              <Sparkles className="w-2.5 h-2.5" />
              <span>The Likem Perfumery</span>
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-5xl text-white font-light mt-2 tracking-wide uppercase">
              WELCOME
            </h1>
            <p className="text-xs text-[#94a3b8] font-light leading-relaxed max-w-xs mx-auto">
              Sign in to access your bespoke fragrance vault, track your orders, and enjoy priority allocations.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className="p-3.5 rounded-2xl text-xs text-red-400 mb-6 flex items-center gap-2.5"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
              }}
            >
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="section-label text-[9px]">
                Email or Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Enter your email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full input-luxury rounded-2xl px-4 py-3.5 text-xs pl-10"
                />
                <User className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="section-label text-[9px]">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full input-luxury rounded-2xl px-4 py-3.5 pr-12 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#d4af37] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold-luxury flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full text-[11px] disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-[#050508]/30 border-t-[#050508] animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="gold-divider flex-1" />
            <span className="text-[10px] uppercase tracking-widest text-[#475569]">or</span>
            <div className="gold-divider flex-1" />
          </div>

          {/* Continue as Guest */}
          <button
            type="button"
            onClick={handleContinueAsGuest}
            className="w-full btn-outline-luxury flex items-center justify-center gap-2 py-3 px-6 rounded-full text-[11px]"
          >
            <UserCheck className="w-4 h-4 text-[#d4af37]" />
            <span>Continue Browsing as Guest</span>
          </button>

          {/* Create account link */}
          <div className="mt-6 text-center text-xs text-[#64748b]">
            <span>New to The Likem Perfumery? </span>
            <Link href="/register" className="text-[#f5e4ab] font-bold hover:text-[#d4af37] transition-colors">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
