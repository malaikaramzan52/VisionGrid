import { useState, useRef, useEffect } from 'react';
import { X, ImagePlus, Upload, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export default function UploadModal({ onClose, onUpload }) {
  const { categories } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileObj, setFileObj] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const displayCategories = categories && categories.length > 0
    ? categories
    : [
        { id: 1, name: 'Nature' },
        { id: 2, name: 'Travel' },
        { id: 3, name: 'Art' },
        { id: 4, name: 'Tech' },
        { id: 5, name: 'Cars' },
        { id: 6, name: 'Anime' },
        { id: 7, name: 'Architecture' }
      ];

  // Set default category selection
  useEffect(() => {
    if (displayCategories.length > 0 && !category) {
      setCategory(displayCategories[0].id);
    }
  }, [displayCategories, category]);

  const acceptFile = (file) => {
    if (!file?.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    setError('');
    setFileObj(file);
    setPreview(URL.createObjectURL(file));
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    acceptFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preview || !fileObj) { setError('Please select an image.'); return; }
    if (!title.trim()) { setError('Please enter a title.'); return; }
    if (!category) { setError('Please select a category.'); return; }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category_id', category);
      formData.append('image', fileObj);

      const res = await api.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onUpload(res.data.image);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Upload Image</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close" disabled={loading}>
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Drop zone */}
          {!preview ? (
            <div
              className={`drop-zone${isDragging ? ' dragging' : ''}`}
              onClick={() => !loading && inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); if (!loading) setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              aria-label="Drop image here or click to select"
            >
              <div className="drop-icon-wrap">
                <ImagePlus size={26} />
              </div>
              <p className="drop-text-main">Drop your image here</p>
              <p className="drop-text-sub">or <span>click to browse</span> · PNG, JPG, WEBP</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => acceptFile(e.target.files[0])}
                disabled={loading}
              />
            </div>
          ) : (
            <div className="preview-wrap">
              <img className="preview-img" src={preview} alt="Preview" />
              <button
                type="button"
                className="preview-remove"
                onClick={() => { setPreview(null); setFileObj(null); }}
                aria-label="Remove image"
                disabled={loading}
              >
                <X size={13} />
              </button>
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="img-title">Title</label>
            <input
              id="img-title"
              className="form-input"
              type="text"
              placeholder="Give your image a title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="img-category">Category</label>
            <div className="select-wrap">
              <select
                id="img-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              >
                {displayCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown size={15} className="select-arrow" />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p style={{ color: '#ef4444', fontSize: 13, marginTop: 10, fontWeight: 500 }}>
              ⚠ {error}
            </p>
          )}

          {/* Submit */}
          <button type="submit" className="btn-submit" disabled={loading || !preview || !title.trim()}>
            {loading ? (
              <span className="auth-spinner" style={{ borderLeftColor: '#fff', width: 14, height: 14 }} />
            ) : (
              <>
                <Upload size={16} />
                Add to Gallery
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
