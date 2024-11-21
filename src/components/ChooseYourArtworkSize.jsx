import React, { useState, useContext, useEffect } from "react";
import { ArtworkContext } from "./ArtworkContext";
import "../styles/ChooseYourArtworkSize.css";
import crudeImage from "../assets/crude.png";
import starIcon from "../assets/icons/star.svg";
import ThisWasAdded from "./ThisWasAdded";

const ChooseYourArtworkSize = () => {
  const { artworkImage } = useContext(ArtworkContext);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/printful/products");
        const data = await response.json();

        // Normalitzar mides eliminant caràcters especials i filtrar les mides desitjades
        const availableSizes = data
          .map((variant) => ({
            id: variant.id,
            size: variant.size.replace(/[″]/g, '"'), // Substituir el símbol especial per cometes normals
            price: parseFloat(variant.price),
          }))
          .filter((item) => ['10"×10"', '11"×14"', '12"×16"', '16"×20"'].includes(item.size));

        // Eliminar duplicats per mida
        const uniqueSizes = Array.from(
          new Set(availableSizes.map((item) => item.size)) // Filtrar únicament per mida
        ).map((size) => availableSizes.find((item) => item.size === size)); // Recuperar la primera instància de cada mida única

        setSizes(uniqueSizes);
        console.log("Mides disponibles filtrades (sense duplicats):", uniqueSizes);
      } catch (error) {
        console.error("Error obtenint les mides:", error);
      }
    };
    fetchSizes();
  }, []);

  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  const handleQuantityChange = (e) => {
    const qty = e.target.value;
    setQuantity(qty);
    if (size) {
      const selectedSize = sizes.find((item) => item.size === size);
      setTotalPrice(selectedSize.price * qty);
    }
  };

  const handleConfirmOrder = () => {
    // Comprovar si s'ha seleccionat una mida
    if (!size) {
      alert("Please select a size before continuing.");
      return; // No continuar fins que s'hagi seleccionat una mida
    }

    setShowModal(true);

    const selectedSize = sizes.find((item) => item.size === size);
    const totalPrice = selectedSize.price * quantity;

    // Passar les dades seleccionades a la modal
    setTotalPrice(totalPrice);
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
                {sizes.map((item) => (
                  <option key={item.id} value={item.size}>
                    {item.size} - ${item.price}
                  </option>
                ))}
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
          artworkPrice={sizes.find((item) => item.size === size)?.price || 50.0}
          size={size}
          quantity={quantity}
          totalPrice={totalPrice}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ChooseYourArtworkSize;
