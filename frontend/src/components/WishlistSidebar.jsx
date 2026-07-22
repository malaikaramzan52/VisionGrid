import { useEffect } from 'react';
import { X, Heart, Download, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { triggerDirectDownload } from '../utils/downloadUtils';

export default function WishlistSidebar() {
  const { wishlist, removeFromWishlist, wishlistOpen, closeWishlist, incrementDownload } = useApp();

  /* Lock body scroll when open */
  useEffect(() => {
    if (wishlistOpen) document.body.style.overflow = 'hidden';
    else              document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [wishlistOpen]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeWishlist(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeWishlist]);

  const handleDownload = async (img) => {
    await triggerDirectDownload(img.url, img.title);
    incrementDownload();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`wishlist-backdrop${wishlistOpen ? ' visible' : ''}`}
        onClick={closeWishlist}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        className={`wishlist-sidebar${wishlistOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist"
      >
        {/* Header */}
        <div className="wishlist-header">
          <div className="wishlist-title-row">
            <Heart size={18} className="wishlist-title-icon" />
            <h2 className="wishlist-title">My Wishlist</h2>
            {wishlist.length > 0 && (
              <span className="wishlist-count-badge">{wishlist.length}</span>
            )}
          </div>
          <button
            className="wishlist-close-btn"
            onClick={closeWishlist}
            aria-label="Close wishlist"
            id="wishlist-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="wishlist-body">
          {wishlist.length === 0 ? (
            <div className="wishlist-empty">
              <div className="wishlist-empty-icon">
                <ShoppingBag size={36} />
              </div>
              <p className="wishlist-empty-title">Your wishlist is empty</p>
              <p className="wishlist-empty-sub">
                Click the ♥ icon on any image to save it here
              </p>
            </div>
          ) : (
            <ul className="wishlist-list" role="list">
              {wishlist.map((img) => (
                <li key={img.id} className="wishlist-item">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="wishlist-item-thumb"
                    loading="lazy"
                  />
                  <div className="wishlist-item-info">
                    <p className="wishlist-item-title">{img.title}</p>
                    <p className="wishlist-item-meta">{img.category} · by {img.author}</p>
                  </div>
                  <div className="wishlist-item-actions">
                    <button
                      className="wishlist-action-btn"
                      onClick={() => handleDownload(img)}
                      aria-label={`Download ${img.title}`}
                      title="Download"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      className="wishlist-action-btn danger"
                      onClick={() => removeFromWishlist(img.id)}
                      aria-label={`Remove ${img.title} from wishlist`}
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="wishlist-footer">
            <p className="wishlist-footer-count">
              {wishlist.length} {wishlist.length === 1 ? 'image' : 'images'} saved
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
