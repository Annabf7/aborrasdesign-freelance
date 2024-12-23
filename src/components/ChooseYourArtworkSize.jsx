// ChooseYourArtworkSize.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/ChooseYourArtworkSize.css';
import { CartContext } from './CartContext';

// Assignació dinàmica de BASE_URL segons l'entorn
const BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_BASE_URL_PROD
  : process.env.REACT_APP_BASE_URL_DEV;

const ChooseYourArtworkSize = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedStyle } = location.state || {}; // Estil seleccionat opcional
  const { addToCart, cartItems } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log('BASE_URL:', process.env.REACT_APP_BASE_URL_DEV);
    console.log('Stripe Public Key Test:', process.env.REACT_APP_STRIPE_PUBLIC_KEY_TEST);
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const idToFetch = productId || selectedStyle?.id;
        if (!idToFetch) {
          throw new Error('Invalid product ID.');
        }

        const response = await fetch(
          `${BASE_URL}/printful/products/${idToFetch}`
        );
        const data = await response.json();

        if (!data || !data.sync_product || !data.sync_variants) {
          throw new Error('Product data not found.');
        }

        console.log('Fetched Product Data:', data);

        setProduct({
          ...data.sync_product,
          sync_variants: data.sync_variants,
        });

        // Selecciona la variant per defecte o la variant seleccionada
        const variantId = selectedStyle?.variantId;
        const selectedVariant =
          data.sync_variants.find((v) => v.id === variantId) ||
          data.sync_variants[0];

        if (!selectedVariant) {
          throw new Error(
            `Selected variant not found. Available variants: ${JSON.stringify(
              data.sync_variants
            )}`
          );
        }

        setSelectedVariant(selectedVariant);
        setTotalPrice(parseFloat(selectedVariant.retail_price));
      } catch (error) {
        console.error('Error loading product:', error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, selectedStyle]);

  const handleVariantChange = (e) => {
    const variantId = parseInt(e.target.value, 10);
    const variant = product?.sync_variants?.find((v) => v.id === variantId);
    setSelectedVariant(variant);
    setTotalPrice(parseFloat(variant?.retail_price || 0) * quantity);
  };

  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value, 10) || 1;
    setQuantity(qty);
    if (selectedVariant) {
      setTotalPrice(parseFloat(selectedVariant.retail_price) * qty);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Please select a size before adding to cart.');
      return;
    }

    // Captura de dades clau
    const cartItem = {
      name: product.name,
      size: selectedVariant.name,
      price: parseFloat(selectedVariant.retail_price),
      image:
        selectedStyle?.img ||
        selectedVariant?.product?.image ||
        'https://via.placeholder.com/300',
      styleName: selectedStyle?.name || product.name,
      sync_variant_id: selectedVariant.id, // Sync variant ID necessari per Printful
      variant_id: selectedVariant.product.variant_id, // Variant ID necessari per Printful Shipping
      quantity,
      totalPrice,
    };

    // Log per depuració
    console.log('Adding to cart:', cartItem);

    // Afegir al context del carret
    addToCart(cartItem);

    // Mostra el modal de confirmació
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      alert('Your cart is empty. Please add items before proceeding to checkout.');
      return;
    }

    // Log de totes les dades abans de la navegació
    console.log('Proceeding to checkout with cart items:', cartItems);

    navigate('/checkout', {
      state: {
        cartItems, // Passa tots els articles del carret
      },
    });
  };

  if (isLoading) {
    return <div className="loading-message">Loading artwork details...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <h2>Error:</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/generative-art')}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="choose-your-artwork-container">
      <h2>{product.name}</h2>
      <div className="artwork-layout">
        <div className="artwork-details">
          <img
            src={product.thumbnail_url || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="artwork-image"
          />
        </div>

        <div className="artwork-options">
          <label htmlFor="variant-select">Select Size:</label>
          <select
            id="variant-select"
            value={selectedVariant?.id || ''}
            onChange={handleVariantChange}
          >
            {product.sync_variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.name} - €{parseFloat(variant.retail_price).toFixed(2)}
              </option>
            ))}
          </select>

          <label htmlFor="quantity-input">Quantity:</label>
          <input
            type="number"
            id="quantity-input"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
          />

          <div className="variant-thumbnail-preview">
            <img
              src={
                selectedVariant.product.image ||
                selectedVariant.files.find((file) => file.type === 'preview')
                  ?.preview_url ||
                'https://via.placeholder.com/150'
              }
              alt={`Selected Variant: ${selectedVariant.name}`}
              className="variant-thumbnail"
            />
          </div>

          <div className="total-price">
            <h3>Total Price: €{totalPrice.toFixed(2)}</h3>
          </div>

          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>This was added to your cart!</h2><hr></hr>
            <img
              src={
                selectedVariant.product.image ||
                selectedVariant.files.find((file) => file.type === 'preview')
                  ?.preview_url ||
                'https://via.placeholder.com/300'
              }
              alt={selectedVariant.name}
              className="artwork-preview"
            />
            <h3>{product.name}</h3><hr></hr>
            <p>Size: {selectedVariant.name}</p><hr></hr>
            <p>Quantity: {quantity}</p><hr></hr>
            <p>Total Price: €{totalPrice.toFixed(2)}</p><hr></hr>
            <button className="close-button" onClick={closeModal}>
              x
            </button>
            <button className="checkout-button" onClick={handleCheckout}>
              Go to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChooseYourArtworkSize;
