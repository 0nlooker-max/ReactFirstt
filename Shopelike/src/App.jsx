import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDeatailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReceiptPage } from './pages/ReceiptPage';
import { ReceivePage } from './pages/ReceivePage';
import { CartProvider } from './contexts/CartContext';
import { useProducts } from './hooks/useProduct';
import { ProductList } from './components/ProductList';

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
            onMenuToggle={() => setIsSidebarOpen(true)}
          />

          <Routes>
            <Route path="/" element={<HomePage isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/receipt" element={<ReceiptPage />} />
            <Route path="/receive" element={<ReceivePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/addproduct" element={<ProductList />} />
           
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;