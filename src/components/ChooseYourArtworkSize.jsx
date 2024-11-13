import React, { useState, useContext, useEffect } from "react";
import { ArtworkContext } from "./ArtworkContext";
import "../styles/ChooseYourArtworkSize.css";
import crudeImage from "../assets/crude.png";
import starIcon from "../assets/icons/star.svg";
import ThisWasAdded from "./ThisWasAdded";

const ChooseYourArtworkSize = () => {
  const { artworkImage } = useContext(ArtworkContext);
  const [size, setSize] = useState("Medium");
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [syncVariants, setSyncVariants] = useState([]);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/printful/products");
        const data = await response.json();
        setSyncVariants(data);
        console.log("Variants sincronitzats:", data);
      } catch (error) {
        console.error("Error obtenint les variants:", error);
      }
    };
    fetchVariants();
  }, []);

  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleConfirmOrder = async () => {
    setShowModal(true);

    const orderData = {
      recipient: {
        name: "Anna Borras",
        address1: "Carrer de l'Exemple",
        city: "Barcelona",
        country_code: "ES",
        zip: "08001",
      },
      items: [
        {
          sync_variant_id: syncVariants[0]?.id || null,
          quantity: quantity,
        },
      ],
    };

    console.log("Dades de la comanda:", orderData);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="choose-artwork-container">
        <div className="artwork-size-selection">
          <div className="artwork-preview">
            <img src={artworkImage || crudeImage} alt="Artwork Preview" className="artwork-image" />
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
