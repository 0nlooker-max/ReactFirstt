import React, { useState } from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={12} className="fill-yellow-400 text-yellow-400 opacity-50" />
      );
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={12} className="text-gray-300" />
      );
    }

    return stars;
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className={`
        bg-white rounded-lg shadow-md border border-gray-100
        transition-all duration-300 cursor-pointer group
        ${isHovered ? 'shadow-xl transform -translate-y-2' : 'hover:shadow-lg'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            {product.badge}
          </div>
        )}

        {/* Discount badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
            -{discountPercentage}%
          </div>
        )}

        {/* Like button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`
            absolute bottom-2 right-2 p-2 rounded-full transition-all duration-200
            ${isLiked 
              ? 'bg-red-500 text-white' 
              : 'bg-white bg-opacity-80 text-gray-600 hover:bg-red-500 hover:text-white'
            }
          `}
        >
          <Heart size={16} className={isLiked ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-gray-500">
            {product.rating} ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg font-bold text-red-600">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Seller info */}
        <div className="text-xs text-gray-500 mb-3">
          <span>{product.seller}</span>
          <span className="mx-1">•</span>
          <span>{product.location}</span>
        </div>

        {/* Add to cart button */}
        <button className={`
          w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-md
          transition-all duration-200 font-medium text-sm
          ${isHovered
            ? 'bg-orange-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-orange-600 hover:text-white'
          }
        `}>
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};