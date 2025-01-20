// Success.jsx
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Success.css';
import grandma6 from '../assets/grandma6.jpg';
import grandma7 from '../assets/grandma7.jpg';
import { CartContext } from './CartContext';

// BASE_URL segons l'entorn
const BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_BASE_URL_PROD
  : process.env.REACT_APP_BASE_URL_DEV;

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);

  // Comprovar si la pàgina és de tipus success
  const isSuccess =
    location.pathname.includes('/success') &&
    !location.search.includes('cancel');

  // Obtenir l'order_id dels query parameters
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('order_id');

  const [orderData, setOrderData] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState(null);

  // Per evitar un bucle infinit de confirmacions
  const confirmingRef = useRef(false);

  // Buidar el carret si la comanda és success
  useEffect(() => {
    if (isSuccess && cartItems.length > 0) {
      clearCart();
    }
  }, [isSuccess, cartItems.length, clearCart]);

  // Carregar les dades de la comanda
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        setError('Order ID not found.');
        setLoadingOrder(false);
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/printful/orders/${orderId}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch order: ${errorText}`);
        }
        const data = await response.json();
        setOrderData(data.order); // data.order ha d'incloure "status": "draft"
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingOrder(false);
      }
    };
    if (isSuccess) {
      fetchOrderData();
    }
  }, [isSuccess, orderId]);

  // Confirmar automàticament comandes en estat "draft"
  useEffect(() => {
    const confirmDraftOrder = async () => {
      if (!orderId || !orderData) return;
      if (orderData.status !== 'draft') return;

      try {
        confirmingRef.current = true; 
        const confirmResponse = await fetch(`${BASE_URL}/printful/confirm-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });
        const confirmData = await confirmResponse.json();
        if (!confirmResponse.ok || !confirmData.success) {
          throw new Error(confirmData.error || 'Failed to confirm order');
        }
        //console.log('Comanda confirmada automàticament:', confirmData);

        // Torno a carregar la comanda ja confirmada
        const updated = await fetch(`${BASE_URL}/printful/orders/${orderId}`);
        const updatedData = await updated.json();
        setOrderData(updatedData.order); 
      } catch (err) {
        setError(`Error confirmant la comanda: ${err.message}`);
      } 
    };

    if (
      isSuccess &&
      orderData &&
      orderData.status === 'draft' &&
      !confirmingRef.current
    ) {
      confirmDraftOrder();
    }
  }, [isSuccess, orderData, orderId]);

  // Si no és success, mostrar missatge de cancel·lació
  if (!isSuccess) {
    return (
      <div className="success-page">
        <div className="success-image-section">
          <img src={grandma7} alt="Error" className="success-image" />
        </div>
        <div className="success-details-section">
          <h1>Payment Cancelled</h1>
          <p>
            It seems you have cancelled the payment. Please try again or contact us for assistance.
          </p>
          <button className="success-home-button" onClick={() => navigate('/completepayment')}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Mostrar missatge de càrrega si les dades encara no estan disponibles
  if (loadingOrder) {
    return <p>Loading order details...</p>;
  }

  // Mostrar missatge d'error si hi ha algun problema
  if (error) {
    return (
      <div className="success-page">
        <div className="success-image-section">
          <img src={grandma7} alt="Error" className="success-image" />
        </div>
        <div className="success-details-section">
          <h1>Error</h1>
          <p>{error}</p>
          <button className="success-home-button" onClick={() => navigate('/')}>
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return <p>No order data found.</p>;
  }

   // Mostrar resum final de la comanda
  const { retail_costs, recipient, items, shipping_service_name, status } = orderData;
  const retailSubtotal = parseFloat(retail_costs.subtotal) || 0;
  const retailDiscount = parseFloat(retail_costs.discount) || 0;
  const retailShipping = parseFloat(retail_costs.shipping) || 0;
  const retailTotal = parseFloat(retail_costs.total) || 0;

  return (
    <div className="success-page">
      <div className="success-image-section">
        <img src={grandma6} alt="Success" className="success-image" />
      </div>
      <div className="success-details-section">
        <h1>Payment Successful!</h1>
        <p>
          Thank you for your purchase. You will receive an email with your order details.
        </p>

        <div className="order-summary">
          <div className="info-items">
            <h2>Order Summary (status: {status})</h2>
            <ul className="order-items">
              {items.map((item) => (
                <li key={item.id} className="order-item">
                  <div className="order-item-details">
                    <img
                      src={item.product?.image}
                      alt={item.name}
                      className="order-item-image"
                    />
                    <div className="order-item-text">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>€{(parseFloat(item.retail_price) * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <hr />
            <div className="order-totals">
              <p>Subtotal: €{retailSubtotal.toFixed(2)}</p>
              {retailDiscount > 0 && (
                <>
                  <hr />
                  <p>Discount: - €{retailDiscount.toFixed(2)}</p>
                </>
              )}
              <hr />
              <p>Shipping: €{retailShipping.toFixed(2)}</p>
              <hr />
              <p>
                <strong>Total: €{retailTotal.toFixed(2)}</strong>
              </p>
            </div>
          </div>

          <div className="info-shipping">
            <h2>Shipping Address</h2>
            <hr />
            {recipient ? (
              <p>
                {recipient.name} <br />
                {recipient.address1}, {recipient.city} <br />
                {recipient.country_name} - {recipient.zip} <br />
                {recipient.phone}
              </p>
            ) : (
              <p>No shipping information available.</p>
            )}
            <hr />
            <h2>Shipping Method</h2>
            <hr />
            <p>{shipping_service_name}</p>
          </div>
        </div>

        <button className="success-home-button" onClick={() => navigate('/')}>
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

export default Success;
