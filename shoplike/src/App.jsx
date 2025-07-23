import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/SideBar';
import { ProductGrid } from './components/ProductGrid';
import { FilterBar } from './components/Filterbar';
import { useProducts } from './hooks/useProduct';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy
  } = useProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

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

            <ProductGrid products={products} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;