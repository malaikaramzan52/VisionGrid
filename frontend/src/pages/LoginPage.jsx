import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    const err = await login({ email, password });
    setLoading(false);
    if (err) { setError(err); return; }
    navigate('/', { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon"><Sparkles size={22} /></div>
          <span className="logo auth-logo-text"><em>Visiongrid</em></span>
        </div>

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-sub">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">Email address</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                id="login-email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-password">Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                className="auth-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="auth-pw-toggle"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && <p className="auth-error" role="alert">⚠ {error}</p>}

          <button type="submit" className="auth-submit" disabled={loading} id="login-submit">
            {loading
              ? <span className="auth-spinner" />
              : <><LogIn size={16} /> Sign In</>
            }
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Create one</Link>
        </p>
      </div>

      {/* Decorative blobs */}
      <div className="auth-blob auth-blob-1" aria-hidden="true" />
      <div className="auth-blob auth-blob-2" aria-hidden="true" />
    </div>
  );
}
