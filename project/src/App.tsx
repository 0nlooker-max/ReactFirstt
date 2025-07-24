import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProfilePage } from './pages/ProfilePage';
import { CartProvider } from './contexts/CartContext';
import { useProducts } from './hooks/useProducts';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const {
    searchQuery,
    setSearchQuery
  } = useProducts();

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;