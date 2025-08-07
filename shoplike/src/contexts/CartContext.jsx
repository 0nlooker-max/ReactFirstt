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
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'ADD_TO_CART_WITH_QUANTITY': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...product, quantity }],
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
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const addToCartWithQuantity = (product, quantity) => {
    dispatch({ type: 'ADD_TO_CART_WITH_QUANTITY', payload: { product, quantity } });
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
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Checkout function: deducts quantities, records order, clears cart
  const checkout = async (formData) => {
    // 1. Deduct product quantities in Firestore
    for (const item of state.items) {
      // Get current product data
      const product = await getProduct(item.id);
      if (!product) continue;
      const newQuantity = (product.quantity || 0) - item.quantity;
      await updateProduct(item.id, { quantity: newQuantity });
    }
    
    // Calculate totals
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.08;
    const grandTotal = subtotal + tax;
    
    // 2. Record the order in Firestore with customer information
    const orderData = {
      items: state.items.map(({ id, name, price, quantity, image }) => ({ 
        id, 
        name, 
        price, 
        quantity,
        image // Include image for display in receive page
      })),
      subtotal: subtotal,
      tax: tax,
      grandTotal: grandTotal,
      customerInfo: formData, // Include customer information
    };
    
    // Save order to Firestore
    const orderId = await createOrder(orderData);
    
    // Save order ID to localStorage for receipt page
    localStorage.setItem('lastOrderId', orderId);
    
    // 3. Clear the cart
    clearCart();
    
    return orderId;
  };

  const value = {
    state,
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
    checkout,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};