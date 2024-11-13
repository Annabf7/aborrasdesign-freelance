import React, { useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import { ArtworkContext } from "./ArtworkContext";
import { ShippingContext } from "./ShippingContext";
import { CartContext } from "./CartContext"; // Nou context per gestionar el carretó
import "../styles/ShippingInfo.css";
import defaultImage from "../assets/generative/style_1.png";
import secureIcon from "../assets/icons/candado.png";
import ProductCard from "./ProductCard";
import OrderSummary from "./OrderSummary";

export const ShippingInfo = () => {
  const { artworkImage } = useContext(ArtworkContext);
  const { userAddress } = useContext(ShippingContext);
  const { quantity, setQuantity } = useContext(CartContext); // Accedeix a quantity des de CartContext
  const navigate = useNavigate(); // Inicialitzem useNavigate

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handlePaymentNavigation = () => {
    navigate("/completepayment"); // Redirigim a la pàgina de pagament
  };

  const cartItem = {
    price: 800,
    name: "Noise Field",
    size: 'Medium 18 x 24 "standard"',
    image: artworkImage || defaultImage,
    quantity,
  };

  return (
    <div className="containerWrapper">
      <div className="shippingInfoContainer">
        <section className="shippingInfoSection">
          <div className="shippingHeader">
            <h2>Shipping Info</h2>
          </div>
          <hr className="divider" />
          {userAddress && (
            <div className="userAddressSection">
              <p>
                {userAddress.firstName} {userAddress.lastName}
              </p>
              <p>{userAddress.address}</p>
              <p>
                {userAddress.city}, {userAddress.country} - {userAddress.postalCode}
              </p>
              <p>{userAddress.phone}</p>
            </div>
          )}
          <hr className="divider" />
          <div className="shippingMethod">
            <div className="radioButton">
              <input type="radio" id="standard" name="shipping" defaultChecked readOnly />
            </div>
            <div className="shippingLabel">
              <label htmlFor="standard">Standard: Items typically deliver in 10-20 days</label>
            </div>
            <div className="shippingPrice">
              <span>€6.12</span>
            </div>
          </div>

          <div className="additionalInfo">
            <h4>Additional Shipping Information</h4>
            <p>
              Please note that delivery times may vary due to global supply chain challenges. For
              more details on potential delays, click here.
            </p>
            <h4>International Orders</h4>
            <p>
              Orders shipped internationally may be subject to additional duties or customs fees.
              These charges are applied by the Customs Office of the destination country and are not
              included in the total order cost. Please note that these fees are neither charged nor
              collected by Aborrasdesign, but by the local authorities.
            </p>
          </div>
          <button className="paymentButton" onClick={handlePaymentNavigation}>
            Next: Payment & Complete Order
          </button>
          <div className="secureInfo">
            <img src={secureIcon} alt="Secure Icon" />
            <span>Your information is secure</span>
          </div>
        </section>

        <section className="cartSummary">
          <ProductCard {...cartItem} onIncrement={handleIncrement} onDecrement={handleDecrement} />
          <OrderSummary subtotal={cartItem.price * cartItem.quantity} shipping={6.12} />
        </section>
      </div>
    </div>
  );
};

export default ShippingInfo;
