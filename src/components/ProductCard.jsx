import React, { useContext } from 'react';
import '../styles/ProductCard.css';
import { CartContext } from './CartContext'; // Importa el context

const ProductCard = ({
  price = 0,
  name = 'Unnamed Product',
  size = 'N/A',
  image = '',
  quantity = 1,
  readOnly = false,
  onIncrement = () => console.warn('onIncrement function not defined'),
  onDecrement = () => console.warn('onDecrement function not defined'),
  cartIndex, // Identifica la posició de l'article al carretó
}) => {
  const { removeFromCart } = useContext(CartContext); // Accedeix al context

  return (
    <div className="productContainer">
      <article className="productGrid">
        {/* Imatge del producte */}
        <img
          loading="lazy"
          src={image || 'default-placeholder.png'} // Afegim un marcador de lloc si no hi ha imatge
          alt={name}
          className="productImage"
        />

        {/* Detalls del producte */}
        <div className="productDetails">
          <div className="productInfo">
            <p className="productPrice">€{Number(price).toFixed(2)}</p>
            <h3 className="productName">{name}</h3>
            <p className="productSize">{size}</p>
          </div>

          {/* Si NO és readOnly, mostra els controls per modificar la quantitat */}
          {!readOnly && (
            <div className="quantityControls">
              <button
                aria-label="Decrease quantity"
                onClick={() => onDecrement(cartIndex, Math.max(quantity - 1, 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => onIncrement(cartIndex, quantity + 1)}
              >
                +
              </button>
            </div>
          )}

          {/* Si és readOnly, només mostra la quantitat sense botons */}
          {readOnly && (
            <div className="readOnlyQuantity">
              <span>Quantity: {quantity}</span>
            </div>
          )}

          {/* Botó per eliminar (només si no és readOnly) */}
          {!readOnly && (
            <button
              aria-label="Remove product from cart"
              className="removeButton"
              onClick={() => removeFromCart(cartIndex)}
            >
              <i className="fas fa-trash-alt" style={{ marginRight: '8px' }}></i>
              Remove
            </button>
          )}
        </div>
      </article>
    </div>
  );
};

export default ProductCard;
