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

  // Comprovem si artworkImage està disponible
  // Si no hi ha obra seleccionada, es mostra una versió per defecte
  const cartItem = artworkImage
    ? {
        price: 800,
        name: "Noise Field",
        size: 'Medium 18 x 24 "standard"',
        image: artworkImage,
        quantity,
      }
    : {
        price: 0,
        name: "No artwork selected",
        size: "N/A",
        image: defaultImage,
        quantity: 0,
      };

  return (
    <div className="cartContainer">
      <h4>Your Cart</h4>
      {/* Mostrem sempre el cart amb la seva estructura */}
      <ProductCard {...cartItem} onIncrement={handleIncrement} onDecrement={handleDecrement} />
      <OrderSummary subtotal={cartItem.price * cartItem.quantity} shipping={6.12} />
      {/* Si no hi ha obra seleccionada, mostrar missatge */}
      {cartItem.quantity === 0 && (
        <div>
          <p>Your cart is empty. Please select an artwork to add to your cart.</p>
        </div>
      )}
    </div>
  );
};

export default Cart;
