import React, { useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Package, Search, CheckCircle, XCircle } from 'lucide-react';
import { getOrderByTrackingNumber, getAllOrders } from '../services/productService';

// Define initial state
const initialState = {
  receivedItems: [],
  trackingNumber: '',
  isSearching: false,
  searchError: '',
  receivedStatus: {},
  recentOrders: []
};

// Define reducer function
const receiveReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RECEIVED_ITEMS':
      return {
        ...state,
        receivedItems: action.payload
      };
    case 'SET_TRACKING_NUMBER':
      return {
        ...state,
        trackingNumber: action.payload
      };
    case 'SET_IS_SEARCHING':
      return {
        ...state,
        isSearching: action.payload
      };
    case 'SET_SEARCH_ERROR':
      return {
        ...state,
        searchError: action.payload
      };
    case 'SET_RECEIVED_STATUS':
      return {
        ...state,
        receivedStatus: action.payload
      };
    case 'UPDATE_RECEIVED_STATUS':
      return {
        ...state,
        receivedStatus: {
          ...state.receivedStatus,
          [action.payload.itemId]: action.payload.status
        }
      };
    case 'SET_RECENT_ORDERS':
      return {
        ...state,
        recentOrders: action.payload
      };
    default:
      return state;
  }
};

export const ReceivePage = () => {
  const navigate = useNavigate();
  
  // Use reducer instead of multiple useState calls
  const [state, dispatch] = useReducer(receiveReducer, initialState);
  
  // Fetch recent orders on component mount
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const orders = await getAllOrders();
        // Sort by creation date (newest first)
        const sortedOrders = orders.sort((a, b) => b.createdAt - a.createdAt);
        // Take only the 5 most recent orders
        dispatch({ type: 'SET_RECENT_ORDERS', payload: sortedOrders.slice(0, 5) });
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      }
    };
    
    fetchRecentOrders();
  }, []);
  
  // Sample orders for fallback if no orders in Firebase yet
  const sampleOrders = [
    {
      trackingNumber: 'TRK123456',
      orderNumber: 'ORD-123456',
      orderDate: '2023-05-15',
      estimatedDelivery: '2023-05-20',
      status: 'In Transit',
      items: [
        {
          id: 1,
          name: 'Wireless Headphones',
          price: 79.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        },
        {
          id: 2,
          name: 'Smart Watch',
          price: 149.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1099&q=80'
        }
      ]
    },
    {
      trackingNumber: 'TRK789012',
      orderNumber: 'ORD-789012',
      orderDate: '2023-05-18',
      estimatedDelivery: '2023-05-23',
      status: 'Out for Delivery',
      items: [
        {
          id: 3,
          name: 'Bluetooth Speaker',
          price: 59.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        }
      ]
    }
  ];

  const handleSearch = async () => {
    if (!state.trackingNumber.trim()) {
      dispatch({ type: 'SET_SEARCH_ERROR', payload: 'Please enter a tracking number' });
      return;
    }
    
    dispatch({ type: 'SET_IS_SEARCHING', payload: true });
    dispatch({ type: 'SET_SEARCH_ERROR', payload: '' });
    
    try {
      // Search for order in Firebase by tracking number
      const foundOrder = await getOrderByTrackingNumber(state.trackingNumber);
      
      if (foundOrder) {
        dispatch({ type: 'SET_RECEIVED_ITEMS', payload: [foundOrder] });
        // Initialize received status for each item
        const initialStatus = {};
        foundOrder.items.forEach(item => {
          initialStatus[item.id] = false;
        });
        dispatch({ type: 'SET_RECEIVED_STATUS', payload: initialStatus });
      } else {
        // If not found in Firebase, check sample orders (for demo purposes)
        const sampleOrder = sampleOrders.find(order => 
          order.trackingNumber.toLowerCase() === state.trackingNumber.toLowerCase());
          
        if (sampleOrder) {
          dispatch({ type: 'SET_RECEIVED_ITEMS', payload: [sampleOrder] });
          // Initialize received status for each item
          const initialStatus = {};
          sampleOrder.items.forEach(item => {
            initialStatus[item.id] = false;
          });
          dispatch({ type: 'SET_RECEIVED_STATUS', payload: initialStatus });
        } else {
          dispatch({ type: 'SET_SEARCH_ERROR', payload: 'No order found with this tracking number' });
          dispatch({ type: 'SET_RECEIVED_ITEMS', payload: [] });
        }
      }
    } catch (error) {
      console.error('Error searching for order:', error);
      dispatch({ type: 'SET_SEARCH_ERROR', payload: 'An error occurred while searching for your order' });
    } finally {
      dispatch({ type: 'SET_IS_SEARCHING', payload: false });
    }
  };

  const handleReceiveItem = (itemId) => {
    dispatch({
      type: 'UPDATE_RECEIVED_STATUS',
      payload: {
        itemId,
        status: !state.receivedStatus[itemId]
      }
    });
  };

  const handleReceiveAll = (orderId) => {
    const order = state.receivedItems.find(item => item.trackingNumber === orderId);
    if (!order) return;
    
    const newStatus = {...state.receivedStatus};
    order.items.forEach(item => {
      newStatus[item.id] = true;
    });
    
    dispatch({ type: 'SET_RECEIVED_STATUS', payload: newStatus });
  };

  const allItemsReceived = (order) => {
    return order.items.every(item => state.receivedStatus[item.id]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Track & Receive Orders</h1>
          <p className="text-gray-600">
            Enter your tracking number to find your order and mark items as received.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={state.trackingNumber}
                onChange={(e) => dispatch({ type: 'SET_TRACKING_NUMBER', payload: e.target.value })}
                placeholder="Enter tracking number (e.g. TRK123456)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {state.searchError && <p className="text-red-500 text-sm mt-1">{state.searchError}</p>}
            </div>
            <button
              onClick={handleSearch}
              disabled={state.isSearching}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            >
              {state.isSearching ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : (
                <span className="flex items-center">
                  <Search size={18} className="mr-2" />
                  Track Order
                </span>
              )}
            </button>
          </div>
        </div>

        {state.receivedItems.length > 0 && (
          <div>
            {state.receivedItems.map((order) => (
              <div key={order.trackingNumber} className="border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Order #{order.orderNumber}</h2>
                    <p className="text-gray-600">Tracking: {order.trackingNumber}</p>
                  </div>
                  <div className="mt-2 md:mt-0 text-right">
                    <p className="text-gray-600">Order Date: {order.orderDate}</p>
                    <p className="text-gray-600">Est. Delivery: {order.estimatedDelivery}</p>
                    <p className={`font-semibold ${order.status === 'Delivered' ? 'text-green-600' : 'text-orange-600'}`}>
                      Status: {order.status}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Package className="mr-2" size={18} />
                      Items to Receive
                    </h3>
                    <button
                      onClick={() => handleReceiveAll(order.trackingNumber)}
                      className={`text-sm px-3 py-1 rounded ${allItemsReceived(order) ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                      disabled={allItemsReceived(order)}
                    >
                      {allItemsReceived(order) ? 'All Received' : 'Mark All as Received'}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div 
                        key={item.id} 
                        className={`flex items-center border-b border-gray-100 pb-4 ${state.receivedStatus[item.id] ? 'bg-green-50 rounded-lg p-2' : ''}`}
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
                          <img
                            src={item.image || "/placeholder.png"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right mr-4">
                          <p className="text-lg font-semibold text-gray-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">${item.price} each</p>
                        </div>
                        <button
                          onClick={() => handleReceiveItem(item.id)}
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${state.receivedStatus[item.id] ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                          {state.receivedStatus[item.id] ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="text-gray-800">{order.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items Received:</span>
                      <span className="text-gray-800">
                        {Object.values(state.receivedStatus).filter(Boolean).length} of {order.items.length}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span className="text-gray-800">Order Total:</span>
                        <span className="text-blue-600">
                          ${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {state.receivedItems.length === 0 && !state.isSearching && !state.searchError && (
          <div>
            {state.recentOrders.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Recent Orders</h3>
                <div className="space-y-4">
                  {state.recentOrders.map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">Order #{order.id.substring(0, 8)}</p>
                          <p className="text-sm text-gray-600">Tracking: {order.trackingNumber}</p>
                          <p className="text-sm text-gray-600">Order Date: {order.orderDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Est. Delivery: {order.estimatedDelivery}</p>
                          <p className={`text-sm font-semibold ${order.status === 'Delivered' ? 'text-green-600' : 'text-orange-600'}`}>
                            Status: {order.status}
                          </p>
                          <button 
                            onClick={() => {
                              dispatch({ type: 'SET_TRACKING_NUMBER', payload: order.trackingNumber });
                              handleSearch();
                            }}
                            className="mt-2 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors duration-200"
                          >
                            Track & Receive
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h3>
                <p className="text-gray-500">
                  Enter a tracking number to find your order and mark items as received.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try sample tracking numbers: TRK123456 or TRK789012
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Need Help?</h3>
        <p className="text-blue-700 mb-4">
          If you have any questions about receiving your order, please contact our customer support.
        </p>
        <p className="text-blue-800 font-semibold">support@shophub.com | (123) 456-7890</p>
      </div>
    </div>
  );
};