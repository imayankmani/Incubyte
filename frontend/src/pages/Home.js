import React, { useState, useEffect, useContext } from 'react';
import SweetCard from '../components/SweetCard';
import { AuthContext } from '../context/AuthContext';
import { getAllSweets, searchSweets, updateSweet, deleteSweet } from '../services/api';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Chocolate',
    price: '',
    quantity: '',
    description: '',
    imageUrl: ''
  });

  const categories = ['All', 'Chocolate', 'Candy', 'Gummy', 'Hard Candy', 'Lollipop', 'Other'];

  const fetchSweets = async () => {
    setLoading(true);
    try {
      const response = await getAllSweets();
      setSweets(response.data);
    } catch (error) {
      console.error('Error fetching sweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchParams.name) params.name = searchParams.name;
      if (searchParams.category && searchParams.category !== 'All') {
        params.category = searchParams.category;
      }
      if (searchParams.minPrice) params.minPrice = searchParams.minPrice;
      if (searchParams.maxPrice) params.maxPrice = searchParams.maxPrice;

      const response = await searchSweets(params);
      setSweets(response.data);
    } catch (error) {
      console.error('Error searching sweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({
      name: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    });
    fetchSweets();
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet);
    setFormData({ ...sweet });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sweet?')) return;
    try {
      await deleteSweet(id);
      alert('Sweet deleted successfully!');
      fetchSweets();
    } catch (error) {
      alert(error.response?.data?.error || 'Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSweet(editingSweet._id, formData);
      alert('Sweet updated successfully!');
      resetForm();
      fetchSweets();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Update failed';
      alert('Error: ' + errorMsg);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Chocolate',
      price: '',
      quantity: '',
      description: '',
      imageUrl: ''
    });
    setEditingSweet(null);
    setShowModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>🍬 Welcome to Sweet Shop</h1>
        <p>Discover the sweetest treats in town!</p>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchParams.name}
            onChange={(e) => setSearchParams({...searchParams, name: e.target.value})}
          />
          
          <select
            value={searchParams.category}
            onChange={(e) => setSearchParams({...searchParams, category: e.target.value})}
          >
            {categories.map(cat => (
              <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={searchParams.minPrice}
            onChange={(e) => setSearchParams({...searchParams, minPrice: e.target.value})}
          />

          <input
            type="number"
            placeholder="Max Price"
            value={searchParams.maxPrice}
            onChange={(e) => setSearchParams({...searchParams, maxPrice: e.target.value})}
          />

          <button onClick={handleSearch} className="btn-search">Search</button>
          <button onClick={handleReset} className="btn-reset">Reset</button>
        </div>
      </div>

      <div className="sweets-container">
        {loading ? (
          <div className="loading">Loading delicious sweets...</div>
        ) : sweets.length === 0 ? (
          <div className="no-results">No sweets found. Try different search criteria!</div>
        ) : (
          <div className="sweets-grid">
            {sweets.map(sweet => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onUpdate={fetchSweets}
                onEdit={handleEdit}
                onDelete={() => handleDelete(sweet._id)}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && user?.role === 'admin' && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Sweet</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Sweet Name *</label>
                <input
                  placeholder="Enter sweet name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="4"
                  placeholder="Enter sweet description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Sweet Image</label>
                <div className="image-input-group">
                  <input
                    type="url"
                    placeholder="Paste image URL or upload below"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                  <div className="file-upload-wrapper">
                    <label htmlFor="file-upload-home" className="file-upload-label">
                      📷 Choose Image
                    </label>
                    <input
                      id="file-upload-home"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
                {formData.imageUrl && (
                  <div className="image-preview">
                    <img src={formData.imageUrl} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  Update Sweet
                </button>
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;