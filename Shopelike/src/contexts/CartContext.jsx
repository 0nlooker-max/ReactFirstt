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
    // Deduct product quantities in Firestore
    const failedUpdates = [];
    const successfulUpdates = [];
    const missingProducts = [];
    const validItems = [];
    
    console.log('Starting checkout process with items:', items.length);
    
    // First, validate all items and filter out missing products
    for (const item of items) {
      try {
        if (!item || !item.id) {
          console.warn('Found invalid item in cart without ID:', item);
          continue;
        }
        
        // Force a small delay between operations to avoid overwhelming Firestore
        await new Promise(resolve => setTimeout(resolve, 300));
        
        console.log(`Validating product: ${item.id}`);
        const product = await getProduct(item.id);
        
        if (!product) {
          console.warn(`Product not found in database: ${item.id}. It may have been deleted.`);
          missingProducts.push(item.id);
          continue;
        }
        
        // Add to valid items list
        validItems.push({item, product});
        console.log(`Successfully validated product: ${item.id} (${product.name})`);
      } catch (error) {
        console.error(`Error validating product ${item.id}:`, error);
        missingProducts.push(item.id);
      }
    }
    
    console.log(`Found ${validItems.length} valid products and ${missingProducts.length} missing products`);
    
    if (validItems.length === 0) {
      console.warn('No valid products found to update quantities. Proceeding with order anyway.');
    } else {
      // Process only valid items
      for (const {item, product} of validItems) {
        try {
          // Product quantity should already be a number from our improved getProduct function
          // But we'll still handle all possible scenarios
          const productQuantity = Number(product.quantity) || 0;
          const itemQuantity = Number(item.quantity) || 0;
          
          if (isNaN(productQuantity) || isNaN(itemQuantity)) {
            console.error(`Invalid quantity values for product ${item.id}: product=${product.quantity}, item=${item.quantity}`);
            failedUpdates.push(item.id);
            continue;
          }
          
          // Calculate new quantity and ensure it's not negative
          const newQuantity = Math.max(0, productQuantity - itemQuantity);
          console.log(`Updating product ${product.name} (${item.id}): ${productQuantity} - ${itemQuantity} = ${newQuantity}`);
          
          // Update the product quantity in Firestore with retry logic
          try {
            await updateProduct(item.id, { quantity: newQuantity });
            successfulUpdates.push(item.id);
            console.log(`Successfully updated quantity for product ${item.id} to ${newQuantity}`);
          } catch (updateError) {
            console.error(`Failed to update product ${item.id}, retrying once...`, updateError);
            // Retry once after a short delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            try {
              await updateProduct(item.id, { quantity: newQuantity });
              successfulUpdates.push(item.id);
              console.log(`Successfully updated quantity for product ${item.id} to ${newQuantity} on retry`);
            } catch (retryError) {
              console.error(`Retry failed for product ${item.id}`, retryError);
              failedUpdates.push(item.id);
            }
          }
        } catch (error) {
          console.error(`Error processing item ${item.id}:`, error);
          failedUpdates.push(item.id);
        }
      }
    }
    
    console.log(`Checkout complete: ${successfulUpdates.length} products updated successfully, ${failedUpdates.length} failed, ${missingProducts.length} missing`);
    
    if (failedUpdates.length > 0) {
      console.warn(`Failed to update quantities for ${failedUpdates.length} products. Order will proceed anyway.`);
    }
    
    if (missingProducts.length > 0) {
      console.warn(`${missingProducts.length} products were not found in the database. They may have been deleted.`);
      console.warn('Missing product IDs:', missingProducts);
    }

    // Filter out missing products from the order items
    const validOrderItems = items.filter(item => !missingProducts.includes(item.id));
    
    // Prepare order data with passed totals
    const orderData = {
      items: validOrderItems.map(({ id, name, price, quantity, image }) => ({
        id,
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

    // Clear cart after successful order
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