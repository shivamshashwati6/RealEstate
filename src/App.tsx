import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { RoleSwitcherBar } from './components/layout/RoleSwitcherBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterBuyerPage } from './pages/auth/RegisterBuyerPage';
import { RegisterSellerPage } from './pages/auth/RegisterSellerPage';
import { RegisterAdminPage } from './pages/auth/RegisterAdminPage';

// Dashboards
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
    return <Navigate to="/search" replace />;
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
    navigate('/search');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Quick Sandbox Role Switcher */}
      <RoleSwitcherBar />

      {/* 2. Header Navbar */}
      <Navbar />

      {/* 3. Main Route Outlet Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <HomePage
                onSelectProperty={handleSelectProperty}
                onNavigateToSearch={handleNavigateToSearch}
              />
            }
          />

          <Route
            path="/search"
            element={
              <SearchPage
                onSelectProperty={handleSelectProperty}
              />
            }
          />

          <Route path="/property/:id" element={<PropertyDetailWrapper />} />

          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register/buyer" element={<RegisterBuyerPage />} />
          <Route path="/auth/register/seller" element={<RegisterSellerPage />} />
          <Route path="/auth/register/admin" element={<RegisterAdminPage />} />

          {/* Role Protected Dashboard Routes */}
          <Route
            path="/dashboard/buyer/*"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerDashboardPage onSelectProperty={handleSelectProperty} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/seller/*"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerDashboardPage onSelectProperty={handleSelectProperty} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage onSelectProperty={handleSelectProperty} />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 4. Global Footer */}
      <Footer />

      {/* 5. Drawers & Modals */}
      <ChatDrawer />
      <PropertyCompareModal />
      <PropertyFormModal />

      {/* 6. Notification Host */}
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
