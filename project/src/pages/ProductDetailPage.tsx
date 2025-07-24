import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react';
import { products } from '../data/products';
import { AddToCartModal } from '../components/AddToCartModal';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const product = products.find(p => p.id === parseInt(id || '0'));

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={16} className="fill-yellow-400 text-yellow-400 opacity-50" />
      );
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} className="text-gray-300" />
      );
    }

    return stars;
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Mock additional images for demonstration
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImage === index ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
              
              <div className="text-sm text-gray-500">
                <span>Sold by: </span>
                <span className="font-medium text-orange-600">{product.seller}</span>
              </div>
            </div>

            {product.badge && (
              <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {product.badge}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-3xl font-bold text-red-600">
                ${product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    -{discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600">Free shipping on orders over $50</p>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
              
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  isLiked 
                    ? 'border-red-500 bg-red-50 text-red-500' 
                    : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart size={20} className={isLiked ? 'fill-current' : ''} />
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Truck className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">Free Shipping</p>
                <p className="text-sm text-gray-600">On orders over $50</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="text-green-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">Secure Payment</p>
                <p className="text-sm text-gray-600">100% protected</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <RotateCcw className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">Easy Returns</p>
                <p className="text-sm text-gray-600">30-day policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Product Description</h3>
        <div className="prose max-w-none text-gray-600">
          <p className="mb-4">
            Experience premium quality with this carefully crafted product. Designed with attention to detail 
            and built to last, this item combines functionality with style to meet your everyday needs.
          </p>
          <p className="mb-4">
            Key features include durable construction, modern design, and exceptional value. Whether you're 
            looking for personal use or as a gift, this product delivers on both quality and performance.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>High-quality materials and construction</li>
            <li>Modern, sleek design that fits any style</li>
            <li>Easy to use and maintain</li>
            <li>Backed by manufacturer warranty</li>
            <li>Fast and reliable shipping</li>
          </ul>
        </div>
      </div>

      <AddToCartModal
        product={product}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};