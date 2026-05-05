'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowRight, Camera } from 'lucide-react';

function SignInForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result.error) {
        setError('Invalid email or password');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <span className="label">Email Address</span>
          <div className="input-container">
            <input
              type="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="input-wrapper">
          <span className="label">Password</span>
          <div className="input-container">
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? <Loader2 className="spin" size={20} /> : <ArrowRight size={20} />}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </>
  );
}

export default function SignInPage() {
  return (
    <div className="login-page">
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top left, #405DE6, transparent 40%),
                      radial-gradient(circle at top right, #5851DB, transparent 40%),
                      radial-gradient(circle at bottom left, #833AB4, transparent 40%),
                      radial-gradient(circle at bottom right, #E1306C, transparent 40%),
                      #000;
          padding: 2rem;
          color: white;
          font-family: 'Inter', sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .logo-container {
          width: 64px;
          height: 64px;
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 20px rgba(220, 39, 67, 0.3);
        }

        .title {
          font-size: 2rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #fff, #999);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 2.5rem;
          font-size: 0.95rem;
        }

        :global(.input-wrapper) {
          margin-bottom: 1.25rem;
        }

        :global(.label) {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.5rem;
          padding-left: 0.5rem;
        }

        :global(.input-container) {
          position: relative;
        }

        :global(.input-container input) {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 12px 16px;
          color: white;
          font-size: 1rem;
          transition: all 0.2s;
        }

        :global(.input-container input:focus) {
          outline: none;
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05);
        }

        :global(.login-button) {
          width: 100%;
          background: white;
          color: black;
          border: none;
          border-radius: 14px;
          padding: 14px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.2s;
        }

        :global(.login-button:hover:not(:disabled)) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
        }

        :global(.login-button:active:not(:disabled)) {
          transform: translateY(0);
        }

        :global(.login-button:disabled) {
          opacity: 0.7;
          cursor: not-allowed;
        }

        :global(.error-message) {
          background: rgba(255, 59, 48, 0.1);
          border: 1px solid rgba(255, 59, 48, 0.2);
          color: #ff453a;
          padding: 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .footer {
          margin-top: 2.5rem;
          text-align: center;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .footer a {
          color: white;
          text-decoration: none;
          font-weight: 600;
        }

        :global(.spin) { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="login-card">
        <div className="logo-container">
          <Camera size={32} color="white" />
        </div>
        
        <h1 className="title">Welcome Back</h1>
        <p className="subtitle">Login to manage your Instagram posts</p>

        <Suspense fallback={
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Loader2 className="spin" size={32} style={{ color: 'white', opacity: 0.5 }} />
          </div>
        }>
          <SignInForm />
        </Suspense>

        <div className="footer">
          By signing in, you agree to our <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}
