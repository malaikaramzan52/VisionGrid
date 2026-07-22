import { Heart, Download, Eye, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { triggerDirectDownload } from '../utils/downloadUtils';

export default function ImageCard({ image, isSaved, onSave, onView, onDelete }) {
  const { addToWishlist, removeFromWishlist, wishlist, incrementDownload } = useApp();
  const { user } = useAuth();
  const isWishlisted = wishlist.some(i => i.id === image.id);
  const isOwner = user && String(user.id) === String(image.user_id);

  const handleSave = (e) => {
    e.stopPropagation();
    onSave();
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) removeFromWishlist(image.id);
    else              addToWishlist(image);
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    await triggerDirectDownload(image.url, image.title);
    incrementDownload();
  };

  const handleView = (e) => {
    e.stopPropagation();
    onView();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(image.id);
  };

  const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n;

  return (
    <article
      className="image-card"
      onClick={onView}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onView()}
      aria-label={`View ${image.title}`}
    >
      <img
        className="card-image"
        src={image.url}
        alt={image.title}
        loading="lazy"
        decoding="async"
      />

      <div className="card-overlay">
        {/* ── Top: badge + wishlist + delete ── */}
        <div className="overlay-top">
          <span className="category-badge">{image.category}</span>

          <div className="overlay-top-actions">
            {/* Delete button — only visible to the owner */}
            {isOwner && (
              <button
                className="delete-btn"
                onClick={handleDelete}
                aria-label="Delete image"
                title="Delete your image"
              >
                <Trash2 size={15} />
              </button>
            )}

            <button
              className={`save-btn${isWishlisted ? ' saved' : ''}`}
              onClick={handleWishlist}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* ── Bottom: info + actions ── */}
        <div className="overlay-bottom">
          <div className="card-info">
            <p className="card-title">{image.title}</p>
            <p className="card-author">by {image.author}</p>
            <p className="card-stats">
              <span>♥ {fmt(image.likes)}</span>
              <span>⤓ {fmt(image.saves)}</span>
            </p>
          </div>

          <div className="overlay-actions">
            {/* Download button */}
            <button
              className="action-btn"
              onClick={handleDownload}
              aria-label={`Download ${image.title}`}
              title="Download image"
            >
              <Download size={15} />
            </button>

            {/* Fullscreen view */}
            <button className="action-btn" onClick={handleView} aria-label="View fullscreen">
              <Eye size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
