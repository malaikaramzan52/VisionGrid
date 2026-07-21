import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Zap, Shield } from 'lucide-react';

const HERO_TAGS = ['Nature', 'Travel', 'Art', 'Architecture', 'Tech', 'Anime'];

export default function HeroSection({ onSearch, onCategory }) {
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    onCategory(tag);
    // Smooth scroll to gallery
    document.querySelector('.gallery-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearchKey = (e) => {
    if (e.key === 'Enter') {
      document.querySelector('.gallery-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" aria-label="Hero banner">
      {/* Background image layer */}
      <div className="hero-bg" aria-hidden="true">
        <img
          src="https://picsum.photos/seed/heroVG/1600/700"
          alt=""
          className="hero-bg-img"
          loading="eager"
        />
        <div className="hero-bg-overlay" />
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-badge">
          <Zap size={13} /> Over 36 curated images
        </div>

        <h1 className="hero-heading">
          Discover <em>Stunning</em><br />Visuals That Inspire
        </h1>
        <p className="hero-sub">
          Explore a premium gallery of photography, art, and design —<br className="hero-br" />
          curated for creators, designers, and dreamers.
        </p>

        {/* Search bar */}
        <div className="hero-search-wrap">
          <Search size={18} className="hero-search-icon" />
          <input
            id="hero-search"
            type="text"
            className="hero-search-input"
            placeholder="Search images, artists, styles…"
            onChange={e => onSearch(e.target.value)}
            onKeyDown={handleSearchKey}
            aria-label="Search images"
          />
          <button
            className="hero-search-btn"
            onClick={() => document.querySelector('.gallery-section')?.scrollIntoView({ behavior: 'smooth' })}
            aria-label="Search"
          >
            Explore
          </button>
        </div>

        {/* Popular tags */}
        <div className="hero-tags">
          <span className="hero-tags-label">
            <TrendingUp size={13} /> Trending:
          </span>
          {HERO_TAGS.map(tag => (
            <button
              key={tag}
              className="hero-tag"
              onClick={() => handleTagClick(tag)}
              id={`hero-tag-${tag.toLowerCase()}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Feature pills */}
      <div className="hero-features" aria-hidden="true">
        <div className="hero-feature-pill"><Shield size={13} /> Free to use</div>
        <div className="hero-feature-pill"><Zap size={13} /> Instant download</div>
        <div className="hero-feature-pill"><TrendingUp size={13} /> Daily updates</div>
      </div>
    </section>
  );
}
