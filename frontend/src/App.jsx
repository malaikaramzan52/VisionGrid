import { useState, useMemo, useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MasonryGallery from './components/MasonryGallery';
import Lightbox from './components/Lightbox';
import UploadModal from './components/UploadModal';
import WishlistSidebar from './components/WishlistSidebar';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useApp } from './context/AppContext';

function App() {
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIdx, setLightboxIdx]     = useState(null);
  const [showUpload, setShowUpload]       = useState(false);
  const [savedIds, setSavedIds]           = useState(new Set());
  const [scrolled, setScrolled]           = useState(false);
  const [toast, setToast]                 = useState(null);

  const { 
    categories, 
    fetchCategories, 
    images, 
    setImages, 
    fetchImages, 
    mapImage,
    deleteImage,
  } = useApp();

  /* ── Fetch initial categories ── */
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /* ── Fetch images when category changes ── */
  useEffect(() => {
    const selectedCat = categories.find(c => c.name === activeCategory);
    const categoryId = selectedCat ? selectedCat.id : null;
    fetchImages(categoryId);
  }, [activeCategory, categories, fetchImages]);

  /* ── Dark mode ── */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  /* ── Scroll shadow on navbar ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Filtered images (memoised) ── */
  const filteredImages = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return images.filter((img) => {
      const matchSearch =
        !q ||
        img.title.toLowerCase().includes(q) ||
        img.author.toLowerCase().includes(q) ||
        img.category.toLowerCase().includes(q);
      return matchSearch;
    });
  }, [images, searchQuery]);

  /* ── Save toggle (legacy placeholder) ── */
  const handleSave = useCallback((id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      const adding = !next.has(id);
      adding ? next.add(id) : next.delete(id);
      showToast(adding ? '❤️ Saved to collection' : 'Removed from collection');
      return next;
    });
  }, []);

  /* ── Delete image ── */
  const handleDelete = useCallback(async (imageId) => {
    const confirmed = window.confirm('Are you sure you want to delete this image? This cannot be undone.');
    if (!confirmed) return;
    try {
      await deleteImage(imageId);
      // Close lightbox if the deleted image was open
      setLightboxIdx(null);
      showToast('🗑️ Image deleted successfully.');
    } catch {
      showToast('❌ Failed to delete image. Please try again.');
    }
  }, [deleteImage]);

  /* ── Upload ── */
  const handleUpload = useCallback((newImg) => {
    const mapped = mapImage(newImg);
    setImages((prev) => [mapped, ...prev]);
    setShowUpload(false);
    showToast('🎉 Image added to gallery!');
  }, [setImages, mapImage]);

  /* ── Toast helper ── */
  const toastTimer = useState(null)[0];
  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer);
    setTimeout(() => setToast(null), 2400);
  }

  /* ── Results label ── */
  const resultsLabel = useMemo(() => {
    const count = filteredImages.length;
    let label = `${count} ${count === 1 ? 'image' : 'images'}`;
    if (activeCategory !== 'All') label += ` in ${activeCategory}`;
    if (searchQuery) label += ` for "${searchQuery}"`;
    return label;
  }, [filteredImages.length, activeCategory, searchQuery]);

  return (
    <>
      <Routes>
        {/* Auth routes without Navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Standard layout routes with Navbar */}
        <Route
          path="/*"
          element={
            <>
              <Navbar
                darkMode={darkMode}
                onToggleDark={() => setDarkMode((d) => !d)}
                searchQuery={searchQuery}
                onSearch={setSearchQuery}
                activeCategory={activeCategory}
                onCategory={setActiveCategory}
                onUploadClick={() => setShowUpload(true)}
                scrolled={scrolled}
              />
              <WishlistSidebar />

              <Routes>
                <Route
                  index
                  element={
                    <main className="main-content">
                      <p className="results-meta">{resultsLabel}</p>
                      <MasonryGallery
                        images={filteredImages}
                        savedIds={savedIds}
                        onSave={handleSave}
                        onView={setLightboxIdx}
                        onDelete={handleDelete}
                      />
                    </main>
                  }
                />
                <Route 
                  path="profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="settings" 
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>

              {lightboxIdx !== null && (
                <Lightbox
                  images={filteredImages}
                  index={lightboxIdx}
                  onClose={() => setLightboxIdx(null)}
                  onNavigate={setLightboxIdx}
                />
              )}

              {showUpload && (
                <UploadModal
                  onClose={() => setShowUpload(false)}
                  onUpload={handleUpload}
                />
              )}
            </>
          }
        />
      </Routes>

      {/* Toast notification */}
      <div className={`toast${toast ? ' visible' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}

export default App;