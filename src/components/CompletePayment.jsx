import React, { useContext } from "react";
import { ArtworkContext } from "./ArtworkContext";
import { ShippingContext } from "./ShippingContext";
import { CartContext } from "./CartContext"; // Nou context per gestionar el carretó
import ProductCard from "./ProductCard";
import OrderSummary from "./OrderSummary";
import defaultImage from "../assets/generative/style_1.png";
import secureIcon from "../assets/icons/candado.png";
import "../styles/CompletePayment.css";

const CompletePayment = () => {
  const { artworkImage } = useContext(ArtworkContext);
  const { userAddress } = useContext(ShippingContext);
  const { quantity, setQuantity } = useContext(CartContext); // Accedeix a quantity des de CartContext

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const cartItem = {
    price: 800,
    name: "Noise Field",
    size: 'Medium 18 x 24 "standard"',
    image: artworkImage || defaultImage,
    quantity,
  };

  const handleConfirmPayment = () => {
    console.log("Processing payment...");
  };

  return (
    <div className="containerWrapper">
      <div className="paymentContainer">
        <section className="paymentInfo">
          <div className="paymentHeader">
            <h2>Payment</h2>
            <button className="signInLink">Sign in to your account</button>
          </div>

          <div className="shippingInfo">
            <h4>Shipping Info</h4>
            {userAddress && (
              <p>
                {userAddress.firstName} {userAddress.lastName}, {userAddress.address},{" "}
                {userAddress.city}, {userAddress.country}, {userAddress.postalCode}
              </p>
            )}
          </div>

          <div className="paymentMethod">
            <h4>Payment Method</h4>
            <label>
              <input type="radio" name="payment" defaultChecked />
              Pay with Credit Card
            </label>
            <input type="text" placeholder="Card number" />
          </div>

          <button className="paymentButton" onClick={handleConfirmPayment}>
            Confirm Payment
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

export default CompletePayment;
