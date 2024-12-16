// Cart.jsx
import React, { useContext } from 'react';
import '../styles/Cart.css';
import { CartContext } from './CartContext';
import { ShippingContext } from './ShippingContext';
import emptyCartImage from '../assets/grandma8.jpg';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity, cartTotal, discount } = useContext(CartContext);
  const { shippingCost } = useContext(ShippingContext);
  const navigate = useNavigate();

  const handleIncrement = (index) => {
    updateCartItemQuantity(index, cartItems[index].quantity + 1);
  };

  const handleDecrement = (index) => {
    const newQuantity = cartItems[index].quantity - 1;
    if (newQuantity >= 1) {
      updateCartItemQuantity(index, newQuantity);
    }
  };

  const totalWithDiscount = cartTotal - discount + shippingCost;

  return (
    <div className="cartContainer">
      <h4>Items in your cart ({cartItems.length})</h4>
      {cartItems.length > 0 ? (
        <div>
          {cartItems.map((item, index) => (
            <div key={index} className="cartItem">
              <div className="cartItemDetails">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cartItemImage"
                />
                <div className="cartItemText">
                  <p className="cartItemVariant">{item.size}</p>
                  <p className="cartItemPrice">€{item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="cartItemActions">
                <div className="quantityControls">
                  <button onClick={() => handleDecrement(index)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncrement(index)}>+</button>
                </div>
                <button className="removeButton" onClick={() => removeFromCart(index)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="summaryTotal">
            <div className="shippingCost">
              <p>Shipping Cost: {shippingCost.toFixed(2)}€</p>
            </div>
            <hr />
            <div className="summaryRow">
              <span>Subtotal:</span>
              <span>€{cartTotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="summaryRow">
                <span>Discount:</span>
                <span>- €{discount.toFixed(2)}</span>
              </div>
            )}
            <hr />
            <strong>Estimated Total: </strong>
            <strong>€{totalWithDiscount.toFixed(2)}</strong>
          </div>
          <div className="cartNavigation">
            <button
              className="continueShoppingButton"
              onClick={() => navigate('/generative-art')}
            >
              Continue Shopping
            </button>
            <button
              className="proceedToCheckoutButton"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="emptyCart">
          <img src={emptyCartImage} alt="Empty Cart" className="emptyCartImage" />
          <p>Your cart is empty.</p>
          <button
            className="goToGalleryButton"
            onClick={() => navigate('/generative-art')}
          >
            Go to Generative Art Gallery
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
