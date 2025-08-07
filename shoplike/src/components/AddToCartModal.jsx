import React, { useState, useReducer } from "react";
import { X, Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { addCartItem } from "../services/productService";
import "../assets/componentcss/AddToCartModal.css";

// Modal reducer for local state management
const initialModalState = {
  quantity: 1,
  showConfirmation: false,
};

const modalReducer = (state, action) => {
  switch (action.type) {
    case 'SET_QUANTITY':
      return { ...state, quantity: action.payload };
    case 'SHOW_CONFIRMATION':
      return { ...state, showConfirmation: true };
    case 'HIDE_CONFIRMATION':
      return { ...state, showConfirmation: false, quantity: 1 };
    case 'RESET':
      return initialModalState;
    default:
      return state;
  }
};

export const AddToCartModal = ({ product, isOpen, onClose }) => {
  const [modalState, modalDispatch] = useReducer(modalReducer, initialModalState);
  const { quantity, showConfirmation } = modalState;
  const { state, addToCartWithQuantity } = useCart();

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    // Add to cart using the context function with quantity
    addToCartWithQuantity(product, quantity);
    
    // Save all product information to Firestore
    await addCartItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity,
      image: product.image || product.imageUrl,
      seller: product.seller || 'Unknown Seller',
      description: product.description,
      category: product.category,
      // Include any other product information available
      ...(product.details && { details: product.details }),
      ...(product.rating && { rating: product.rating }),
    });
    
    // Show confirmation and handle modal state
    modalDispatch({ type: 'SHOW_CONFIRMATION' });
    setTimeout(() => {
      modalDispatch({ type: 'HIDE_CONFIRMATION' });
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    modalDispatch({ type: 'RESET' });
    onClose();
  };

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;
  const mainImage = product.image || product.imageUrl || "";

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        {!showConfirmation ? (
          <>
            <div className="modal-header">
              <h3 className="modal-title">Add to Cart</h3>
              <button
                onClick={handleClose}
                className="close-btn"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="product-summary">
                <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                </div>
                <div className="info">
                  <h4 className="product-name">{product.name}</h4>
                  <div className="price-row">
                    <span className="price">${product.price}</span>
                    {product.originalPrice && (
                      <>
                        <span className="original-price">
                          ${product.originalPrice}
                        </span>
                        <span className="discount-badge">
                          -{discountPercentage}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  <p className="seller">Sold by: {product.seller}</p>
                </div>
              </div>

              <div className="quantity-section">
                <label className="label">Quantity</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => modalDispatch({ 
                      type: 'SET_QUANTITY', 
                      payload: Math.max(1, quantity - 1) 
                    })}
                    className="qty-btn"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="qty-display">{quantity}</div>
                  <button
                    onClick={() => modalDispatch({ 
                      type: 'SET_QUANTITY', 
                      payload: quantity + 1 
                    })}
                    className="qty-btn"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="total-row">
                <div className="total-label">Total Price:</div>
                <div className="total-value">
                  ${(product.price * quantity).toFixed(2)}
                </div>
              </div>

              <div className="actions-row">
                <button onClick={handleClose} className="btn secondary">
                  Cancel
                </button>
                <button onClick={handleAddToCart} className="btn primary">
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="confirmation">
            <div className="confirm-icon">
              <div className="circle">
                <Check size={32} className="checkmark" />
              </div>
            </div>
            <h3 className="confirm-title">Added to Cart!</h3>
            <p className="confirm-text">
              {quantity} {quantity === 1 ? "item" : "items"} of "{product.name}"
              added to your cart.
            </p>
            <div className="confirm-summary">
              <span className="summary-label">Total:</span>
              <span className="summary-value">
                ${(product.price * quantity).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
