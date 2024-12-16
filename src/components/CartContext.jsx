// CartContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Importar useAuth
import style1 from '../assets/generative/style_1.png';
import style2 from '../assets/generative/style_2.png';
import style3 from '../assets/generative/style_3.png';
import style4 from '../assets/generative/style_4.png';
import style5 from '../assets/generative/style_5.png';
import style6 from '../assets/generative/style_6.png';
import style7 from '../assets/generative/style_7.png';
import style8 from '../assets/generative/style_8.png';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth(); // Obtenim el user des del AuthContext
  const userId = user ? user.uid : null; // userId depèn del user
  console.log("[CartContext] Current userId:", userId);

  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  useEffect(() => {
    console.log("[CartContext] userId changed:", userId);
    if (userId) {
      const savedCart = localStorage.getItem(`cartItems_${userId}`);
      console.log(`[CartContext] Loading cartItems for userId ${userId}:`, savedCart);
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    } else {
      console.log("[CartContext] No userId, resetting cart");
      setCartItems([]);
      setDiscount(0);
      setPromoCode('');
      setIsDiscountApplied(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      console.log(`[CartContext] Saving cartItems for userId ${userId}`, cartItems);
      localStorage.setItem(`cartItems_${userId}`, JSON.stringify(cartItems));
    }
  }, [cartItems, userId]);

  useEffect(() => {
    if (cartItems.length === 0) {
      console.log("[CartContext] cartItems is empty, resetting discount, promoCode, isDiscountApplied");
      setDiscount(0);
      setPromoCode('');
      setIsDiscountApplied(false);
    } else {
      console.log("[CartContext] cartItems updated, length:", cartItems.length);
    }
  }, [cartItems]);

  const artStyleImages = {
    Expressionism: style1,
    'De Stijl': style2,
    Surrealism: style3,
    'Pop art': style4,
    Cubism: style5,
    Constructivism: style6,
    'Kinetic Art': style7,
    Bauhaus: style8,
  };

  const addToCart = (newItem) => {
    console.log("[CartContext] addToCart called with:", newItem);
    const { sync_variant_id, variant_id, quantity, name, price, styleName } = newItem;

    if (!sync_variant_id || !variant_id || !quantity || !name || !price) {
      console.error('Falten camps clau:', newItem);
      return;
    }

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.sync_variant_id === sync_variant_id
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        const image = artStyleImages[styleName] || '/assets/default-image.png';

        const itemToCart = {
          sync_variant_id,
          variant_id,
          quantity,
          image,
          name,
          size: newItem.size,
          price,
          styleName,
        };
        updatedItems = [...prevItems, itemToCart];
      }

      console.log("[CartContext] Updated cartItems after addToCart:", updatedItems);
      return updatedItems;
    });
  };

  const updateCartItemQuantity = (index, newQuantity) => {
    console.log("[CartContext] updateCartItemQuantity called. index:", index, "newQuantity:", newQuantity);
    if (newQuantity < 1 || newQuantity > 99) {
      console.warn('La quantitat ha de ser entre 1 i 99.');
      return;
    }
    setCartItems((prevItems) => {
      const updatedCartItems = [...prevItems];
      updatedCartItems[index].quantity = newQuantity;
      console.log("[CartContext] Updated cartItems after updateCartItemQuantity:", updatedCartItems);
      return updatedCartItems;
    });
  };

  const removeFromCart = (index) => {
    console.log("[CartContext] removeFromCart called. index:", index);
    setCartItems((prevItems) => {
      const updatedCartItems = prevItems.filter((_, i) => i !== index);
      console.log("[CartContext] Updated cartItems after removeFromCart:", updatedCartItems);
      return updatedCartItems;
    });
  };

  const clearCart = () => {
    console.log("[CartContext] clearCart called.");
    setCartItems([]);
    setDiscount(0);
    setPromoCode('');
    setIsDiscountApplied(false);
    if (userId) {
      console.log(`[CartContext] Removing cartItems_${userId} from localStorage`);
      localStorage.removeItem(`cartItems_${userId}`);
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const setDiscountValue = (value) => {
    console.log("[CartContext] setDiscountValue called with:", value);
    const sanitizedValue = value < 0 ? 0 : value;
    const finalValue = sanitizedValue > cartTotal ? cartTotal : sanitizedValue;
    console.log("[CartContext] finalValue of discount:", finalValue, "cartTotal:", cartTotal);
    setDiscount(finalValue);
  };

  const setPromoCodeValue = (code) => {
    console.log("[CartContext] setPromoCodeValue called with:", code);
    setPromoCode(code);
  };

  const setIsDiscountAppliedValue = (val) => {
    console.log("[CartContext] setIsDiscountAppliedValue called with:", val);
    setIsDiscountApplied(val);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        cartTotal,
        discount,
        setDiscount: setDiscountValue,
        promoCode,
        setPromoCode: setPromoCodeValue,
        clearCart,
        isDiscountApplied,
        setIsDiscountApplied: setIsDiscountAppliedValue,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
