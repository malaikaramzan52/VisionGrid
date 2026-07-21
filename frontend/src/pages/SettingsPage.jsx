import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Camera, Save, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

function Section({ title, children }) {
  return (
    <div className="settings-section">
      <h2 className="settings-section-title">{title}</h2>
      {children}
    </div>
  );
}

function StatusMsg({ type, msg }) {
  if (!msg) return null;
  return (
    <div className={`settings-status ${type}`} role="alert">
      {type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
      {msg}
    </div>
  );
}

export default function SettingsPage() {
  const { user, updateProfile, changePassword } = useAuth();

  /* ── Profile form ── */
  const [name,       setName]       = useState(user?.name || '');
  const [email,      setEmail]      = useState(user?.email || '');
  const [avatar,     setAvatar]     = useState(user?.avatar || null);
  const [profStatus, setProfStatus] = useState({ type: '', msg: '' });
  const [profLoading,setProfLoading]= useState(false);
  const fileRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setProfStatus({ type:'error', msg:'Please select an image file.' }); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfStatus({ type: '', msg: '' });
    if (!name.trim()) { setProfStatus({ type:'error', msg:'Name cannot be empty.' }); return; }
    if (!email.trim()) { setProfStatus({ type:'error', msg:'Email cannot be empty.' }); return; }
    setProfLoading(true);
    await new Promise(r => setTimeout(r, 350));
    const err = updateProfile({ name: name.trim(), email: email.trim(), avatar });
    setProfLoading(false);
    if (err) { setProfStatus({ type: 'error', msg: err }); return; }
    setProfStatus({ type: 'success', msg: 'Profile updated successfully!' });
    setTimeout(() => setProfStatus({ type:'', msg:'' }), 3000);
  };

  /* ── Password form ── */
  const [currentPw,  setCurrentPw]  = useState('');
  const [newPw,      setNewPw]      = useState('');
  const [confirmPw,  setConfirmPw]  = useState('');
  const [showCur,    setShowCur]    = useState(false);
  const [showNew,    setShowNew]    = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [pwStatus,   setPwStatus]   = useState({ type: '', msg: '' });
  const [pwLoading,  setPwLoading]  = useState(false);

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwStatus({ type: '', msg: '' });
    if (!currentPw || !newPw || !confirmPw) { setPwStatus({ type:'error', msg:'Please fill in all fields.' }); return; }
    if (newPw.length < 6) { setPwStatus({ type:'error', msg:'New password must be at least 6 characters.' }); return; }
    if (newPw !== confirmPw) { setPwStatus({ type:'error', msg:'New passwords do not match.' }); return; }
    setPwLoading(true);
    await new Promise(r => setTimeout(r, 350));
    const err = changePassword({ currentPassword: currentPw, newPassword: newPw });
    setPwLoading(false);
    if (err) { setPwStatus({ type: 'error', msg: err }); return; }
    setPwStatus({ type: 'success', msg: 'Password changed successfully!' });
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwStatus({ type:'', msg:'' }), 3000);
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="page-wrapper">
      <div className="settings-page">
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your account preferences</p>
        </div>

        {/* ── Profile Details ── */}
        <Section title="Profile Details">
          <form onSubmit={handleProfileSave} className="settings-form">

            {/* Avatar picker */}
            <div className="settings-avatar-row">
              <div className="settings-avatar">
                {avatar
                  ? <img src={avatar} alt="Avatar" className="settings-avatar-img" />
                  : <span className="profile-initials">{initials}</span>
                }
              </div>
              <div className="settings-avatar-info">
                <p className="settings-avatar-label">Profile picture</p>
                <p className="settings-avatar-hint">JPG, PNG or WebP · Max 5 MB</p>
                <button
                  type="button"
                  className="settings-avatar-btn"
                  onClick={() => fileRef.current?.click()}
                  id="change-avatar-btn"
                >
                  <Camera size={14} /> Change photo
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            {/* Name */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="settings-name">Full Name</label>
              <div className="auth-input-wrap">
                <User size={16} className="auth-input-icon" />
                <input
                  id="settings-name"
                  type="text"
                  className="auth-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="settings-email">Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="settings-email"
                  type="email"
                  className="auth-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <StatusMsg type={profStatus.type} msg={profStatus.msg} />

            <button type="submit" className="settings-save-btn" disabled={profLoading} id="save-profile-btn">
              {profLoading
                ? <span className="auth-spinner" />
                : <><Save size={15} /> Save Changes</>
              }
            </button>
          </form>
        </Section>

        {/* ── Password Management ── */}
        <Section title="Password Management">
          <form onSubmit={handlePasswordSave} className="settings-form">

            {[
              { id:'cur-pw',  label:'Current Password',  val:currentPw, set:setCurrentPw, show:showCur, toggle:()=>setShowCur(v=>!v) },
              { id:'new-pw',  label:'New Password',       val:newPw,     set:setNewPw,     show:showNew, toggle:()=>setShowNew(v=>!v) },
              { id:'conf-pw', label:'Confirm New Password', val:confirmPw, set:setConfirmPw, show:showConf, toggle:()=>setShowConf(v=>!v) },
            ].map(({ id, label, val, set, show, toggle }) => (
              <div className="auth-field" key={id}>
                <label className="auth-label" htmlFor={id}>{label}</label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    className="auth-input"
                    value={val}
                    onChange={e => set(e.target.value)}
                    placeholder={label}
                    autoComplete="off"
                  />
                  <button type="button" className="auth-pw-toggle" onClick={toggle} aria-label="Toggle visibility">
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            ))}

            <StatusMsg type={pwStatus.type} msg={pwStatus.msg} />

            <button type="submit" className="settings-save-btn" disabled={pwLoading} id="save-password-btn">
              {pwLoading
                ? <span className="auth-spinner" />
                : <><Lock size={15} /> Update Password</>
              }
            </button>
          </form>
        </Section>
      </div>
    </div>
  );
}
