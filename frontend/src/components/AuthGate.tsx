import React, { useState } from 'react';
import { Leaf, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthGate: React.FC = () => {
  const { signIn, register, verifyEmail, resendVerification, forgotPassword, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [resetMode, setResetMode] = useState<'request' | 'reset' | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'register') {
        const result = await register(name, email, password);
        setVerificationEmail(result.email);
      }
      else await signIn(email, password);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to connect to the workspace API.');
    } finally {
      setBusy(false);
    }
  };

  const submitVerification = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await verifyEmail(verificationEmail || email, verificationCode);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to verify your email.');
    } finally {
      setBusy(false);
    }
  };

  const submitReset = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      if (resetMode === 'request') { await forgotPassword(email); setResetMode('reset'); }
      else await resetPassword(email, verificationCode, password);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to reset password.'); }
    finally { setBusy(false); }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F5] flex items-center justify-center px-4">
      <section className="w-full max-w-md bg-white border border-[#EAE7DF] rounded-3xl p-8 shadow-[0_20px_60px_rgba(36,36,38,0.08)]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-[#C8E6C9] text-[#1C331F] flex items-center justify-center"><Leaf className="w-5 h-5" /></div>
          <div><p className="text-xs uppercase tracking-[0.2em] text-[#865221] font-semibold">Adaptive Workspace</p><h1 className="text-2xl font-semibold text-[#242426]">A quieter way to work.</h1></div>
        </div>
        {resetMode ? (
          <form onSubmit={submitReset} className="space-y-4">
            <p className="text-sm text-[#424841]">{resetMode === 'request' ? 'Enter your account email to receive a password reset code.' : `Enter the reset code sent to ${email}.`}</p>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full p-3 rounded-xl border border-[#EAE7DF] text-sm" />
            {resetMode === 'reset' && <><input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="6-digit reset code" className="w-full p-3 rounded-xl border border-[#EAE7DF] text-sm text-center tracking-[0.3em]" /><input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="w-full p-3 rounded-xl border border-[#EAE7DF] text-sm" /></>}
            {error && <p className="text-xs text-[#93000A] bg-[#FFDAD6] rounded-lg px-3 py-2">{error}</p>}
            <button disabled={busy} className="w-full py-3 rounded-xl bg-[#44664A] text-white text-sm font-semibold">{busy ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : resetMode === 'request' ? 'Send reset code' : 'Reset password'}</button>
            <button type="button" onClick={() => setResetMode(null)} className="w-full text-xs text-[#73716B]">Back to sign in</button>
          </form>
        ) : verificationEmail ? (
          <form onSubmit={submitVerification} className="space-y-4">
            <p className="text-sm text-[#424841]">We sent a 6-digit verification code to <strong>{verificationEmail}</strong>.</p>
            <input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="Enter verification code" className="w-full p-3 rounded-xl border border-[#EAE7DF] text-sm tracking-[0.3em] text-center focus:outline-none focus:ring-2 focus:ring-[#C8E6C9]" />
            {error && <p className="text-xs text-[#93000A] bg-[#FFDAD6] rounded-lg px-3 py-2">{error}</p>}
            <button disabled={busy} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#44664A] disabled:opacity-60 text-white text-sm font-semibold">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify email <ArrowRight className="w-4 h-4" /></>}</button>
            <button type="button" onClick={() => resendVerification(verificationEmail).catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to resend code.'))} className="w-full text-xs text-[#44664A]">Resend verification code</button>
          </form>
        ) : <><div className="flex gap-1 p-1 bg-[#F7F3EB] rounded-xl mb-6">
          {(['login', 'register'] as const).map((item) => <button key={item} onClick={() => setMode(item)} className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize ${mode === item ? 'bg-white text-[#44664A] shadow-xs' : 'text-[#73716B]'}`}>{item}</button>)}
        </div>
        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full p-3 rounded-xl border border-[#EAE7DF] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8E6C9]" />}
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full p-3 rounded-xl border border-[#EAE7DF] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8E6C9]" />
          <input required minLength={mode === 'register' ? 8 : 1} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-3 rounded-xl border border-[#EAE7DF] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8E6C9]" />
          {error && <p className="text-xs text-[#93000A] bg-[#FFDAD6] rounded-lg px-3 py-2">{error}</p>}
          <button disabled={busy} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#44664A] hover:bg-[#38553D] disabled:opacity-60 text-white text-sm font-semibold">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{mode === 'login' ? 'Enter workspace' : 'Create workspace'} <ArrowRight className="w-4 h-4" /></>}</button>
        </form><button type="button" onClick={() => setResetMode('request')} className="mt-4 w-full text-xs text-[#44664A]">Forgot password?</button></>}
        <p className="text-[11px] text-center text-[#8F8D86] mt-4">Sign in or create an account to access your private workspace.</p>
      </section>
    </main>
  );
};
