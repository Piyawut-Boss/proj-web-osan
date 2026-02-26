import { useState, useEffect } from 'react';
import api, { getImageUrl } from '../../utils/api';

export default function CarouselManager({ section, label, onAlert }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    loadImages();
  }, [section]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/carousel/${section}`);
      setImages(res.data.data || []);
    } catch (e) {
      onAlert?.('Failed to load carousel images', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await api.post(`/carousel/${section}/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setImages([...images, { id: res.data.id, image_path: res.data.imagePath, sort_order: images.length }]);
      onAlert?.('Image added successfully', 'success');
    } catch (e) {
      onAlert?.('Failed to upload image: ' + (e.response?.data?.message || e.message), 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await api.delete(`/carousel/${imageId}`);
      setImages(images.filter(img => img.id !== imageId));
      onAlert?.('Image deleted successfully', 'success');
    } catch (e) {
      onAlert?.('Failed to delete image', 'error');
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropAndReorder = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === targetIndex) return;

    const newImages = [...images];
    if (draggedItem < targetIndex) {
      for (let i = draggedItem; i < targetIndex; i++) {
        [newImages[i], newImages[i + 1]] = [newImages[i + 1], newImages[i]];
      }
    } else {
      for (let i = draggedItem; i > targetIndex; i--) {
        [newImages[i], newImages[i - 1]] = [newImages[i - 1], newImages[i]];
      }
    }

    setImages(newImages);
    setDraggedItem(null);

    // Update sort order on server
    try {
      const imageIds = newImages.map(img => img.id);
      await api.put(`/carousel/${section}/reorder`, { imageIds });
    } catch (e) {
      onAlert?.('Failed to update image order', 'error');
      loadImages(); // Revert to server state
    }
  };

  if (loading) {
    return <div style={{padding:'20px',color:'var(--text-light)'}}>Loading carousel images...</div>;
  }

  return (
    <div className="carousel-manager">
      <div className="carousel-header">
        <h3>{label}</h3>
        <label className="btn btn-secondary" style={{cursor:'pointer'}}>
          📷 {uploading ? 'Uploading...' : 'Add Image'}
          <input
            type="file"
            accept="image/*"
            style={{display:'none'}}
            onChange={handleAddImage}
            disabled={uploading}
          />
        </label>
      </div>

      {images.length === 0 ? (
        <div style={{padding:'40px 20px',textAlign:'center',color:'var(--text-light)'}}>
          📷 No images yet. Click "Add Image" to create your carousel.
        </div>
      ) : (
        <div className="carousel-grid">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className={`carousel-item${draggedItem === idx ? ' dragging' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropAndReorder(e, idx)}
            >
              <div className="carousel-item-image">
                <img src={getImageUrl(img.image_path)} alt={`Carousel ${idx + 1}`} />
              </div>
              <div className="carousel-item-meta">
                <div className="carousel-item-order">#{idx + 1}</div>
                <button
                  className="btn-icon btn-danger"
                  onClick={() => handleDeleteImage(img.id)}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .carousel-manager { margin: 24px 0; padding: 20px; background: #f8faff; border-radius: 12px; }
        .carousel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 16px; }
        .carousel-header h3 { margin: 0; font-size: 1rem; color: var(--primary); }
        .carousel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; }
        .carousel-item { position: relative; border: 2px dashed var(--border); border-radius: 10px; overflow: hidden; cursor: grab; transition: all 0.2s; background: #fff; }
        .carousel-item:hover { border-color: var(--primary); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .carousel-item.dragging { opacity: 0.5; transform: scale(0.95); }
        .carousel-item-image { width: 100%; padding-bottom: 100%; position: relative; background: #f0f4ff; }
        .carousel-item-image img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .carousel-item-meta { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); padding: 8px; display: flex; justify-content: space-between; align-items: center; color: #fff; font-size: 0.75rem; }
        .carousel-item-order { font-weight: 600; }
        .btn-icon { background: none; border: none; color: #ff6b6b; font-size: 1rem; cursor: pointer; padding: 4px; border-radius: 4px; transition: all 0.2s; }
        .btn-icon:hover { background: rgba(255,107,107,0.2); }
        .btn-danger:hover { color: #ff5252; }
        @media(max-width:800px) { .carousel-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); } }
      `}</style>
    </div>
  );
}
