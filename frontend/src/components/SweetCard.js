import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { purchaseSweet } from '../services/api';
import './SweetCard.css';

const SweetCard = ({ sweet, onUpdate, onDelete, onEdit }) => {
  const { user, token } = useContext(AuthContext);
  const [purchasing, setPurchasing] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handlePurchase = async () => {
    if (!token) {
      alert('Please login to purchase');
      return;
    }

    setPurchasing(true);
    try {
      await purchaseSweet(sweet._id, quantity);
      alert(`Successfully purchased ${quantity} ${sweet.name}(s)!`);
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.error || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="sweet-card">
      <div className="sweet-image">
        {sweet.imageUrl ? (
          <img src={sweet.imageUrl} alt={sweet.name} />
        ) : (
          <div className="sweet-placeholder">🍬</div>
        )}
        {isOutOfStock && <div className="out-of-stock-badge">Out of Stock</div>}
      </div>

      <div className="sweet-content">
        <h3 className="sweet-name">{sweet.name}</h3>
        <span className="sweet-category">{sweet.category}</span>
        
        {sweet.description && (
          <p className="sweet-description">{sweet.description}</p>
        )}

        <div className="sweet-footer">
          <div className="sweet-info">
            <span className="sweet-price">${sweet.price.toFixed(2)}</span>
            <span className="sweet-stock">
              Stock: <strong>{sweet.quantity}</strong>
            </span>
          </div>

          <div className="sweet-actions">
            {isAdmin ? (
              <>
                <button onClick={() => onEdit(sweet)} className="btn-edit">
                  ✏️ Edit
                </button>
                <button onClick={() => onDelete(sweet._id)} className="btn-delete">
                  🗑️ Delete
                </button>
              </>
            ) : (
              <>
                <div className="quantity-selector">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(sweet.quantity, quantity + 1))}
                    disabled={isOutOfStock}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handlePurchase}
                  disabled={isOutOfStock || purchasing}
                  className="btn-purchase"
                >
                  {purchasing ? '...' : '🛒 Buy'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SweetCard;