import { useState } from 'react';
import { Sidebar } from '../components/SideBar';
import { ProductGrid } from '../components/ProductGrid';
import { FilterBar } from '../components/FilterBar'; 
import { AddToCartModal } from '../components/AddToCartModal';
import { useProducts } from '../hooks/useProduct';
import "../assets/global.css";

export const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy
  } = useProducts();

  const handleAddToCart = (product) => {
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
          {/* Hamburger button for mobile */}
          <button
            className="lg:hidden mb-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Open sidebar"
            onClick={() => setIsSidebarOpen(true)}
          >
            {/* Simple hamburger icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

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