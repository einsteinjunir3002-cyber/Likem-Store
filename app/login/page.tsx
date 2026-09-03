'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, Eye, EyeOff, UserCheck, Sparkles, Mail, ShieldCheck, KeyRound, RefreshCw } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();

  // Auth mode: 'OTP' (Email One-Time Password) or 'PASSWORD' (Admin / Password)
  const [authMode, setAuthMode] = useState<'OTP' | 'PASSWORD'>('OTP');

  // Password state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [otpStep, setOtpStep] = useState<'REQUEST' | 'VERIFY'>('REQUEST');
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Password Login Handler (Owner & password accounts)
  const handlePasswordLogin = async (e: React.FormEvent) => {
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

  // 2. Request OTP Code
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setOtpMessage(null);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP code');
      }

      setOtpToken(data.token);
      setPreviewOtp(data.previewCode || null);
      setOtpMessage(data.message || 'Verification code generated.');
      setOtpStep('VERIFY');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify OTP Code & Sign In
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpEmail,
          code: otpCode,
          token: otpToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

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
        <div className="glass-luxury rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Card top glow line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />

          {/* Header */}
          <div className="text-center space-y-3 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-gold-pulse"
              style={{
                background: 'rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.30)',
              }}
            >
              {authMode === 'OTP' ? (
                <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
              ) : (
                <Lock className="w-6 h-6 text-[#d4af37]" />
              )}
            </div>

            <div className="badge-gold mx-auto w-fit">
              <Sparkles className="w-2.5 h-2.5" />
              <span>The Likem Perfumery</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-white font-light mt-1">
              {authMode === 'OTP' ? 'Secure Email Sign-In' : 'Owner / Password Sign-In'}
            </h1>
            <p className="text-xs text-[#94a3b8] font-light leading-relaxed max-w-xs mx-auto">
              {authMode === 'OTP'
                ? 'Sign in password-free with a secure 6-digit verification code.'
                : 'Sign in with your registered username or admin password.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#080a10] rounded-2xl border border-[#d4af37]/20 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('OTP');
                setError('');
              }}
              className={`py-2 px-3 rounded-xl text-[11px] font-bold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'OTP'
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Email OTP (Secure)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('PASSWORD');
                setError('');
              }}
              className={`py-2 px-3 rounded-xl text-[11px] font-bold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'PASSWORD'
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Password Login</span>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className="p-3.5 rounded-2xl text-xs text-red-400 mb-5 flex items-center gap-2.5"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
              }}
            >
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ========================================================
              MODE A: SECURE EMAIL OTP FLOW
              ======================================================== */}
          {authMode === 'OTP' && (
            <div className="space-y-4">
              {otpStep === 'REQUEST' ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="section-label text-[9px]">Your Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="e.g. client@gmail.com"
                        value={otpEmail}
                        onChange={(e) => setOtpEmail(e.target.value)}
                        className="w-full input-luxury rounded-2xl px-4 py-3.5 text-xs pl-10"
                      />
                      <Mail className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-gold-luxury flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full text-[11px] disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                        <span>Generating Secure Code...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Send Verification Code (OTP)</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {/* Instant Verification Banner */}
                  {previewOtp && (
                    <div className="p-3.5 bg-[#d4af37]/10 border border-[#d4af37]/35 rounded-2xl space-y-1.5 text-center">
                      <div className="text-[10px] uppercase font-bold text-[#f5e4ab] tracking-wider flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#d4af37]" />
                        <span>Instant Verification Active</span>
                      </div>
                      <p className="text-[11px] text-[#cbd5e1]">
                        Your 6-digit security code for <span className="text-white font-medium">{otpEmail}</span> is:
                      </p>
                      <div className="text-2xl font-mono font-black text-[#d4af37] tracking-[0.3em] py-1 bg-[#050508]/80 rounded-xl border border-[#d4af37]/25 mx-auto max-w-[200px]">
                        {previewOtp}
                      </div>
                      <p className="text-[9px] text-[#94a3b8]">Valid for 10 minutes. Enter it below to sign in.</p>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="section-label text-[9px]">Enter 6-Digit OTP Code</label>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep('REQUEST');
                          setOtpCode('');
                        }}
                        className="text-[10px] text-[#94a3b8] hover:text-[#d4af37] transition-colors"
                      >
                        Change Email
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      placeholder="e.g. 123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full input-luxury rounded-2xl px-4 py-3.5 text-center font-mono text-xl tracking-[0.35em] text-[#d4af37]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length !== 6}
                    className="w-full btn-gold-luxury flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full text-[11px] disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Sign In</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 text-[10px] text-[#94a3b8] hover:text-[#f5e4ab] transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend new code</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================
              MODE B: PASSWORD LOGIN (Owner / Esq. Likem)
              ======================================================== */}
          {authMode === 'PASSWORD' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="section-label text-[9px]">
                  Username or Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Esq. Likem"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full input-luxury rounded-2xl px-4 py-3.5 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="section-label text-[9px]">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full input-luxury rounded-2xl px-4 py-3.5 pr-12 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#d4af37] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold-luxury flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full text-[11px] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#050508]/30 border-t-[#050508] animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-[#475569] pt-1">
                Owner: sign in with <span className="text-[#94a3b8]">Esq. Likem</span> to access the admin portal.
              </p>
            </form>
          )}

          {/* Divider */}
          <div className="my-5 flex items-center gap-4">
            <div className="gold-divider flex-1" />
            <span className="text-[10px] uppercase tracking-widest text-[#475569]">or</span>
            <div className="gold-divider flex-1" />
          </div>

          {/* Continue as Guest */}
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="w-full btn-outline-luxury flex items-center justify-center gap-2 py-3 px-6 rounded-full text-[11px]"
          >
            <UserCheck className="w-4 h-4 text-[#d4af37]" />
            <span>Continue Browsing as Guest</span>
          </button>

          {/* Create account link */}
          <div className="mt-5 text-center text-xs text-[#475569]">
            <span>Need a custom account? </span>
            <Link href="/register" className="text-[#f5e4ab] font-bold hover:text-[#d4af37] transition-colors">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
