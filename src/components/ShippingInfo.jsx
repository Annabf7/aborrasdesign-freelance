// ShippingInfo.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShippingContext } from './ShippingContext';
import { CartContext } from './CartContext';
import '../styles/ShippingInfo.css';
import secureIcon from '../assets/icons/candado.png';
import ProductCard from './ProductCard';
import OrderSummary from './OrderSummary';

export const ShippingInfo = () => {
  const {
    userAddress,
    getRecipientForPrintful,
    setShippingCost,
    shippingCost,
  } = useContext(ShippingContext);

  const { cartItems, updateCartItemQuantity, discount } = useContext(CartContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const handlePaymentNavigation = () => {
    navigate('/completepayment');
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const fetchShippingRates = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('cartItems abans d’enviar:', cartItems);

      // Obtenim el recipient des del context
      const recipient = getRecipientForPrintful();
      if (!recipient) {
        throw new Error('Invalid recipient data. Please check the shipping address.');
      }
      console.log('Recipient generat:', recipient);

      // Preparem els articles
      const itemsPayload = cartItems.map((item) => ({
        variant_id: item.variant_id, // Utilitzar variant_id
        quantity: item.quantity,
        value: item.price.toFixed(2), // Valor del preu com a string
      }));

      console.log('Payload enviat al backend:', { recipient, items: itemsPayload });

      // Crida al backend per obtenir tarifes d'enviament
      const response = await fetch('http://localhost:4000/api/printful/shipping-estimates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient,
          items: itemsPayload,
          currency: 'EUR',
          locale: 'en_US',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al backend: ${errorText}`);
      }

      const data = await response.json();
      console.log('Resposta del backend:', data);

      if (data.success && data.result) {
        setShippingOptions(data.result);
        if (!selectedOptionId) {
          // No hi ha cap opció seleccionada encara, seleccionem per defecte
          const standardOption = data.result.find(option => option.id === 'STANDARD');
          if (standardOption) {
            setSelectedOptionId(standardOption.id);
            setShippingCost(parseFloat(standardOption.rate));
          } else if (data.result.length > 0) {
            setSelectedOptionId(data.result[0].id);
            setShippingCost(parseFloat(data.result[0].rate));
          } else {
            throw new Error('No shipping options available.');
          }
        } else {
          // Ja tenim una opció seleccionada, comprovem que encara existeix
          const previouslySelected = data.result.find(o => o.id === selectedOptionId);
          if (!previouslySelected) {
            // L'opció anterior no existeix, seleccionem la primera
            setSelectedOptionId(data.result[0].id);
            setShippingCost(parseFloat(data.result[0].rate));
          } else {
            // Mantenim l'opció i actualitzem el cost si cal
            setShippingCost(parseFloat(previouslySelected.rate));
          }
        }
      } else {
        throw new Error('No shipping options available.');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch shipping rates. Please try again.');
      console.error('Error a fetchShippingRates:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      fetchShippingRates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  const handleOptionChange = (option) => {
    setSelectedOptionId(option.id);
    setShippingCost(parseFloat(option.rate));
  };

  return (
    <div className="containerWrapper">
      <div className="shippingInfoContainer">
        <section className="shippingInfoSection">
          <div className="shippingHeader">
            <h2>Shipping Info</h2>
          </div>
          <hr className="divider" />
          {userAddress && Object.keys(userAddress).length > 0 ? (
            <div className="userAddressSection">
              <p>
                {userAddress.firstName} {userAddress.lastName}
              </p>
              <p>{userAddress.address}</p>
              <p>
                {userAddress.city}, {userAddress.country} -{' '}
                {userAddress.postalCode}
              </p>
              <p>{userAddress.phone}</p>
            </div>
          ) : (
            <p>
              No shipping information available. Please fill in your details.
            </p>
          )}
          <hr className="divider" />
          <div className="shippingMethod">
            {loading ? (
              <span>Calculating...</span>
            ) : (
              shippingOptions.length > 0 ? (
                shippingOptions.map((option, index) => (
                  <div key={index} className="shippingOption">
                    <div className="radioButton">
                      <input
                        type="radio"
                        id={`shippingOption-${index}`}
                        name="shipping"
                        checked={selectedOptionId === option.id}
                        onChange={() => handleOptionChange(option)}
                      />
                    </div>
                    <div className="shippingLabel">
                      <label htmlFor={`shippingOption-${index}`}>
                        {option.name.trim()} (Estimated delivery: {option.minDeliveryDate} – {option.maxDeliveryDate})
                      </label>
                    </div>
                    <div className="shippingPrice">
                      €{parseFloat(option.rate).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <p>No shipping options available.</p>
              )
            )}
            {error && <p className="errorMessage">{error}</p>}
          </div>

          <button
            className="paymentButton"
            onClick={handlePaymentNavigation}
            disabled={loading || !!error || cartItems.length === 0}
          >
            Next: Payment & Complete Order
          </button>
          <div className="secureInfo">
            <img src={secureIcon} alt="Secure Icon" />
            <span>Your information is secure</span>
          </div>
        </section>

        <section className="cartSummary">
          <h2>
            Items in your cart (
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)})
          </h2>

          {cartItems.map((item, index) => (
            <ProductCard
              key={index}
              {...item}
              cartIndex={index}
              onIncrement={(cartIndex, newQuantity) =>
                updateCartItemQuantity(cartIndex, newQuantity)
              }
              onDecrement={(cartIndex, newQuantity) =>
                updateCartItemQuantity(cartIndex, newQuantity)
              }
            />
          ))}

          <OrderSummary subtotal={subtotal} shipping={shippingCost || 0} discount={discount} />
          {error && <p className="errorMessage">{error}</p>}
        </section>
      </div>
    </div>
  );
};

export default ShippingInfo;
