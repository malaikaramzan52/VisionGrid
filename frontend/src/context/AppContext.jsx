import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const mapImage = useCallback((img) => ({
    id: img.id,
    url: img.image_url,
    title: img.title,
    category: img.categories?.name || 'General',
    category_id: img.category_id,
    author: img.users?.name || 'Creator',
    user_id: img.user_id,
    likes: 0,
    saves: 0,
  }), []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  // Fetch all images or images by category
  const fetchImages = useCallback(async (categoryId = null) => {
    setLoading(true);
    try {
      const endpoint = categoryId ? `/images/category/${categoryId}` : '/images';
      const res = await api.get(endpoint);
      const mapped = (res.data.images || []).map(mapImage);
      setImages(mapped);
    } catch (err) {
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  }, [mapImage]);

  // Fetch wishlist
  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      const res = await api.get('/wishlist');
      const formatted = (res.data.wishlist || [])
        .filter(item => item.images)
        .map(item => mapImage(item.images));
      setWishlist(formatted);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  }, [user, mapImage]);

  // Add to wishlist
  const addToWishlist = useCallback(async (image) => {
    if (!user) return;
    try {
      // Optimistic UI update
      setWishlist(prev => {
        if (prev.some(i => i.id === image.id)) return prev;
        return [image, ...prev];
      });
      await api.post('/wishlist', { image_id: image.id });
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      // Rollback
      setWishlist(prev => prev.filter(i => i.id !== image.id));
    }
  }, [user]);

  // Remove from wishlist
  const removeFromWishlist = useCallback(async (imageId) => {
    if (!user) return;
    try {
      // Optimistic UI update
      setWishlist(prev => prev.filter(i => i.id !== imageId));
      await api.delete(`/wishlist/${imageId}`);
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      fetchWishlist();
    }
  }, [user, fetchWishlist]);

  // Delete own image
  const deleteImage = useCallback(async (imageId) => {
    if (!user) return;
    // Optimistic UI update
    setImages(prev => prev.filter(i => i.id !== imageId));
    setWishlist(prev => prev.filter(i => i.id !== imageId));
    try {
      await api.delete(`/images/${imageId}`);
    } catch (err) {
      console.error('Error deleting image:', err);
      // Rollback by re-fetching
      fetchImages();
      fetchWishlist();
      throw err; // re-throw so caller can show error toast
    }
  }, [user, fetchImages, fetchWishlist]);

  // Sync wishlist on login/logout
  useEffect(() => {
    fetchWishlist();
  }, [user, fetchWishlist]);

  /* ── Download counter ── */
  const [downloadCount, setDownloadCount] = useState(0);
  const incrementDownload = useCallback(() => {
    setDownloadCount(c => c + 1);
  }, []);

  /* ── Wishlist sidebar ── */
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const toggleWishlist = useCallback(() => setWishlistOpen(o => !o), []);
  const closeWishlist  = useCallback(() => setWishlistOpen(false), []);

  return (
    <AppContext.Provider value={{
      wishlist, addToWishlist, removeFromWishlist,
      categories, fetchCategories,
      images, setImages, fetchImages, loading,
      downloadCount, incrementDownload,
      wishlistOpen, toggleWishlist, closeWishlist,
      mapImage,
      deleteImage,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
