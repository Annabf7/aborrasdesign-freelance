import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ThisWasAdded.css';

const ThisWasAdded = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    artworkImage,
    artworkName,
    size,
    quantity,
    totalPrice,
    variant_id, // Asegura que tenim el variant_id
  } = location.state || {};

  // Verifica que tots els camps són vàlids
  if (!variant_id || !quantity) {
    console.error('Missing required fields: variant_id or quantity');
    return (
      <div className="error-message">
        <p>Invalid product data. Please try again.</p>
      </div>
    );
  }

  const handleViewInSpace = () => {
    navigate('/view-in-space', {
      state: { artworkImage, artworkName, size, quantity, totalPrice },
    });
  };

  return (
    <div className="this-was-added-overlay">
      <div className="this-was-added-window">
        <div className="header-container">
          <h2>This was added to your cart</h2>
          <button className="close-button" onClick={() => navigate(-1)}>
            &times;
          </button>
        </div>
        <img src={artworkImage} alt={artworkName} className="artwork-preview" />
        <h3>{artworkName}</h3>
        <div className="order-details">
          <div className="order-size">
            <label htmlFor="size">Size</label>
            <p>{size}</p>
          </div>
          <div className="order-quantity">
            <label htmlFor="quantity">Quantity</label>
            <p>{quantity}</p>
          </div>
          <div className="order-price">
            <p>Total: €{totalPrice.toFixed(2)}</p>
          </div>
        </div>
        <button className="buy-button" onClick={handleViewInSpace}>
          View in space & buy
        </button>
      </div>
    </div>
  );
};

export default ThisWasAdded;
