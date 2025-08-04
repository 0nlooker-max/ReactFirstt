import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingCart } from "lucide-react";
import "../assets/addprdct/list.css";

export const ProductCard = ({ product = {}, onAddToCart = () => {} }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={12} className="star filled" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={12} className="star half" />
      );
    }

    const remaining = 5 - stars.length;
    for (let i = 0; i < remaining; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={12} className="star empty" />
      );
    }

    return stars;
  };

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div
      className={`pcard ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="image-link">
        <div className="image-wrapper">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="product-img"
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
          {product.badge && (
            <div className="badge badge-primary">{product.badge}</div>
          )}
          {discountPercentage > 0 && (
            <div className="badge badge-secondary">-{discountPercentage}%</div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked((l) => !l);
            }}
            className={`like-btn ${isLiked ? "liked" : ""}`}
            aria-label="like"
          >
            <Heart size={16} className={isLiked ? "heart-filled" : ""} />
          </button>
        </div>
      </Link>

      <div className="content">
        <Link
          to={`/product/${product.id}`}
          className="title"
        >
          {product.name}
        </Link>

        <div className="rating-row">
          <div className="stars">{renderStars(product.rating)}</div>
          <span className="review-count">
            {product.rating ? product.rating.toFixed(1) : "0.0"} (
            {product.reviewCount
              ? product.reviewCount.toLocaleString()
              : "0"}
            )
          </span>
        </div>

        <div className="price-row">
          <span className="price">${product.price?.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="original-price">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="seller-info">
          <span>{product.seller}</span>
          <span className="dot">•</span>
          <span>{product.location}</span>
        </div>

        <button
          onClick={handleAddToCart}
          className={`add-cart-btn ${isHovered ? "active" : ""}`}
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
