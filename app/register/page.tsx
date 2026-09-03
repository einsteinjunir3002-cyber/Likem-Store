'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, ArrowRight, UserCheck, ShieldCheck, Mail, Sparkles, RefreshCw, Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  // Registration step: 'FORM' or 'VERIFY_OTP'
  const [step, setStep] = useState<'FORM' | 'VERIFY_OTP'>('FORM');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Fields
  const [otpCode, setOtpCode] = useState('');
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Step 1: Submit Form & Trigger OTP for Email verification
  const handleInitiateRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !phone.trim() || !password) {
      setError('Please fill in your name, phone number, and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // If an email is provided, trigger the secure OTP verification flow
    if (email.trim()) {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to send verification code');
        }

        setOtpToken(data.token);
        setPreviewOtp(data.previewCode || null);
        setStep('VERIFY_OTP');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Direct registration without email
      completeRegistration();
    }
  };

  // Step 2: Verify OTP & Complete Account Creation
  const completeRegistration = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email: email.trim() || undefined,
          password,
          otpCode: email.trim() ? otpCode.trim() : undefined,
          otpToken: email.trim() ? otpToken : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccessNotice('Account verified and created successfully! Welcome to The Likem Perfumery.');
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!email.trim()) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      setOtpToken(data.token);
      setPreviewOtp(data.previewCode || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 relative overflow-hidden">
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
        <div className="glass-luxury rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Card top glow line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-gold-pulse"
              style={{
                background: 'rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.30)',
              }}
            >
              {step === 'VERIFY_OTP' ? (
                <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
              ) : (
                <UserPlus className="w-6 h-6 text-[#d4af37]" />
              )}
            </div>

            <div className="badge-gold mx-auto w-fit">
              <Sparkles className="w-2.5 h-2.5" />
              <span>The Likem Perfumery</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-white font-light mt-1">
              {step === 'VERIFY_OTP' ? 'Verify Email Address' : 'Create an Account'}
            </h1>
            <p className="text-xs text-[#94a3b8] font-light leading-relaxed max-w-xs mx-auto">
              {step === 'VERIFY_OTP'
                ? `Enter the 6-digit security OTP code sent to verify ${email}`
                : 'Join our client circle for saved addresses, order tracking, and priority allocations.'}
            </p>
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

          {/* Success Alert */}
          {successNotice && (
            <div className="p-3.5 rounded-2xl text-xs text-emerald-400 mb-5 flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* ============================================================
              STEP 1: REGISTRATION FORM
              ============================================================ */}
          {step === 'FORM' && (
            <form onSubmit={handleInitiateRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="section-label text-[9px]">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kofi Mensah"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full input-luxury rounded-2xl px-4 py-3 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="section-label text-[9px]">Ghana Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0502547133"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full input-luxury rounded-2xl px-4 py-3 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="section-label text-[9px]">Email Address (With OTP Security)</label>
                  <span className="text-[9px] text-[#d4af37] font-semibold">Verified via OTP</span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="e.g. yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full input-luxury rounded-2xl px-4 py-3 text-xs pl-10"
                  />
                  <Mail className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="section-label text-[9px]">Create Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full input-luxury rounded-2xl px-4 py-3 pr-12 text-xs"
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
                className="w-full btn-gold-luxury flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full text-[11px] disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                    <span>Preparing Verification...</span>
                  </>
                ) : (
                  <>
                    <span>{email.trim() ? 'Continue & Verify Email (OTP)' : 'Create Account'}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ============================================================
              STEP 2: EMAIL OTP VERIFICATION
              ============================================================ */}
          {step === 'VERIFY_OTP' && (
            <form onSubmit={completeRegistration} className="space-y-5">
              {/* Instant Verification Notice */}
              {previewOtp && (
                <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/35 rounded-2xl space-y-2 text-center">
                  <div className="text-[10px] uppercase font-bold text-[#f5e4ab] tracking-wider flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#d4af37]" />
                    <span>Email OTP Verification Active</span>
                  </div>
                  <p className="text-[11px] text-[#cbd5e1]">
                    Your 6-digit verification security code for <span className="text-white font-medium">{email}</span> is:
                  </p>
                  <div className="text-2xl font-mono font-black text-[#d4af37] tracking-[0.35em] py-1.5 bg-[#050508]/80 rounded-xl border border-[#d4af37]/25 mx-auto max-w-[200px]">
                    {previewOtp}
                  </div>
                  <p className="text-[9px] text-[#94a3b8]">
                    Enter the code below to confirm this is your email address and activate your account.
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="section-label text-[9px]">Enter 6-Digit OTP Code</label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('FORM');
                      setOtpCode('');
                    }}
                    className="text-[10px] text-[#94a3b8] hover:text-[#d4af37] transition-colors"
                  >
                    Edit Email
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
                  className="w-full input-luxury rounded-2xl px-4 py-3.5 text-center font-mono text-2xl tracking-[0.35em] text-[#d4af37]"
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
                    <span>Activating Account...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Code & Complete Registration</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 text-[10px] text-[#94a3b8] hover:text-[#f5e4ab] transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend verification code</span>
                </button>
              </div>
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
            <span>Continue as a Guest</span>
          </button>

          <div className="mt-5 text-center text-xs text-[#94a3b8]">
            <span>Already have an account? </span>
            <Link href="/login" className="text-[#f5e4ab] font-bold hover:text-[#d4af37] transition-colors">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
