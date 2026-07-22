import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { triggerDirectDownload } from '../utils/downloadUtils';

export default function Lightbox({ images, index, onClose, onNavigate }) {
  const { incrementDownload } = useApp();
  const image = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  const handleDownload = async () => {
    if (!image) return;
    await triggerDirectDownload(image.url, image.title);
    incrementDownload();
  };

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Keyboard navigation
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape')      onClose();
    if (e.key === 'ArrowLeft'  && hasPrev) onNavigate(index - 1);
    if (e.key === 'ArrowRight' && hasNext) onNavigate(index + 1);
  }, [index, hasPrev, hasNext, onClose, onNavigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  if (!image) return null;

  return (
    <div className="lightbox-overlay" role="dialog" aria-modal="true" aria-label="Image viewer">
      {/* Click backdrop to close */}
      <div className="lightbox-close-overlay" onClick={onClose} />

      {/* Counter */}
      <span className="lightbox-counter">{index + 1} / {images.length}</span>

      {/* Close button */}
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        <X size={18} />
      </button>

      {/* Prev / Next */}
      <button
        className="lightbox-nav lightbox-prev"
        onClick={() => hasPrev && onNavigate(index - 1)}
        disabled={!hasPrev}
        aria-label="Previous image"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        className="lightbox-nav lightbox-next"
        onClick={() => hasNext && onNavigate(index + 1)}
        disabled={!hasNext}
        aria-label="Next image"
      >
        <ChevronRight size={22} />
      </button>

      {/* Main content */}
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img
          key={image.id}
          className="lightbox-img"
          src={image.url}
          alt={image.title}
          draggable={false}
        />
        <div className="lightbox-info flex items-center justify-between">
          <div>
            <p className="lightbox-title">{image.title}</p>
            <p className="lightbox-meta">{image.category} · by {image.author}</p>
          </div>
          <button
            className="action-btn download-btn-lightbox"
            onClick={handleDownload}
            aria-label={`Download ${image.title}`}
            title="Download image"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--accent, #6366f1)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}
