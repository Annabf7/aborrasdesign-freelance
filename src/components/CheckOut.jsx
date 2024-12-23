//CheckOut.jsx
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import { ShippingContext } from './ShippingContext';
import { CartContext } from './CartContext';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/CheckOut.css';
import paypalIcon from '../assets/icons/paypal.svg';
import amazonIcon from '../assets/icons/amazon.svg';
import secureIcon from '../assets/icons/candado.png';
import frameIcon from '../assets/icons/frame.png';
import OrderSummary from './OrderSummary';
import ProductCard from './ProductCard';
import { useAuth } from './AuthContext';

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


// Assignació dinàmica de BASE_URL segons l'entorn
const BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_BASE_URL_PROD
  : process.env.REACT_APP_BASE_URL_DEV;

const FormInput = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  autoComplete = 'on',
}) => (
  <div className="formGroup">
    <label className="formLabel" htmlFor={id}>
      {label}
    </label>
    <input
      id={id}
      name={id} 
      type={type}
      value={value?.trim() || ''}
      onChange={onChange}
      required={required}
      className="formInput"
      autoComplete={autoComplete} // Afegeixo autocomplete="on"
    />
  </div>
);


const CheckOut = () => {
  const { 
    cartItems, 
    updateCartItemQuantity, 
    discount, 
    setDiscount, 
    promoCode, 
    setPromoCode, 
    cartTotal, 
    isDiscountApplied, 
    setIsDiscountApplied 
  } = useContext(CartContext);

  const { setUserAddress, shippingCost } = useContext(ShippingContext);
  const { user } = useAuth(); 

  const [shippingInfo, setShippingInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);

  const [localPromoError, setLocalPromoError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const fetchedAddress = {
              email: userData.email || '',
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              address: userData.address || '',
              city: userData.city || '',
              state: userData.state || '',
              country: userData.country || '',
              postalCode: userData.postalCode || '',
              phone: userData.phone || '',
            };
            setUserAddress(fetchedAddress);
            setShippingInfo(fetchedAddress);
          } else {
            console.warn('No user document found in Firestore.');
          }
        }
      } catch (error) {
        console.error('Error fetching user data from Firebase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setUserAddress]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [id]: value }));
  };

  const validateShippingInfo = () => {
    const requiredFields = [
      'email',
      'firstName',
      'lastName',
      'address',
      'city',
      'country',
      'postalCode',
      'phone',
    ];
    return requiredFields.every((field) => shippingInfo[field]?.trim() !== '');
  };

  const handleContinue = () => {
    if (validateShippingInfo()) {
      setUserAddress(shippingInfo);
      navigate('/shippinginfo');
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const subtotal = cartTotal;

  const calculateDiscountFromResponse = (response) => {
    const printfulCosts = response.result.costs;
    const retailCosts = response.result.retail_costs;

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

    const countryCode = countryMap[shippingInfo.country] || shippingInfo.country;

    const recipient = {
      name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      address1: shippingInfo.address,
      city: shippingInfo.city,
      country_code: countryCode,
      zip: shippingInfo.postalCode,
      phone: shippingInfo.phone,
      email: shippingInfo.email
    };

    const items = cartItems.map(item => ({
      sync_variant_id: item.sync_variant_id,
      quantity: item.quantity
    }));

    // Utilitzem BASE_URL
    const response = await fetch(`${BASE_URL}/printful/estimate-costs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, items })
    });

    if (!response.ok) {
      console.error('Error resposta del backend:', await response.text());
      return 0;
    }

    const data = await response.json();

    const discountAmount = calculateDiscountFromResponse(data);
    return discountAmount;
  }, [cartItems, promoCode, shippingInfo, isDiscountApplied]);

  const applyPromoCode = async () => {
    setLocalPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code !== 'ABORRASGIFT') {
      setLocalPromoError('Codi de descompte no vàlid.');
      setDiscount(0);
      setIsDiscountApplied(false);
      return;
    }

    if (cartItems.length === 0) {
      setLocalPromoError('No pots aplicar el descompte amb el carret buit.');
      setDiscount(0);
      setIsDiscountApplied(false);
      return;
    }

    try {
      // Codi correcte i hi ha obres, apliquem el descompte sempre.
      setIsDiscountApplied(true);
      const discountAmount = await fetchDiscount();
      // No cal comprovar si hi ha beneficis > 0, sempre apliquem el descompte resultant.
      setDiscount(discountAmount);
      // No mostrem cap missatge d'error de beneficis.
      setLocalPromoError('');
    } catch (error) {
      console.error('Error calculant el descompte:', error);
      setLocalPromoError('Error calculant el descompte.');
      setIsDiscountApplied(false);
      setDiscount(0);
    }
  };

  // Recalcula el descompte si canvia el carret i el descompte està aplicat
  useEffect(() => {
    const recalculateIfNeeded = async () => {
      if (isDiscountApplied && promoCode.toUpperCase() === 'ABORRASGIFT' && cartItems.length > 0) {
        const discountAmount = await fetchDiscount();
        setDiscount(discountAmount);
      } else if (cartItems.length === 0) {
        // Carret buit, reset
        setDiscount(0);
        setPromoCode('');
        setIsDiscountApplied(false);
      }
    };
    recalculateIfNeeded();
  }, [cartItems, fetchDiscount, promoCode, setDiscount, setPromoCode, isDiscountApplied, setIsDiscountApplied]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="containerWrapper">
      <main className="checkoutContainer">
        <section className="checkoutForm">
          {!user && (
            <Link 
              to="/auth" 
              className="signInButton"
              state={{ from: '/checkout' }}
            >
              Sign In / Register
            </Link>
          )}
          <h3 className="promoCodeHeader">Have a Promo Code?</h3>
          <div className="promoCodeSection">
            <input
              type="text"
              placeholder="Enter Promo Code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button onClick={applyPromoCode}>Apply promo code</button>
          </div>
          {localPromoError && <p className="promoError">{localPromoError}</p>}

          <div className="paymentOptions">
            <button className="paypalButton">
              <img src={paypalIcon} alt="Pay with PayPal" />
            </button>
            <button className="amazonButton">
              <img src={amazonIcon} alt="Pay with Amazon" />
            </button>
          </div>

          <h3>Shipping Information</h3>
          <div className="formRowLarge">
            <FormInput
              id="email"
              label="Email"
              value={shippingInfo.email}
              onChange={handleInputChange}
              required
              autoComplete="email" 
            />
          </div>
          <div className="formRow">
            <FormInput
              id="firstName"
              label="First Name"
              value={shippingInfo.firstName}
              onChange={handleInputChange}
              required
              autoComplete="given-name"
            />
            <FormInput
              id="lastName"
              label="Last Name"
              value={shippingInfo.lastName}
              onChange={handleInputChange}
              required
               autoComplete="family-name"
            />
          </div>
          <div className="formRowLarge">
            <FormInput
              id="address"
              label="Address"
              value={shippingInfo.address}
              onChange={handleInputChange}
              required
              autoComplete="address-line1"
            />
          </div>
          <div className="formRow">
            <FormInput
              id="city"
              label="City"
              value={shippingInfo.city}
              onChange={handleInputChange}
              required
              autoComplete="address-level2"
            />
            <FormInput
              id="country"
              label="Country"
              value={shippingInfo.country}
              onChange={handleInputChange}
              required
              autoComplete="country"
            />
          </div>
          <div className="formRow">
            <FormInput
              id="postalCode"
              label="Postal Code"
              value={shippingInfo.postalCode}
              onChange={handleInputChange}
              required
              autoComplete="postal-code"
            />
            <FormInput
              id="phone"
              label="Phone Number"
              value={shippingInfo.phone}
              onChange={handleInputChange}
              required
              autoComplete="tel"
            />
          </div>

          <button type="submit" onClick={handleContinue}>
            Continue to shipping method
          </button>
          <div className="secureInfo">
            <img src={secureIcon} alt="Secure Icon" />
            <span>Your information is secure</span>
          </div>
          
 {/* Enllaç per tornar a la galeria i afegir més obres */}
 <div className="backToGallery">
      <Link to="/generative-art">
      Back to Gallery 
        <img src={frameIcon} alt="Frame Icon" className="frame-icon" />
        
      </Link>
    </div>

        </section>

        <section className="cartSummary">
          <h2>
            Items in your cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
          </h2>

          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
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
            ))
          ) : (
            <p>Your cart is empty. Please go back and add items.</p>
          )}

          <OrderSummary
            subtotal={subtotal}
            shipping={shippingCost || 0}
            discount={discount}
          />
          {!shippingCost && (
            <p className="shippingNotice">
              *** Shipping costs will be calculated at shipping page.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default CheckOut;
