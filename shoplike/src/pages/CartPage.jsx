import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { getCartItems } from "../services/productService";

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    state,
    removeFromCart,
    updateQuantity,
    checkout,
  } = useCart();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [firebaseCartItems, setFirebaseCartItems] = useState([]);

  useEffect(() => {
    getCartItems().then(setFirebaseCartItems);
  }, []);

  // Combine local and firebase cart items for display and summary
  const allCartItems = [
    ...state.items.map(item => ({ ...item, _source: 'local' })),
    ...firebaseCartItems.map(item => ({ ...item, _source: 'firebase' }))
  ];

  // Calculate totals based on allCartItems
  const totalItems = allCartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotal = allCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
                  className="flex flex-col sm:flex-row bg-white shadow rounded-lg p-4 gap-4"
                >
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
                      <p className="text-sm text-gray-500">Sold by: {item.seller}</p>
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
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
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

                      {/* Remove Button (only for local items) */}
                      {item._source === 'local' && (
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
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
                await checkout();
                setCheckoutSuccess(true);
                setTimeout(() => setCheckoutSuccess(false), 2500);
              }}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200"
            >
              Proceed to Checkout
            </button>
            {checkoutSuccess && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
                Checkout successful! Your order has been placed.
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
