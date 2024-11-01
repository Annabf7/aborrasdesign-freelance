// OrderSummary.jsx
import React from "react";
import "../styles/OrderSummary.css";

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

export default OrderSummary;
