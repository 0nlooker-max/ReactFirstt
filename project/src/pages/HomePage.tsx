import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ProductGrid } from '../components/ProductGrid';
import { FilterBar } from '../components/FilterBar';
import { AddToCartModal } from '../components/AddToCartModal';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../data/products';

export const HomePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy
  } = useProducts();

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  return (
    <div className="flex">
      <Sidebar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 lg:ml-64 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <FilterBar
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalProducts={products.length}
          />

          <ProductGrid products={products} onAddToCart={handleAddToCart} />
        </div>
      </main>

      <AddToCartModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};