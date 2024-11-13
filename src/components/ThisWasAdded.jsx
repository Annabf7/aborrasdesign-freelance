import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../styles/ThisWasAdded.css"; 

const ThisWasAdded = ({ artworkImage, artworkName, artworkPrice, onClose }) => {
  const [size, setSize] = useState("Medium");
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(artworkPrice);

  const navigate = useNavigate(); 

  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  const handleQuantityChange = (e) => {
    const qty = e.target.value;
    setQuantity(qty);
    setTotalPrice(artworkPrice * qty); // Calcula el preu segons la quantitat
  };

  const handleViewInSpace = () => {
    // Redirigeix a ViewInSpace amb les dades seleccionades
    navigate("/view-in-space", {
      state: { artworkImage, artworkName, size, quantity, totalPrice },
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
            <select id="size" value={size} onChange={handleSizeChange}>
              <option value="Small">Small 8"x10"</option>
              <option value="Medium">Medium 12"x16"</option>
              <option value="Large">Large 16"x20"</option>
            </select>
          </div>
          <div className="order-quantity">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
            />
          </div>
          <div className="order-price">
            <p>Total: ${totalPrice.toFixed(2)}</p>
          </div>
        </div>
        <button className="buy-button" onClick={handleViewInSpace}>
          {" "}
          {/* Afegeix la funció de redirecció */}
          View in space & buy
        </button>
      </div>
    </div>
  );
};

export default ThisWasAdded;
