// OrderSummary.jsx
import React, { useContext } from 'react';
import '../styles/OrderSummary.css';
import { CartContext } from './CartContext';

const OrderSummary = ({ subtotal = 0, shipping = 0, showShipping = true }) => {
  const { discount } = useContext(CartContext); // Obtenim el descompte del context

  const sanitizedSubtotal = Number(subtotal) || 0;
  const sanitizedShipping = Number(shipping) || 0;
  const sanitizedDiscount = Number(discount) || 0; // Descompte del context

  const total = sanitizedSubtotal - sanitizedDiscount + (showShipping ? sanitizedShipping : 0);

  return (
    <section className="summarySection">
      <h2 className="summaryTitle">Summary</h2>
      <hr className="divider" />
      <div className="summaryRow">
        <span>Your cart items</span>
        <span>€{sanitizedSubtotal.toFixed(2)}</span>
      </div>
      {sanitizedDiscount > 0 && (
        <>
          <hr className="divider" />
          <div className="summaryRow">
            <span>Discount</span>
            <span>- €{sanitizedDiscount.toFixed(2)}</span>
          </div>
        </>
      )}
      {showShipping && (
        <>
          <hr className="divider" />
          <div className="summaryRow">
            <span>Shipping</span>
            <span>
              {sanitizedShipping > 0 ? sanitizedShipping.toFixed(2) : ' *** €'}
            </span>
          </div>
        </>
      )}
      <hr className="divider" />
      <div className="totalRow" aria-label="Estimated total">
        <span>Estimated Total</span>
        <span>€{total.toFixed(2)}</span>
      </div>
      <div className="currencyNotice">
        <hr className="divider" />
        <p className="noticeHighlight">Currency notice</p>
        <p>
          All payments are processed in EUR. The total amount charged will be
          displayed in EUR. Please note that any additional currency conversions
          or fees are subject to your bank's exchange rates and policies.
        </p>
      </div>
    </section>
  );
};

export default OrderSummary;
