// ProductCard.jsx
import React from "react";
import "../styles/ProductCard.css";

const ProductCard = ({ price, name, size, image, quantity, onIncrement, onDecrement }) => (
  <div className="productContainer">
    <h2>Items in your cart ({quantity})</h2>
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
        </div>
        <div className="cartActions">
          <button>Move to wishlist</button>
          <button>Edit item</button>
        </div>
      </div>
    </article>
  </div>
);

export default ProductCard;
