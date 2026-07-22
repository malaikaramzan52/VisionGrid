import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Upload, Moon, Sun, User, ChevronDown, Check,
  Leaf, Plane, Palette, Cpu, Car, Sparkles, Building2, LayoutGrid,
  UserCircle, Settings, LogOut, Command, Heart, Download,
  Menu, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp }  from '../context/AppContext';

/* ── Category icon map ── */
const CAT_ICONS = {
  All:          <LayoutGrid  size={14} />,
  Nature:       <Leaf        size={14} />,
  Travel:       <Plane       size={14} />,
  Art:          <Palette     size={14} />,
  Tech:         <Cpu         size={14} />,
  Cars:         <Car         size={14} />,
  Anime:        <Sparkles    size={14} />,
  Architecture: <Building2   size={14} />,
};

/* ── Search placeholder rotation ── */
const PLACEHOLDERS = [
  'Search images…',
  'Search artists…',
  'Search styles…',
  'Search tags…',
  'Search categories…',
];

export default function Navbar({
  darkMode, onToggleDark,
  searchQuery, onSearch,
  activeCategory, onCategory,
  onUploadClick,
  scrolled,
}) {
  const { user, logout }             = useAuth();
  const { wishlist, toggleWishlist, downloadCount, categories } = useApp();
  const navigate                     = useNavigate();

  const displayCategories = ['All', ...categories.map(c => c.name)];
  const location                     = useLocation();

  const [catOpen,     setCatOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [phIdx,       setPhIdx]       = useState(0);
  const [phVisible,   setPhVisible]   = useState(true);

  const catRef     = useRef(null);
  const profileRef = useRef(null);
  const searchRef  = useRef(null);

  /* ── Placeholder animation ── */
  useEffect(() => {
    if (searchQuery) return;
    const cycle = setInterval(() => {
      setPhVisible(false);
      setTimeout(() => {
        setPhIdx(i => (i + 1) % PLACEHOLDERS.length);
        setPhVisible(true);
      }, 300);
    }, 2800);
    return () => clearInterval(cycle);
  }, [searchQuery]);

  /* ── Ctrl+K shortcut ── */
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* ── Close dropdowns on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current     && !catRef.current.contains(e.target))     setCatOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Close mobile menu on page change ── */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleCatSelect = useCallback((cat) => {
    onCategory(cat);
    setCatOpen(false);
  }, [onCategory]);

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const isHome = location.pathname === '/';

  /* Avatar display */
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}${mobileMenuOpen ? ' mobile-menu-active' : ''}`}>
      <div className="navbar-row">

        {/* ── Logo ── */}
        <Link to="/" className="logo" aria-label="VisionGrid home">
          <em>Visiongrid</em>
        </Link>

        {/* ── Category Dropdown (home only, visible on both desktop & mobile) ── */}
        {isHome && (
          <div className="category-dropdown-wrap" ref={catRef}>
            <button
              id="category-dropdown-btn"
              className={`category-dropdown-btn${catOpen ? ' open' : ''}`}
              onClick={() => setCatOpen(o => !o)}
              aria-haspopup="listbox"
              aria-expanded={catOpen}
              aria-label="Filter by category"
            >
              <span className="cat-btn-icon">{CAT_ICONS[activeCategory] || <Sparkles size={14} />}</span>
              <span className="cat-btn-label">
                {activeCategory === 'All' ? 'All' : activeCategory}
              </span>
              <ChevronDown size={13} className="dropdown-arrow" />
            </button>

            {catOpen && (
              <div className="category-dropdown-menu glass-menu" role="listbox" aria-label="Categories">
                {displayCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-option${activeCategory === cat ? ' active' : ''}`}
                    role="option"
                    aria-selected={activeCategory === cat}
                    onClick={() => handleCatSelect(cat)}
                  >
                    <span className="cat-opt-left">
                      <span className="cat-opt-icon">{CAT_ICONS[cat] || <Sparkles size={14} />}</span>
                      <span>{cat === 'All' ? 'All Categories' : cat}</span>
                    </span>
                    <Check size={13} className="check-icon" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Desktop Search (only on home, hidden on mobile) ── */}
        {isHome && (
          <div className="search-wrap desktop-only">
            <Search size={15} className="search-icon-el" />
            <input
              ref={searchRef}
              id="main-search"
              className="search-input"
              type="text"
              placeholder={PLACEHOLDERS[phIdx]}
              style={{ '--ph-opacity': phVisible ? 1 : 0 }}
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              aria-label="Search images"
            />
            <span className="search-kbd" aria-hidden="true">
              <Command size={10} />K
            </span>
          </div>
        )}

        {/* ── Spacer when not on home (desktop only) ── */}
        {!isHome && <div className="desktop-only" style={{ flex: 1 }} />}

        {/* ── Desktop Nav actions (hidden on mobile) ── */}
        <div className="nav-actions desktop-only">

          {/* Wishlist button with counter */}
          <button
            className="btn-icon nav-counter-btn"
            onClick={toggleWishlist}
            aria-label={`Wishlist (${wishlist.length} items)`}
            id="wishlist-toggle-btn"
          >
            <Heart size={16} />
            {wishlist.length > 0 && (
              <span className="nav-counter">{wishlist.length > 99 ? '99+' : wishlist.length}</span>
            )}
          </button>

          {/* Download counter */}
          <div className="btn-icon nav-counter-btn" aria-label={`${downloadCount} downloads`} title="Downloads">
            <Download size={16} />
            {downloadCount > 0 && (
              <span className="nav-counter dl-counter">{downloadCount > 99 ? '99+' : downloadCount}</span>
            )}
          </div>

          {/* Upload (home only) */}
          {isHome && (
            <button
              className="btn-upload"
              onClick={user ? onUploadClick : () => navigate('/login')}
              aria-label="Upload image"
              id="upload-btn"
            >
              <Upload size={15} />
              <span className="upload-label">Upload</span>
            </button>
          )}

          {/* Dark/Light toggle */}
          <button className="btn-icon" onClick={onToggleDark} aria-label="Toggle theme" id="theme-toggle-btn">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Auth: show profile if logged in, else Sign In */}
          {user ? (
            <div className="profile-wrap" ref={profileRef}>
              <button
                className={`avatar${profileOpen ? ' active' : ''}`}
                role="button"
                aria-label="Profile menu"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen(o => !o)}
                id="profile-btn"
              >
                <div className="avatar-inner">
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                    : <span style={{ fontSize: 13, fontWeight: 700 }}>{initials}</span>
                  }
                </div>
                <span className="online-dot" aria-hidden="true" />
              </button>

              {profileOpen && (
                <div className="profile-dropdown glass-menu" role="menu">
                  <div className="profile-info">
                    <div className="profile-avatar-lg">
                      {user.avatar
                        ? <img src={user.avatar} alt={user.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                        : <span style={{ fontSize: 14, fontWeight: 700 }}>{initials}</span>
                      }
                    </div>
                    <div>
                      <p className="profile-name">{user.name}</p>
                      <p className="profile-status">
                        <span className="online-dot-sm" />Online
                      </p>
                    </div>
                  </div>
                  <div className="profile-divider" />
                  <Link to="/profile" className="profile-option" role="menuitem" onClick={() => setProfileOpen(false)}>
                    <UserCircle size={14} /> Profile
                  </Link>
                  <Link to="/settings" className="profile-option" role="menuitem" onClick={() => setProfileOpen(false)}>
                    <Settings size={14} /> Settings
                  </Link>
                  <div className="profile-divider" />
                  <button className="profile-option danger" role="menuitem" onClick={handleLogout}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth-btns">
              <Link to="/login"  className="btn-auth-outline" id="nav-login-btn">Sign In</Link>
              <Link to="/signup" className="btn-upload"       id="nav-signup-btn">
                <UserCircle size={15} />
                <span className="upload-label">Sign Up</span>
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile Hamburger Toggle (3 lines / X) ── */}
        <button
          className="btn-icon mobile-only mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(o => !o)}
          aria-label="Toggle navigation menu"
          id="mobile-menu-toggle-btn"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Mobile Menu Dropdown Panel ── */}
      {mobileMenuOpen && (
        <div className="mobile-menu glass-menu" id="mobile-menu-dropdown">
          {/* Mobile Search (home page only) */}
          {isHome && (
            <div className="mobile-search-wrap">
              <Search size={15} className="search-icon-el" />
              <input
                className="search-input"
                type="text"
                placeholder={PLACEHOLDERS[phIdx]}
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                aria-label="Search images"
              />
            </div>
          )}

          {/* Quick Actions (Wishlist, Downloads, Theme Toggle) */}
          <div className="mobile-actions-row">
            {/* Wishlist */}
            <button
              className="btn-icon nav-counter-btn"
              onClick={() => {
                toggleWishlist();
                setMobileMenuOpen(false);
              }}
              aria-label={`Wishlist (${wishlist.length} items)`}
            >
              <Heart size={16} />
              {wishlist.length > 0 && (
                <span className="nav-counter">{wishlist.length}</span>
              )}
            </button>

            {/* Downloads */}
            <div className="btn-icon nav-counter-btn" aria-label={`${downloadCount} downloads`} title="Downloads">
              <Download size={16} />
              {downloadCount > 0 && (
                <span className="nav-counter dl-counter">{downloadCount}</span>
              )}
            </div>

            {/* Theme Toggle */}
            <button className="btn-icon" onClick={onToggleDark} aria-label="Toggle theme">
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Upload Button (home only) */}
          {isHome && (
            <button
              className="btn-upload mobile-upload-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                if (user) {
                  onUploadClick();
                } else {
                  navigate('/login');
                }
              }}
            >
              <Upload size={15} />
              <span>Upload Image</span>
            </button>
          )}

          {/* Auth Section */}
          <div className="mobile-auth-section">
            {user ? (
              <div className="mobile-profile-info-box">
                <div className="mobile-user-details">
                  <div className="avatar-inner" style={{ width: 38, height: 38 }}>
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                      : <span style={{ fontSize: 13, fontWeight: 700 }}>{initials}</span>
                    }
                  </div>
                  <div>
                    <p className="profile-name" style={{ fontSize: 13.5 }}>{user.name}</p>
                    <p className="profile-status">
                      <span className="online-dot-sm" />Online
                    </p>
                  </div>
                </div>
                <div className="profile-divider" />
                <div className="mobile-profile-links">
                  <Link to="/profile" className="mobile-profile-option" onClick={() => setMobileMenuOpen(false)}>
                    <UserCircle size={15} /> Profile
                  </Link>
                  <Link to="/settings" className="mobile-profile-option" onClick={() => setMobileMenuOpen(false)}>
                    <Settings size={15} /> Settings
                  </Link>
                  <button className="mobile-profile-option danger" onClick={handleLogout}>
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="btn-auth-outline" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link to="/signup" className="btn-upload" onClick={() => setMobileMenuOpen(false)}>
                  <UserCircle size={15} />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
