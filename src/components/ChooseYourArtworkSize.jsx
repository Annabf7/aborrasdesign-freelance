import React, { useState, useContext } from "react";
import { ArtworkContext } from "./ArtworkContext"; // Importem el context
import "../styles/ChooseYourArtworkSize.css";
import crudeImage from "../assets/crude.png"; // Imatge per defecte
import starIcon from "../assets/icons/star.svg";
import ThisWasAdded from "./ThisWasAdded";

const ChooseYourArtworkSize = () => {
  const { artworkImage } = useContext(ArtworkContext); // Utilitzem el context
  const [size, setSize] = useState("Medium");
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleConfirmOrder = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="choose-artwork-container">
        <div className="artwork-size-selection">
          <div className="artwork-preview">
            <img
              src={artworkImage || crudeImage} // Utilitza la imatge global o la per defecte
              alt="Artwork Preview"
              className="artwork-image"
            />
          </div>
          <div className="artwork-column">
            <h1 className="choose-title">Choose Your Artwork Size</h1>
            <div className="artwork-options">
              <h2>Noise Field</h2>

              <div className="rating-stars">
                <img src={starIcon} alt="Star" />
                <img src={starIcon} alt="Star" />
                <img src={starIcon} alt="Star" />
                <img src={starIcon} alt="Star" />
                <img src={starIcon} alt="Star" />
              </div>

              <label htmlFor="artwork-size">Choose Size:</label>
              <select id="artwork-size" value={size} onChange={handleSizeChange}>
                <option value="Small">Small - 8"x10"</option>
                <option value="Medium">Medium - 12"x16"</option>
                <option value="Large">Large - 16"x20"</option>
              </select>

              <label htmlFor="artwork-quantity">Quantity:</label>
              <input
                type="number"
                id="artwork-quantity"
                min="1"
                max="10"
                value={quantity}
                onChange={handleQuantityChange}
              />

              <button onClick={handleConfirmOrder} className="confirm-button">
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ThisWasAdded
          artworkImage={artworkImage || crudeImage}
          artworkName="Noise Field"
          artworkPrice={50.0}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ChooseYourArtworkSize;
