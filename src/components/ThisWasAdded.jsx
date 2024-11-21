import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ThisWasAdded.css";

const ThisWasAdded = ({
  artworkImage,
  artworkName,
  artworkPrice,
  size,
  quantity,
  totalPrice,
  onClose,
}) => {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const [currentTotalPrice, setCurrentTotalPrice] = useState(totalPrice);
  const navigate = useNavigate();

  // Funció per actualitzar la quantitat i el preu total
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setCurrentQuantity(newQuantity);
    const newTotalPrice = artworkPrice * newQuantity;
    setCurrentTotalPrice(newTotalPrice); // Actualitza el preu total
  };

  const handleViewInSpace = () => {
    // Redirigeix a ViewInSpace amb les dades seleccionades
    navigate("/view-in-space", {
      state: { artworkImage, artworkName, size, currentQuantity, currentTotalPrice },
    });
  };

  return (
    <div className="this-was-added-overlay">
      <div className="this-was-added-window">
        <div className="header-container">
          <h2>This was added to your cart</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <img src={artworkImage} alt={artworkName} className="artwork-preview" />
        <h3>{artworkName}</h3>
        <div className="order-details">
          <div className="order-size">
            <label htmlFor="size">Size</label>
            <p>{size}</p> {/* Mostra la mida seleccionada */}
          </div>
          <div className="order-quantity">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              value={currentQuantity}
              min="1"
              onChange={handleQuantityChange} // Actualitza la quantitat i el preu total
            />
          </div>
          <div className="order-price">
            <p>Total: ${currentTotalPrice.toFixed(2)}</p> {/* Mostra el preu actualitzat */}
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
