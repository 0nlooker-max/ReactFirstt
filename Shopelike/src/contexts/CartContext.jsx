//../contexts/CartContext
import React, { useReducer, useContext } from 'react';
import { updateProduct, createOrder, getProduct } from '../services/productService';

const initialState = {
  items: [],
  isOpen: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      // Always ensure price and quantity are valid
      const price = typeof action.payload.price === 'number' && !isNaN(action.payload.price) ? action.payload.price : 0;
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1, price }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1, price }],
      };
    }
    case 'ADD_TO_CART_WITH_QUANTITY': {
      const { product, quantity } = action.payload;
      const price = typeof product.price === 'number' && !isNaN(product.price) ? product.price : 0;
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity, price }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...product, quantity, price }],
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };
    default:
      return state;
  }
};

const CartContext = React.createContext(undefined);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product) => {
    // Ensure we're using the correct Firestore document ID
    if (product && product.id) {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    } else {
      console.error('Attempted to add product without ID to cart:', product);
    }
  };

  const addToCartWithQuantity = (product, quantity) => {
    // Ensure we're using the correct Firestore document ID
    if (product && product.id) {
      dispatch({ type: 'ADD_TO_CART_WITH_QUANTITY', payload: { product, quantity } });
    } else {
      console.error('Attempted to add product without ID to cart with quantity:', product);
    }
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      const price = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
      const quantity = typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 0;
      return total + (price * quantity);
    }, 0);
  };

 const checkout = async (formData, totals, items) => {
  const failedUpdates = [];
  const successfulUpdates = [];
  const missingProducts = [];
  const validItems = [];

  console.log('Starting checkout process with items:', items.length);

  for (const item of items) {
    try {
      if (!item || (!item.id && !item.productId)) {
        console.warn('Invalid cart item found:', item);
        continue;
      }

      await new Promise(resolve => setTimeout(resolve, 300));

      const productId = item.productId || item.id; // fallback
      console.log(`Validating product: ${productId}`);

      const product = await getProduct(productId);

      if (!product) {
        console.warn(`Product not found in database: ${productId}`);
        missingProducts.push(productId);
        continue;
      }

      validItems.push({ item, product });
      console.log(`Successfully validated product: ${productId} (${product.name})`);
    } catch (error) {
      console.error('Error validating product', error);
    }
  }

  console.log(`Found ${validItems.length} valid products and ${missingProducts.length} missing products`);

  for (const { item, product } of validItems) {
    try {
      const productQuantity = Number(product.quantity) || 0;
      const itemQuantity = Number(item.quantity) || 0;
      const productId = item.productId || item.id; // ✅ consistent

      if (isNaN(productQuantity) || isNaN(itemQuantity)) {
        console.error(`Invalid quantities for ${productId}`);
        failedUpdates.push(productId);
        continue;
      }

      const newQuantity = Math.max(0, productQuantity - itemQuantity);

      try {
        await updateProduct(productId, { quantity: newQuantity });
        successfulUpdates.push(productId);
        console.log(`Updated ${productId} quantity to ${newQuantity}`);
      } catch (err) {
        console.error(`Update failed for ${productId}, retrying...`, err);
        await new Promise(resolve => setTimeout(resolve, 1500));
        await updateProduct(productId, { quantity: newQuantity });
        successfulUpdates.push(productId);
      }
    } catch (error) {
      console.error('Error processing product', error);
    }
  }

  console.log(`Checkout complete: ${successfulUpdates.length} updated, ${failedUpdates.length} failed, ${missingProducts.length} missing`);

  const validOrderItems = items.filter(item => !missingProducts.includes(item.productId || item.id));

  const orderData = {
    items: validOrderItems.map(({ productId, id, name, price, quantity, image }) => ({
      id: productId || id,
      name,
      price,
      quantity,
      image
    })),
    subtotal: totals.subtotal,
    tax: totals.tax,
    grandTotal: totals.grandTotal,
    customerInfo: formData
  };

  const orderId = await createOrder(orderData);
  localStorage.setItem('lastOrderId', orderId);

  clearCart();
  return orderId;
};


  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        addToCart,
        addToCartWithQuantity,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        getTotalItems,
        getTotalPrice,
        checkout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};