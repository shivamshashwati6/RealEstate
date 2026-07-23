import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { RoleSwitcherBar } from './components/layout/RoleSwitcherBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Gateway & Public Pages
import { Gateway } from './pages/Gateway';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';

// Dedicated Isolated Auth Pages
import { BuyerLoginPage } from './pages/auth/BuyerLoginPage';
import { BuyerRegisterPage } from './pages/auth/BuyerRegisterPage';
import { SellerLoginPage } from './pages/auth/SellerLoginPage';
import { SellerRegisterPage } from './pages/auth/SellerRegisterPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';

// Role Dashboards
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Drawers & Modals
import { ChatDrawer } from './components/chat/ChatDrawer';
import { PropertyCompareModal } from './components/property/PropertyCompareModal';
import { PropertyFormModal } from './components/seller/PropertyFormModal';

// Stores
import { usePropertyStore } from './store/usePropertyStore';

function PropertyDetailWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties } = usePropertyStore();

  const property = properties.find((p) => p.id === id);

  if (!property) {
    return <Navigate to="/marketplace" replace />;
  }

  return (
    <PropertyDetailPage
      property={property}
      onBack={() => navigate(-1)}
    />
  );
}

function MainLayout() {
  const navigate = useNavigate();
  const { setSelectedProperty } = usePropertyStore();

  const handleSelectProperty = (property: any) => {
    setSelectedProperty(property);
    navigate(`/property/${property.id}`);
  };

  const handleNavigateToSearch = (query?: string, city?: string, type?: string) => {
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Quick Sandbox Role Switcher */}
      <RoleSwitcherBar />

      {/* 2. Header Navbar */}
      <Navbar />

      {/* 3. Main Route Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          {/* Starting Portal Gateway Landing Page */}
          <Route path="/" element={<Gateway />} />

          {/* Marketplace Catalog & Detailed Search */}
          <Route
            path="/marketplace"
            element={<SearchPage onSelectProperty={handleSelectProperty} />}
          />
          <Route
            path="/search"
            element={<SearchPage onSelectProperty={handleSelectProperty} />}
          />
          <Route
            path="/home"
            element={
              <HomePage
                onSelectProperty={handleSelectProperty}
                onNavigateToSearch={handleNavigateToSearch}
              />
            }
          />
          <Route path="/property/:id" element={<PropertyDetailWrapper />} />

          {/* Isolated Buyer Authentication Suite */}
          <Route path="/auth/buyer/login" element={<BuyerLoginPage />} />
          <Route path="/auth/buyer/register" element={<BuyerRegisterPage />} />

          {/* Isolated Seller / Agent Authentication Suite */}
          <Route path="/auth/seller/login" element={<SellerLoginPage />} />
          <Route path="/auth/seller/register" element={<SellerRegisterPage />} />

          {/* Isolated Admin Authentication Suite */}
          <Route path="/auth/admin/login" element={<AdminLoginPage />} />

          {/* Legacy & Short URL Auth Aliases */}
          <Route path="/auth/login" element={<Navigate to="/" replace />} />
          <Route path="/auth/register/buyer" element={<BuyerRegisterPage />} />
          <Route path="/auth/register/seller" element={<SellerRegisterPage />} />
          <Route path="/auth/register/admin" element={<AdminLoginPage />} />

          {/* Role-Guarded Dashboards */}
          <Route
            path="/dashboard/buyer/*"
            element={
              <ProtectedRoute requiredRole="buyer">
                <BuyerDashboardPage onSelectProperty={handleSelectProperty} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/seller/*"
            element={
              <ProtectedRoute requiredRole="seller">
                <SellerDashboardPage onSelectProperty={handleSelectProperty} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboardPage onSelectProperty={handleSelectProperty} />
              </ProtectedRoute>
            }
          />

          {/* Fallback Redirect to Gateway */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 4. Global Footer */}
      <Footer />

      {/* 5. Drawers & Modals */}
      <ChatDrawer />
      <PropertyCompareModal />
      <PropertyFormModal />

      {/* 6. Toast Notification Host */}
      <ToastContainer />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;
