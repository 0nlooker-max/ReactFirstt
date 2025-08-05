import React, { useState } from "react";
import { X, Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import "../assets/componentcss/AddToCartModal.css";

export const AddToCartModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setShowConfirmation(true);
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
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        {!showConfirmation ? (
          <>
            <div className="modal-header">
              <h3 className="modal-title">Add to Cart</h3>
              <button onClick={handleClose} className="close-btn" aria-label="Close">
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="product-summary">
                <div className="image-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-thumb"
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
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="qty-display">{quantity}</div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
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
