// Cart.jsx
import React, { useContext } from "react";
import ProductCard from "./ProductCard";
import OrderSummary from "./OrderSummary";
import "../styles/Cart.css";
import { CartContext } from "./CartContext";
import { ArtworkContext } from "./ArtworkContext";
import defaultImage from "../assets/generative/style_1.png";

const Cart = () => {
  const { quantity, setQuantity } = useContext(CartContext);
  const { artworkImage } = useContext(ArtworkContext);

  // Funcions per incrementar i decrementar la quantitat
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

  return (
    <div className="cartContainer">
      <h4>Your Cart</h4>
      <ProductCard {...cartItem} onIncrement={handleIncrement} onDecrement={handleDecrement} />
      <OrderSummary subtotal={cartItem.price * cartItem.quantity} shipping={6.12} />
    </div>
  );
};

export default Cart;
