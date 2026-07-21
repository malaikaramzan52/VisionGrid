import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate   = useNavigate();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [showCf,   setShowCf]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email || !password || !confirm) {
      setError('Please fill in all fields.'); return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.'); return;
    }
    setLoading(true);
    const err = await signUp({ name: name.trim(), email, password });
    setLoading(false);
    if (err) { setError(err); return; }
    navigate('/login', { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon"><Sparkles size={22} /></div>
          <span className="logo auth-logo-text"><em>Visiongrid</em></span>
        </div>

        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-sub">Join Visiongrid and start exploring</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Name */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-name">Full name</label>
            <div className="auth-input-wrap">
              <User size={16} className="auth-input-icon" />
              <input
                id="signup-name"
                type="text"
                className="auth-input"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-email">Email address</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                id="signup-email"
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
            <label className="auth-label" htmlFor="signup-password">Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="signup-password"
                type={showPw ? 'text' : 'password'}
                className="auth-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(v => !v)} aria-label="Toggle password">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-confirm">Confirm password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="signup-confirm"
                type={showCf ? 'text' : 'password'}
                className="auth-input"
                placeholder="Repeat your password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowCf(v => !v)} aria-label="Toggle confirm password">
                {showCf ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && <p className="auth-error" role="alert">⚠ {error}</p>}

          <button type="submit" className="auth-submit" disabled={loading} id="signup-submit">
            {loading
              ? <span className="auth-spinner" />
              : <><UserPlus size={16} /> Create Account</>
            }
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>

      <div className="auth-blob auth-blob-1" aria-hidden="true" />
      <div className="auth-blob auth-blob-2" aria-hidden="true" />
    </div>
  );
}
