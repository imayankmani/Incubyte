import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  getAllSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  restockSweet
} from '../services/api';
import SweetCard from '../components/SweetCard';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [sweets, setSweets] = useState([]);
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

  const categories = ['Chocolate', 'Candy', 'Gummy', 'Hard Candy', 'Lollipop', 'Other'];

  const fetchSweets = async () => {
    try {
      const res = await getAllSweets();
      setSweets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchSweets();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSweet) {
        await updateSweet(editingSweet._id, formData);
        alert('Sweet updated');
      } else {
        console.log('Submitting sweet data:', formData);
        const response = await createSweet(formData);
        console.log('Response:', response);
        alert('Sweet added successfully!');
      }
      resetForm();
      fetchSweets();
    } catch (err) {
      console.error('Error details:', err);
      console.error('Error response:', err.response);
      const errorMsg = err.response?.data?.error || err.message || 'Operation failed';
      alert('Error: ' + errorMsg);
    }
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet);
    setFormData({ ...sweet });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sweet?')) return;
    await deleteSweet(id);
    fetchSweets();
  };

  const handleRestock = async (id) => {
    const qty = prompt('Enter restock quantity');
    if (qty > 0) {
      await restockSweet(id, Number(qty));
      fetchSweets();
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

  if (user?.role !== 'admin') {
    return <div className="admin-container">Access Denied</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🛠 Admin Panel</h1>
        <button onClick={() => setShowModal(true)}>+ Add Sweet</button>
      </div>

      <div className="sweets-grid">
        {sweets.map(sweet => (
          <div key={sweet._id}>
            <SweetCard
              sweet={sweet}
              onEdit={handleEdit}
              onDelete={() => handleDelete(sweet._id)}
            />
            <button className="btn-restock" onClick={() => handleRestock(sweet._id)}>📦 Restock</button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingSweet ? 'Edit Sweet' : 'Add Sweet'}</h2>

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
                  {categories.map(c => (
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
                    <label htmlFor="file-upload" className="file-upload-label">
                      📷 Choose Image
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, imageUrl: reader.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </div>
                  {formData.imageUrl && (
                    <div className="image-preview">
                      <img src={formData.imageUrl} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-submit" type="submit">Save</button>
                <button className="btn-cancel" type="button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
