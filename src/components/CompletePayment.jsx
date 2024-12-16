import React, { useContext, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { ShippingContext } from './ShippingContext';
import { CartContext } from './CartContext';
import { useAuth } from './AuthContext';
import ProductCard from './ProductCard';
import OrderSummary from './OrderSummary';
import secureIcon from '../assets/icons/candado.png';
import '../styles/CompletePayment.css';

const stripePromise = loadStripe('pk_test_51QFKM62KU97iEHk7wEnB6ebDp4H8u1pw2hOQNfRgtlsXGvnKo4nedhGYpAGVi3gYtVnBsFziPgLPFyhlC8rEh78800fljsYHQJ');

export const CompletePayment = () => {
  const { userAddress, shippingCost } = useContext(ShippingContext);
  const { cartItems, discount } = useContext(CartContext);
  const { user } = useAuth();

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Càlcul del subtotal original sense descompte
  const originalSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Ajustar preus amb el descompte si cal
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

  // Subtotal ajustat (després d'aplicar el descompte)
  const adjustedSubtotal = adjustedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Verificació d'adreça i dades
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

    // Prepara payload per crear la comanda a Printful
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

    // Càlcul del total real amb descompte
    const shipping = shippingCost;
    const finalTotal = (adjustedSubtotal - discount + shipping).toFixed(2);

    // Construïm l'objecte retail_costs per informar Printful del descompte
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

      // 1. Crear la comanda a Printful, ara amb retail_costs
      const createOrderResponse = await fetch('http://localhost:4000/api/printful/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient,
          items: printfulItems,
          userId: user.uid,
          retail_costs // Enviem el retail_costs amb el descompte a Printful
        }),
      });

      const createOrderData = await createOrderResponse.json();
      if (!createOrderResponse.ok) {
        throw new Error(`Error creating order: ${createOrderData.error || 'Unknown error'}`);
      }

      const orderId = createOrderData.result.id;
      console.log('Printful order created with id:', orderId);

      // 2. Crear sessió de Stripe
      const itemsPayload = adjustedItems.map((item) => {
        const priceInCents = Math.round(item.price * 100);
        return {
          name: discount > 0 ? `${item.name} (*discount applied)` : item.name,
          price: priceInCents,
          quantity: item.quantity,
        };
      });

      const shippingInCents = Math.round(shipping * 100);

      const stripeResponse = await fetch('http://localhost:4000/create-checkout-session', {
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

     // Després del pagament exitós (Stripe redirigeix a success):
      // Quan l'usuari torni del success page (on hagis configurat la teva ruta success), fes clearCart().
      // NOTA: Pots fer clearCart() a la pàgina success després de la confirmació de Stripe:
      // per exemple, a la success page, useEffect(() => { clearCart(); }, []);

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
              <li><strong>Order Confirmation:</strong> Once the payment is completed, you will receive an order confirmation email.</li>
              <li><strong>Fulfillment & Shipping:</strong> Your order will move into production and then shipped to your address.</li>
              <li><strong>Tracking Info:</strong> When available, we’ll send you a tracking number to follow your package’s journey.</li>
            </ul><hr></hr>
            <p className="additionalNote">
              Please review your order details carefully before confirming payment. If you have any questions, contact our support at <a href="mailto:aborrasdesign.com">aborrasdesign.com</a>.
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
          {/* Aquí mostrem el subtotal, shipping i discount actuals abans de redirigir a la passarel·la */}
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
