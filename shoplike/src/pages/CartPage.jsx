import React, { useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { getCartItems } from "../services/productService";

// Local reducer for cart page UI state
const initialCartPageState = {
  checkoutSuccess: false,
  firebaseCartItems: [],
  isLoading: false,
  selectedItems: [],
  redirectToReceipt: false,
  checkedOutItems: []
};

const cartPageReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CHECKOUT_SUCCESS':
      return { ...state, checkoutSuccess: action.payload };
    case 'SET_FIREBASE_ITEMS':
      return { ...state, firebaseCartItems: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'TOGGLE_ITEM_SELECTION':
      const itemId = action.payload;
      const isSelected = state.selectedItems.includes(itemId);
      return { 
        ...state, 
        selectedItems: isSelected 
          ? state.selectedItems.filter(id => id !== itemId)
          : [...state.selectedItems, itemId]
      };
    case 'SET_REDIRECT_TO_RECEIPT':
      return { ...state, redirectToReceipt: action.payload };
    case 'SET_CHECKED_OUT_ITEMS':
      return { ...state, checkedOutItems: action.payload };
    default:
      return state;
  }
};

export const CartPage = () => {
  const navigate = useNavigate();
  const { state, dispatch, checkout } = useCart();
  const [pageState, pageDispatch] = useReducer(cartPageReducer, initialCartPageState);
  useEffect(() => {
    const fetchCartItems = async () => {
      pageDispatch({ type: 'SET_LOADING', payload: true });
      try {
        const items = await getCartItems();
        pageDispatch({ type: 'SET_FIREBASE_ITEMS', payload: items });
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        pageDispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    fetchCartItems();
  }, []);

  // Combine local and firebase cart items for display and summary
  const allCartItems = [
    ...state.items.map(item => ({ ...item, _source: 'local' })),
    ...pageState.firebaseCartItems.map(item => ({ ...item, _source: 'firebase' }))
  ];

  // Get selected items
  const selectedItems = allCartItems.filter(item => 
    pageState.selectedItems.includes(item.id) || 
    (item._source === 'firebase' && pageState.selectedItems.includes('firebase-' + item.id))
  );

  // Calculate totals based on selected items
  const totalItems = selectedItems.length > 0 
    ? selectedItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : allCartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
  const subtotal = selectedItems.length > 0
    ? selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : allCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200"
      >
        <ArrowLeft size={20} />
        <span>Continue Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Shopping Cart ({totalItems} items)
              </h2>
            </div>

            <div className="space-y-4 p-4">
              {allCartItems.map((item) => (
                <div
                  key={(item._source === 'firebase' ? 'firebase-' : '') + item.id}
                  className={`flex flex-col sm:flex-row bg-white shadow rounded-lg p-4 gap-4 ${pageState.selectedItems.includes((item._source === 'firebase' ? 'firebase-' : '') + item.id) ? 'border-2 border-orange-500' : ''}`}
                >
                  {/* Checkbox for selection */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`select-${(item._source === 'firebase' ? 'firebase-' : '') + item.id}`}
                      checked={pageState.selectedItems.includes((item._source === 'firebase' ? 'firebase-' : '') + item.id)}
                      onChange={() => pageDispatch({ 
                        type: 'TOGGLE_ITEM_SELECTION', 
                        payload: (item._source === 'firebase' ? 'firebase-' : '') + item.id 
                      })}
                      className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                  </div>
                  
                  {/* Image */}
                  <img
                    src={item.image || item.imageUrl || "/placeholder.png"}
                    alt={item.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-md"
                    onError={e => { e.currentTarget.src = "/placeholder.png"; }}
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">Sold by: {item.seller || 'Unknown Seller'}</p>
                      <p className="text-red-600 font-bold text-lg mt-1">${item.price}</p>
                      {item._source === 'firebase' && (
                        <span className="inline-block mt-1 text-xs text-blue-600 bg-blue-50 rounded px-2 py-0.5">Synced from Firebase</span>
                      )}
                    </div>

                    {/* Quantity + Total + Remove */}
                    <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                      {/* Quantity Controls (only for local items) */}
                      <div className="flex items-center border border-gray-300 rounded-md">
                        {item._source === 'local' ? (
                          <>
                            <button
                              onClick={() => dispatch({ 
                                type: 'UPDATE_QUANTITY', 
                                payload: { id: item.id, quantity: item.quantity - 1 }
                              })}
                              className="p-2 hover:bg-gray-100"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4">{item.quantity}</span>
                            <button
                              onClick={() => dispatch({ 
                                type: 'UPDATE_QUANTITY', 
                                payload: { id: item.id, quantity: item.quantity + 1 }
                              })}
                              className="p-2 hover:bg-gray-100"
                            >
                              <Plus size={16} />
                            </button>
                          </>
                        ) : (
                          <span className="px-4">{item.quantity}</span>
                        )}
                      </div>

                      {/* Item Total */}
                      <div className="text-gray-800 font-medium text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={async () => {
                          if (item._source === 'local') {
                            // Remove local item
                            dispatch({ 
                              type: 'REMOVE_FROM_CART', 
                              payload: item.id 
                            });
                          } else if (item._source === 'firebase') {
                            // Remove Firebase item
                            try {
                              const { deleteCartItem } = await import('../services/productService');
                              await deleteCartItem(item.id);
                              
                              // Update UI by removing the item from firebaseCartItems
                              pageDispatch({
                                type: 'SET_FIREBASE_ITEMS',
                                payload: pageState.firebaseCartItems.filter(cartItem => cartItem.id !== item.id)
                              });
                            } catch (error) {
                              console.error('Error deleting cart item:', error);
                            }
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({totalItems} items):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-orange-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={async () => {
                // Check if any items are selected
                if (selectedItems.length === 0) {
                  alert('Please select at least one item to checkout');
                  return;
                }
                
                pageDispatch({ type: 'SET_LOADING', payload: true });
                try {
                  // Store selected items for receipt page
                  pageDispatch({ type: 'SET_CHECKED_OUT_ITEMS', payload: selectedItems });
                  
                  // Create a default customer info object for the cart page checkout
                  // This is a simplified version - in a real app, you would collect this info from the user
                  const customerInfo = {
                    firstName: 'Guest',
                    lastName: 'User',
                    email: 'guest@example.com',
                    phone: '555-555-5555',
                    address: '123 Main St',
                    city: 'Anytown',
                    zipCode: '12345'
                  };
                  
                  // Process checkout for selected items with customer info
                  await checkout(customerInfo);
                  
                  // Remove selected items from Firebase
                  const firebaseItemIds = selectedItems
                    .filter(item => item._source === 'firebase')
                    .map(item => item.id);
                  
                  if (firebaseItemIds.length > 0) {
                    const { deleteCartItems } = await import('../services/productService');
                    await deleteCartItems(firebaseItemIds);
                  }
                  
                  // Remove selected local items
                  selectedItems
                    .filter(item => item._source === 'local')
                    .forEach(item => {
                      dispatch({ type: 'REMOVE_FROM_CART', payload: item.id });
                    });
                  
                  // Show success message
                  pageDispatch({ type: 'SET_CHECKOUT_SUCCESS', payload: true });
                  
                  // Store order information in localStorage for receipt page
                  const orderInfo = {
                    items: selectedItems,
                    total: subtotal,
                    tax: tax,
                    grandTotal: total,
                    customerInfo: customerInfo,
                    orderId: localStorage.getItem('lastOrderId') // Get the order ID saved by checkout function
                  };
                  localStorage.setItem('orderInfo', JSON.stringify(orderInfo));
                  localStorage.setItem('checkedOutItems', JSON.stringify(selectedItems));
                  
                  // Navigate to receipt page
                  setTimeout(() => {
                    pageDispatch({ type: 'SET_REDIRECT_TO_RECEIPT', payload: true });
                    navigate('/receipt');
                  }, 1500);
                } catch (error) {
                  console.error('Error during checkout:', error);
                } finally {
                  pageDispatch({ type: 'SET_LOADING', payload: false });
                }
              }}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200"
              disabled={pageState.isLoading || selectedItems.length === 0}
            >
              {pageState.isLoading ? 'Processing...' : `Checkout Selected (${selectedItems.length})`}
            </button>
            {pageState.checkoutSuccess && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
                Checkout successful! Redirecting to receipt...
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Free shipping</strong> on orders over $50
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
