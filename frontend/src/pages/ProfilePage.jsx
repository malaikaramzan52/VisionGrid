import { useAuth } from '../context/AuthContext';
import { useApp }  from '../context/AppContext';
import { User, Mail, Calendar, Heart, Download, Settings, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useAuth();
  const { wishlist, downloadCount } = useApp();

  if (!user) return null;

  const joinDate = new Date(user.joinedAt || user.created_at || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="page-wrapper">
      <div className="profile-page">

        {/* ── Banner ── */}
        <div className="profile-banner" aria-hidden="true">
          <div className="profile-banner-gradient" />
        </div>

        {/* ── Avatar & name ── */}
        <div className="profile-header">
          <div className="profile-avatar-xl">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="profile-avatar-img" />
              : <span className="profile-initials">{initials}</span>
            }
            <div className="profile-avatar-badge" aria-hidden="true">
              <Camera size={12} />
            </div>
          </div>

          <div className="profile-identity">
            <h1 className="profile-display-name">{user.name}</h1>
            <p className="profile-display-email">
              <Mail size={14} /> {user.email}
            </p>
            <p className="profile-joined">
              <Calendar size={13} /> Joined {joinDate}
            </p>
          </div>

          <Link to="/settings" className="profile-edit-btn" id="profile-edit-link">
            <Settings size={15} /> Edit Profile
          </Link>
        </div>

        {/* ── Stats ── */}
        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <div className="profile-stat-icon" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
              <Heart size={20} />
            </div>
            <div className="profile-stat-val">{wishlist.length}</div>
            <div className="profile-stat-label">Wishlisted</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-icon" style={{ background: 'rgba(13,148,136,0.12)', color: 'var(--accent-1)' }}>
              <Download size={20} />
            </div>
            <div className="profile-stat-val">{downloadCount}</div>
            <div className="profile-stat-label">Downloads</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>
              <User size={20} />
            </div>
            <div className="profile-stat-val">1</div>
            <div className="profile-stat-label">Account</div>
          </div>
        </div>

        {/* ── Account details ── */}
        <div className="profile-details-card">
          <h2 className="profile-section-title">Account Details</h2>
          <div className="profile-detail-row">
            <span className="profile-detail-label"><User size={14} /> Full Name</span>
            <span className="profile-detail-val">{user.name}</span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label"><Mail size={14} /> Email</span>
            <span className="profile-detail-val">{user.email}</span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label"><Calendar size={14} /> Member Since</span>
            <span className="profile-detail-val">{joinDate}</span>
          </div>
        </div>

        {/* ── Wishlist preview ── */}
        {wishlist.length > 0 && (
          <div className="profile-details-card">
            <h2 className="profile-section-title">Wishlist Preview</h2>
            <div className="profile-wishlist-grid">
              {wishlist.slice(0, 6).map(img => (
                <div key={img.id} className="profile-wish-thumb">
                  <img src={img.url} alt={img.title} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
