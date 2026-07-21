import { useState, useEffect, useRef } from 'react';
import ImageCard from './ImageCard';

export default function MasonryGallery({ images, savedIds, onSave, onView, onDelete }) {
  const [displayed, setDisplayed] = useState(images);
  const [opacity, setOpacity] = useState(1);
  const prevRef = useRef(images);

  useEffect(() => {
    if (prevRef.current === images) return;
    prevRef.current = images;

    setOpacity(0);
    const t = setTimeout(() => {
      setDisplayed(images);
      setOpacity(1);
    }, 190);
    return () => clearTimeout(t);
  }, [images]);

  if (displayed.length === 0 && opacity === 1) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3 className="empty-title">No images found</h3>
        <p className="empty-sub">Try a different search term or category</p>
      </div>
    );
  }

  return (
    <section className="gallery-section">
      <div className="masonry" style={{ opacity, transition: 'opacity 0.19s ease' }}>
        {displayed.map((img, idx) => (
          <div className="masonry-item" key={img.id}>
            <ImageCard
              image={img}
              isSaved={savedIds.has(img.id)}
              onSave={() => onSave(img.id)}
              onView={() => onView(idx)}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

