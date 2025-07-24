import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../contexts/CartContext';

interface AddToCartModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToCartModal: React.FC<AddToCartModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    // Add the specified quantity to cart
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    // Show confirmation
    setShowConfirmation(true);
    
    // Auto close after 2 seconds
    setTimeout(() => {
      setShowConfirmation(false);
      setQuantity(1);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setQuantity(1);
    setShowConfirmation(false);
    onClose();
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {!showConfirmation ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Add to Cart</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex space-x-4 mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-2">{product.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-red-600">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                        <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          -{discountPercentage}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Sold by: {product.seller}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quantity
                </label>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Minus size={16} />
                  </button>
                  
                  <div className="w-20 h-12 border border-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-semibold">{quantity}</span>
                  </div>
                  
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Price:</span>
                  <span className="text-xl font-bold text-red-600">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Confirmation Message */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Added to Cart!
            </h3>
            <p className="text-gray-600 mb-4">
              {quantity} {quantity === 1 ? 'item' : 'items'} of "{product.name}" added to your cart.
            </p>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-green-800 font-medium">
                Total: ${(product.price * quantity).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};