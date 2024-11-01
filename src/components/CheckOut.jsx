import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArtworkContext } from "./ArtworkContext";
import { ShippingContext } from "./ShippingContext"; // Import the context
import { CartContext } from "./CartContext"; // Nou context per gestionar el carretó
import "../styles/CheckOut.css";
import defaultImage from "../assets/generative/style_1.png";
import paypalIcon from "../assets/icons/paypal.svg";
import amazonIcon from "../assets/icons/amazon.svg";
import secureIcon from "../assets/icons/candado.png";

const FormInput = ({ label, type = "text", ...props }) => (
  <div>
    <label className="formLabel" htmlFor={props.id}>
      {label}
    </label>
    <input type={type} className="formInput" aria-label={label} {...props} />
  </div>
);

const ProductCard = ({ price, name, size, image, quantity, onIncrement, onDecrement }) => (
  <article className="productGrid">
    <img loading="lazy" src={image} alt={name} className="productImage" />
    <div className="productDetails">
      <div className="productInfo">
        <p className="productPrice">€{price}</p>
        <h3 className="productName">{name}</h3>
        <p className="productSize">{size}</p>
        <div className="quantityControls">
          <button onClick={onDecrement} disabled={quantity <= 1}>
            -
          </button>
          <span>{quantity}</span>
          <button onClick={onIncrement}>+</button>
        </div>
        <div className="cartActions">
          <button>Move to wishlist</button>
          <button>Edit item</button>
        </div>
      </div>
    </div>
  </article>
);

const OrderSummary = ({ subtotal, shipping }) => {
  const total = subtotal + shipping;
  return (
    <section className="summarySection">
      <h2 className="summaryTitle">Summary</h2>
      <hr className="divider" />
      <div className="summaryRow">
        <span>Your cart items</span>
        <span>€{subtotal}</span>
      </div>
      <hr className="divider" />
      <div className="summaryRow">
        <span>Shipping</span>
        <span>€{shipping}</span>
      </div>
      <hr className="divider" />
      <div className="totalRow">
        <span>Estimated Total</span>
        <span>€{total.toFixed(2)}</span>
      </div>
      <div className="currencyNotice">
        <hr className="divider" />
        <p className="noticeHighlight">Currency notice</p>
        <p>
          All payments are processed in EUR. The total amount charged will be displayed in EUR.
          Please note that any additional currency conversions or fees are subject to your bank's
          exchange rates and policies.
        </p>
      </div>
    </section>
  );
};

export const CheckOut = () => {
  const { artworkImage } = useContext(ArtworkContext);
  const { setUserAddress } = useContext(ShippingContext);
  const { quantity, setQuantity } = useContext(CartContext); // Accedeix a quantity des de CartContext
  const [shippingInfo, setShippingInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    country: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setShippingInfo({ ...shippingInfo, [id]: value });
  };

  const handleContinueToShipping = () => {
    setUserAddress(shippingInfo);
    navigate("/shippinginfo");
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const cartItem = {
    price: 800,
    name: "Noise Field",
    size: 'Medium 18 x 24 "standard"',
    image: artworkImage || defaultImage,
    quantity,
  };

  const handleSignInRedirect = () => {
    navigate("/login", { state: { from: "/checkout" } });
  };

  return (
    <div className="containerWrapper">
      <main className="checkoutContainer">
        <section className="checkoutForm">
          <button className="signInButton" onClick={handleSignInRedirect}>
            Sign in to your account
          </button>

          <button className="promoLink" onClick={(e) => e.preventDefault()}>
            Apply promo codes and gift cards
          </button>

          <div className="paymentOptions">
            <button className="paypalButton">
              <img src={paypalIcon} alt="Pay with PayPal" />
            </button>
            <button className="amazonButton">
              <img src={amazonIcon} alt="Pay with Amazon" />
            </button>
          </div>
          <h3>Shipping information</h3>

          <div className="formRowLarge">
            <FormInput
              id="email"
              label="Email"
              value={shippingInfo.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="formRow">
            <FormInput
              id="firstName"
              label="First Name"
              value={shippingInfo.firstName}
              onChange={handleInputChange}
              required
            />
            <FormInput
              id="lastName"
              label="Last Name"
              value={shippingInfo.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="formRowLarge">
            <FormInput
              id="address"
              label="Address"
              value={shippingInfo.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="formRow">
            <FormInput
              id="country"
              label="Country"
              value={shippingInfo.country}
              onChange={handleInputChange}
              required
            />
            <FormInput
              id="city"
              label="City"
              value={shippingInfo.city}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="formRow">
            <FormInput
              id="postalCode"
              label="Postal Code"
              value={shippingInfo.postalCode}
              onChange={handleInputChange}
              required
            />
            <FormInput
              id="phone"
              label="Phone Number"
              value={shippingInfo.phone}
              onChange={handleInputChange}
              type="tel"
              required
            />
          </div>

          <button type="submit" onClick={handleContinueToShipping}>
            Continue to shipping method
          </button>

          <div className="secureInfo">
            <img src={secureIcon} alt="Secure Icon" />
            <span>Your information is secure</span>
          </div>
        </section>

        <section className="cartSummary">
          <h2>Items in your cart ({cartItem.quantity})</h2>
          <ProductCard {...cartItem} onIncrement={handleIncrement} onDecrement={handleDecrement} />
          <OrderSummary subtotal={cartItem.price * cartItem.quantity} shipping={6.12} />
        </section>
      </main>
    </div>
  );
};

export default CheckOut;