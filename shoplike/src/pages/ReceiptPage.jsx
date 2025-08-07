import React, { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Package } from 'lucide-react';

// Define initial state
const initialState = {
  checkedOutItems: [],
  orderDetails: {
    orderNumber: '',
    orderDate: '',
    total: 0,
    subtotal: 0,
    tax: 0,
    estimatedDelivery: '',
    trackingNumber: ''
  }
};

// Define reducer function
const receiptReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CHECKED_OUT_ITEMS':
      return {
        ...state,
        checkedOutItems: action.payload
      };
    case 'SET_ORDER_DETAILS':
      return {
        ...state,
        orderDetails: action.payload
      };
    default:
      return state;
  }
};

export const ReceiptPage = () => {
  const navigate = useNavigate();
  
  // Use reducer instead of multiple useState calls
  const [state, dispatch] = useReducer(receiptReducer, initialState);

  useEffect(() => {
    // Try to get order information from localStorage
    const storedOrderInfo = localStorage.getItem('orderInfo');
    if (storedOrderInfo) {
      try {
        const orderInfo = JSON.parse(storedOrderInfo);
        dispatch({ type: 'SET_CHECKED_OUT_ITEMS', payload: orderInfo.items || [] });
        
        // Get order ID from localStorage
        const orderId = orderInfo.orderId || localStorage.getItem('lastOrderId');
        
        // Set order details
        dispatch({
          type: 'SET_ORDER_DETAILS',
          payload: {
            orderNumber: orderId ? `ORD-${orderId.substring(0, 6)}` : 'ORD-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
            orderDate: new Date().toLocaleDateString(),
            total: orderInfo.grandTotal || 0,
            subtotal: orderInfo.subtotal || 0,
            tax: orderInfo.tax || 0,
            estimatedDelivery: orderInfo.estimatedDelivery || new Date(new Date().setDate(new Date().getDate() + 5)).toLocaleDateString(),
            trackingNumber: orderInfo.trackingNumber || ''
          }
        });
      } catch (error) {
        console.error('Error parsing order information:', error);
      }
    } else {
      // If no order info found, try to get checked out items from localStorage (backward compatibility)
      const storedItems = localStorage.getItem('checkedOutItems');
      if (storedItems) {
        try {
          const parsedItems = JSON.parse(storedItems);
          dispatch({ type: 'SET_CHECKED_OUT_ITEMS', payload: parsedItems });
          
          // Calculate total
          const subtotal = parsedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const tax = subtotal * 0.08;
          const total = subtotal + tax;
          
          // Generate random order number
          const orderNumber = 'ORD-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
          
          dispatch({
            type: 'SET_ORDER_DETAILS',
            payload: {
              orderNumber,
              orderDate: new Date().toLocaleDateString(),
              total,
              subtotal,
              tax,
              estimatedDelivery: new Date(new Date().setDate(new Date().getDate() + 5)).toLocaleDateString()
            }
          });
        } catch (error) {
          console.error('Error parsing checked out items:', error);
        }
      } else {
        // If no items found, redirect to home
        navigate('/');
      }
    }
    
    // Clear the localStorage after loading
    return () => {
      localStorage.removeItem('checkedOutItems');
      // Don't remove orderInfo here as it might be needed for the receive page
    };
  }, [navigate]);

  const handlePrint = () => {
    window.print();
  };

  // Destructure state for easier access in JSX
  const { checkedOutItems } = state;
  const { orderDetails } = state;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="print:hidden mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>Continue Shopping</span>
        </button>
        
        <button
          onClick={handlePrint}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
        >
          Print Receipt
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
        </div>

        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-lg font-semibold text-gray-800">{orderDetails.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-lg font-semibold text-gray-800">{orderDetails.orderDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Est. Delivery</p>
              <p className="text-lg font-semibold text-gray-800">{orderDetails.estimatedDelivery}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-lg font-semibold text-orange-600">${orderDetails.total?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Package className="mr-2" size={20} />
          Order Summary
        </h2>

        <div className="space-y-4 mb-6">
          {checkedOutItems.map((item, index) => (
            <div key={index} className="flex items-center border-b border-gray-100 pb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
                <img
                  src={item.image || item.imageUrl || "/placeholder.png"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">${item.price} each</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-800">${orderDetails.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="text-gray-800">${orderDetails.tax?.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span className="text-gray-800">Total:</span>
                <span className="text-orange-600">${orderDetails.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Track Your Order</h3>
        {orderDetails.trackingNumber && (
          <div className="mb-4">
            <p className="text-blue-700">
              Your tracking number: <span className="font-semibold">{orderDetails.trackingNumber}</span>
            </p>
            <button
              onClick={() => navigate('/receive')}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Track & Receive Order
            </button>
          </div>
        )}
        <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">Need Help?</h3>
        <p className="text-blue-700 mb-4">
          If you have any questions about your order, please contact our customer support.
        </p>
        <p className="text-blue-800 font-semibold">support@shophub.com | (123) 456-7890</p>
      </div>
    </div>
  );
};