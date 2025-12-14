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
        await createSweet(formData);
        alert('Sweet added');
      }
      resetForm();
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed');
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
            <button onClick={() => handleRestock(sweet._id)}>📦 Restock</button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingSweet ? 'Edit Sweet' : 'Add Sweet'}</h2>

            <form onSubmit={handleSubmit}>
              <input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />

              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <input
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />

              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
