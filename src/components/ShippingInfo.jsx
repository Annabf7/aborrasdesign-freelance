// ShippingInfo.jsx
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShippingContext } from './ShippingContext';
import { CartContext } from './CartContext';
import '../styles/ShippingInfo.css';
import secureIcon from '../assets/icons/candado.png';
import ProductCard from './ProductCard';
import OrderSummary from './OrderSummary';

// Assignació dinàmica de BASE_URL segons l'entorn
const BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_BASE_URL_PROD
  : process.env.REACT_APP_BASE_URL_DEV;


 /* Map per transformar el nom del país a codi ISO, usat per calcular el descompte
  (mateixa lògica que a Checkout).*/
 
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

export const ShippingInfo = () => {
  const {
    userAddress,
    getRecipientForPrintful,
    setShippingCost,
    shippingCost,
  } = useContext(ShippingContext);

  const {
    cartItems,
    updateCartItemQuantity,
    discount,
    setDiscount,
    promoCode,
    setPromoCode,
    isDiscountApplied,
    setIsDiscountApplied
  } = useContext(CartContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  /* Quan premem per continuar a la pàgina de pagament */
  const handlePaymentNavigation = () => {
    navigate('/completepayment');
  };

  /* Subtotal de tots els productes (sense descompte ni enviament) */
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  /* Calcula i obté les tarifes d'enviament del backend */
  const fetchShippingRates = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtenim el recipient des del context
      const recipient = getRecipientForPrintful();
      if (!recipient) {
        throw new Error('Invalid recipient data. Please check the shipping address.');
      }

      // Preparem els articles per enviar al backend
      const itemsPayload = cartItems.map((item) => ({
        variant_id: item.variant_id, 
        quantity: item.quantity,
        value: item.price.toFixed(2),
      }));

      const response = await fetch(`${BASE_URL}/printful/shipping-estimates`, {
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

      if (data.success && data.result) {
        setShippingOptions(data.result);
        if (!selectedOptionId) {
          // No hi ha cap opció seleccionada encara, seleccionem per defecte
          const standardOption = data.result.find(
            (option) => option.id === 'STANDARD'
          );
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
          // Mantenim l'opció anterior si encara existeix
          const previouslySelected = data.result.find(
            (o) => o.id === selectedOptionId
          );
          if (!previouslySelected) {
            // L'opció anterior no existeix, seleccionem la primera
            setSelectedOptionId(data.result[0].id);
            setShippingCost(parseFloat(data.result[0].rate));
          } else {
            // Actualitzem cost
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

  /*
   1) Quan el component es munta, escoltem l'esdeveniment "popstate" 
      per saber si l'usuari retrocedeix (back) en el navegador.
      Si ho fa, posem el cost d'enviament a 0 perquè a la pàgina anterior 
      (Checkout) no aparegui el mètode d'enviament seleccionat.
   */
  useEffect(() => {
    const handlePopState = () => {
      setShippingCost(0);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setShippingCost]);

  /* Si el carret es queda buit, forcem shippingCost = 0 de seguida. */
  useEffect(() => {
    if (cartItems.length === 0) {
      setShippingCost(0);
    }
  }, [cartItems, setShippingCost]);

  /* Al muntar el component (i sempre que cartItems canviï), tornem a buscar tarifes d'enviament. */
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

  /* Lògica de recalcular descompte (igual que a Checkout) */
  const calculateDiscountFromResponse = (data) => {
    const printfulCosts = data.result.costs;
    const retailCosts = data.result.retail_costs;

    const subtotalPrintful = printfulCosts.subtotal;
    const vat = printfulCosts.vat;
    const retailSubtotal = retailCosts.subtotal;

    const benefits = retailSubtotal - (subtotalPrintful + vat);
    return benefits;
  };

  const fetchDiscount = useCallback(async () => {
    if (!isDiscountApplied || promoCode.toUpperCase() !== 'ABORRASGIFT') {
      return 0;
    }
    if (cartItems.length === 0) {
      return 0;
    }

    // Convertim el país a codi ISO
    const countryCode = countryMap[userAddress.country] || userAddress.country;

    const recipient = {
      name: `${userAddress.firstName} ${userAddress.lastName}`,
      address1: userAddress.address,
      city: userAddress.city,
      country_code: countryCode,
      zip: userAddress.postalCode,
      phone: userAddress.phone,
      email: userAddress.email,
    };

    const items = cartItems.map((item) => ({
      sync_variant_id: item.sync_variant_id,
      quantity: item.quantity,
    }));

    const response = await fetch(`${BASE_URL}/printful/estimate-costs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, items }),
    });

    if (!response.ok) {
      console.error('Error resposta del backend:', await response.text());
      return 0;
    }

    const data = await response.json();
    return calculateDiscountFromResponse(data);
  }, [
    isDiscountApplied,
    promoCode,
    cartItems,
    userAddress
  ]);

  // Recalcula el descompte si canvia el carret, el promoCode, etc.
  useEffect(() => {
    const recalculateIfNeeded = async () => {
      if (
        isDiscountApplied &&
        promoCode.toUpperCase() === 'ABORRASGIFT' &&
        cartItems.length > 0
      ) {
        const discountAmount = await fetchDiscount();
        setDiscount(discountAmount);
      } else if (cartItems.length === 0) {
        // Carret buit: reset dels valors
        setDiscount(0);
        setPromoCode('');
        setIsDiscountApplied(false);
      }
    };
    recalculateIfNeeded();
  }, [
    cartItems,
    isDiscountApplied,
    promoCode,
    fetchDiscount,
    setDiscount,
    setPromoCode,
    setIsDiscountApplied
  ]);

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
                {userAddress.city}, {userAddress.country} - {userAddress.postalCode}
              </p>
              <p>{userAddress.phone}</p>
            </div>
          ) : (
            <p>No shipping information available. Please fill in your details.</p>
          )}
          <hr className="divider" />
          <div className="shippingMethod">
            {loading ? (
              <span>Calculating...</span>
            ) : shippingOptions.length > 0 ? (
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
                      {option.name.trim()} (Estimated delivery:{' '}
                      {option.minDeliveryDate} – {option.maxDeliveryDate})
                    </label>
                  </div>
                  <div className="shippingPrice">
                    €{parseFloat(option.rate).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p>No shipping options available.</p>
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

          <OrderSummary
            subtotal={subtotal}
            shipping={shippingCost || 0}
            discount={discount}
            // A ShippingInfo sí mostrem el cost d’enviament
          />
          {error && <p className="errorMessage">{error}</p>}
        </section>
      </div>
    </div>
  );
};

export default ShippingInfo;
