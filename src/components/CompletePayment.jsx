//CompletePayment.jsx
import React, { useContext, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { ShippingContext } from './ShippingContext';
import { CartContext } from './CartContext';
import { useAuth } from './AuthContext';
import ProductCard from './ProductCard';
import OrderSummary from './OrderSummary';
import secureIcon from '../assets/icons/candado.png';
import '../styles/CompletePayment.css';

// Assignació dinàmica de BASE_URL segons l'entorn
const BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_BASE_URL_PROD
  : process.env.REACT_APP_BASE_URL_DEV;

// Clau pública de Stripe segons l'entorn
const stripePromise = loadStripe(
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_STRIPE_PUBLIC_KEY_LIVE
    : process.env.REACT_APP_STRIPE_PUBLIC_KEY_TEST
);


export const CompletePayment = () => {
  const { userAddress, shippingCost } = useContext(ShippingContext);
  const { cartItems, discount } = useContext(CartContext);
  const { user } = useAuth();

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const originalSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let adjustedItems = [...cartItems];
  if (discount > 0 && discount < originalSubtotal) {
    const discountRatio = 1 - (discount / originalSubtotal);
    adjustedItems = adjustedItems.map((item) => {
      const originalItemTotal = item.price * item.quantity;
      const newItemTotal = originalItemTotal * discountRatio;
      const newUnitPrice = newItemTotal / item.quantity;
      return {
        ...item,
        price: parseFloat(newUnitPrice.toFixed(2))
      };
    });
  }

  const adjustedSubtotal = adjustedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const handleConfirmPayment = async () => {
    if (!adjustedItems.length || !userAddress) {
      setErrorMessage('Your cart or shipping information is incomplete.');
      return;
    }

    if (
      !userAddress.firstName ||
      !userAddress.address ||
      !userAddress.postalCode ||
      !userAddress.city ||
      !userAddress.country
    ) {
      setErrorMessage('Please complete all required shipping fields.');
      return;
    }

    const countryMap = {
      España: 'ES',
      Spain: 'ES',
      France: 'FR',
      Germany: 'DE',
      Italia: 'IT',
      Italy: 'IT',
      'United States': 'US',
      USA: 'US',
      'Regne Unit': 'GB',
      UK: 'GB',
      Portugal: 'PT',
      Andorra: 'AD',
      México: 'MX',
      Mexico: 'MX',
      Argentina: 'AR',
    };

    const countryCode = countryMap[userAddress.country] || userAddress.country;

    const printfulItems = adjustedItems.map(item => ({
      sync_variant_id: item.sync_variant_id,
      quantity: item.quantity
    }));

    const recipient = {
      name: `${userAddress.firstName} ${userAddress.lastName}`,
      address1: userAddress.address,
      city: userAddress.city,
      country_code: countryCode,
      zip: userAddress.postalCode,
      phone: userAddress.phone,
      email: userAddress.email || user.email
    };

    const shipping = shippingCost;
    const finalTotal = (adjustedSubtotal - discount + shipping).toFixed(2);

    const retail_costs = {
      currency: "EUR",
      discount: discount.toFixed(2),
      subtotal: originalSubtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: "0.00",
      total: finalTotal
    };

    try {
      setIsLoading(true);

      const createOrderResponse = await fetch(`${BASE_URL}/printful/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient,
          items: printfulItems,
          userId: user.uid,
          retail_costs
        }),
      });

      const createOrderData = await createOrderResponse.json();
      if (!createOrderResponse.ok) {
        throw new Error(`Error creating order: ${createOrderData.error || 'Unknown error'}`);
      }

      const orderId = createOrderData.result.id;
      console.log('Printful order created with id:', orderId);

      const itemsPayload = adjustedItems.map((item) => {
        const priceInCents = Math.round(item.price * 100);
        return {
          name: discount > 0 ? `${item.name} (*discount applied)` : item.name,
          price: priceInCents,
          quantity: item.quantity,
        };
      });

      const shippingInCents = Math.round(shipping * 100);

      const stripeResponse = await fetch(`${BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemsPayload,
          shippingCost: shippingInCents,
          orderId: orderId
        }),
      });

      const session = await stripeResponse.json();
      if (!stripeResponse.ok || !session.sessionId) {
        throw new Error(`Failed to create checkout session: ${session.error || 'Unknown error'}`);
      }

      const stripe = await stripePromise;
      console.log('Sessió de Stripe creada amb èxit:', session.sessionId);
      const result = await stripe.redirectToCheckout({ sessionId: session.sessionId });

      if (result.error) {
        console.error('Error a Stripe redirectToCheckout:', result.error);
        throw new Error(result.error.message);
      }

    } catch (error) {
      console.error('Error al confirmar el pagament:', error.message);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="containerWrapper">
      <div className="paymentContainer">
        <section className="paymentInfo">
          <div className="paymentHeader">
            <h2>Payment</h2>
          </div>

          {errorMessage && (
            <div className="errorMessage">
              <p>{errorMessage}</p>
            </div>
          )}
          <hr></hr>
          <div className="shippingInfo">
            <h4>Shipping Info</h4>
            {userAddress && (
              <p>
                {userAddress.firstName} {userAddress.lastName},{' '}
                {userAddress.address}, {userAddress.city}, {userAddress.country},{' '}
                {userAddress.postalCode}
              </p>
            )}
          </div><hr></hr>

          <div className="paymentMethod">
            <h4>Payment Method</h4>
            <label className="paymentOption">
              <input type="radio" name="payment" defaultChecked />
              Pay with Credit Card
            </label>
            <p className="paymentDescription">
              We securely process your payment through Stripe. <br></br>Your credit card details are never stored on our servers.
            </p>
          </div><hr></hr>

          <div className="paymentDetails">
            <h4>What to expect after payment</h4>
            <ul className="paymentSteps">
              <li><strong>Order Confirmation:</strong> Once payment is completed, you'll receive an order confirmation email.</li>
              <li><strong>Fulfillment & Shipping:</strong> Your order goes into production and then ships to your address.</li>
              <li><strong>Tracking Info:</strong> We’ll send a tracking number when available.</li>
            </ul><hr></hr>
            <p className="additionalNote">
              Please review your order details before confirming payment. If you have any questions, contact support at <a href="mailto:aborrasdesign.com">aborrasdesign.com</a>.
            </p>
          </div>

          <button
            className="paymentButton"
            onClick={handleConfirmPayment}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm Payment'}
          </button>

          <div className="secureInfo">
            <img src={secureIcon} alt="Secure Icon" />
            <p className="secureDetails">
              Payments are encrypted and secured through Stripe. <br></br>
              Your personal and financial information remains confidential.
            </p>
          </div>
        </section>

        <section className="cartSummary">
          <h2>Items in your cart ({cartItems.length})</h2>
          {cartItems.map((item, index) => (
            <ProductCard
              key={index}
              {...item}
              readOnly={true}
            />
          ))}
          <OrderSummary
            subtotal={originalSubtotal}
            shipping={shippingCost || 0}
            discount={discount}
          />
          {discount > 0 && (
            <p style={{ fontSize: '0.9em', color: 'green' }}>
              * All prices shown have the discount already applied.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default CompletePayment;
