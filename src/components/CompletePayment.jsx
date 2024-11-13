// CompletePayment.jsx
import React, { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js"; // Pas 2: Importem Stripe
import { ArtworkContext } from "./ArtworkContext";
import { ShippingContext } from "./ShippingContext";
import { CartContext } from "./CartContext";
import ProductCard from "./ProductCard";
import OrderSummary from "./OrderSummary";
import defaultImage from "../assets/generative/style_1.png";
import secureIcon from "../assets/icons/candado.png";
import "../styles/CompletePayment.css";

// Crea una instància de Stripe amb la clau pública
const stripePromise = loadStripe(
  "pk_test_51QFKM62KU97iEHk7wEnB6ebDp4H8u1pw2hOQNfRgtlsXGvnKo4nedhGYpAGVi3gYtVnBsFziPgLPFyhlC8rEh78800fljsYHQJ"
);

const CompletePayment = () => {
  const { artworkImage } = useContext(ArtworkContext);
  const { userAddress } = useContext(ShippingContext);
  const { quantity, setQuantity } = useContext(CartContext);

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const cartItem = {
    price: 800,
    name: "Noise Field",
    size: 'Medium 18 x 24 "standard"',
    image: artworkImage || defaultImage,
    quantity,
  };

  const handleConfirmPayment = async () => {
    const stripe = await stripePromise; // Carrega Stripe

    // Crida al backend per crear una sessió de pagament
    const response = await fetch("http://localhost:4000/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            name: cartItem.name,
            price: cartItem.price,
            quantity: cartItem.quantity,
          },
        ],
      }),
    });

    const session = await response.json();

    // Redirigeix a Stripe Checkout
    const result = await stripe.redirectToCheckout({ sessionId: session.id });
    if (result.error) {
      console.error("Error al redirigir a Stripe:", result.error.message);
    }
  };

  return (
    <div className="containerWrapper">
      <div className="paymentContainer">
        <section className="paymentInfo">
          <div className="paymentHeader">
            <h2>Payment</h2>
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
