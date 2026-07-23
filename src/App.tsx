import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';

// Layout Components
import { RoleSwitcherBar } from './components/layout/RoleSwitcherBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// Auth Guard & Store
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';
import { usePropertyStore } from './store/usePropertyStore';

// Pages
import Gateway from './pages/Gateway';
import BuyerLogin from './pages/auth/buyer/BuyerLogin';
import BuyerRegister from './pages/auth/buyer/BuyerRegister';
import SellerLogin from './pages/auth/seller/SellerLogin';
import SellerRegister from './pages/auth/seller/SellerRegister';
import AdminLogin from './pages/auth/admin/AdminLogin';
import AdminRegister from './pages/auth/admin/AdminRegister';

import BuyerDashboard from './pages/dashboard/BuyerDashboard';
import SellerDashboard from './pages/dashboard/SellerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

import { SearchPage } from './pages/SearchPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';

// Modals & Drawers
import { ChatDrawer } from './components/chat/ChatDrawer';
import { PropertyCompareModal } from './components/property/PropertyCompareModal';
import { PropertyFormModal } from './components/seller/PropertyFormModal';

function PropertyDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, selectedProperty, setSelectedProperty } = usePropertyStore();

  const property = selectedProperty || properties.find((p) => p.id === id) || properties[0];

  return (
    <PropertyDetailPage
      property={property}
      onBack={() => navigate('/properties')}
    />
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <RoleSwitcherBar />
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <Footer />
      <ChatDrawer />
      <PropertyCompareModal />
      <PropertyFormModal />
      <ToastContainer />
    </div>
  );
}

export function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Gateway Page mounted at / */}
        <Route path="/" element={<Gateway />} />

        {/* Dedicated Separate Login & Register Pages */}
        <Route path="/auth/buyer/login" element={<BuyerLogin />} />
        <Route path="/auth/buyer/register" element={<BuyerRegister />} />

        <Route path="/auth/seller/login" element={<SellerLogin />} />
        <Route path="/auth/seller/register" element={<SellerRegister />} />

        <Route path="/auth/admin/login" element={<AdminLogin />} />
        <Route path="/auth/admin/register" element={<AdminRegister />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard/buyer"
          element={
            <ProtectedRoute allowedRoles={['buyer', 'admin']}>
              <MainLayout>
                <BuyerDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/seller"
          element={
            <ProtectedRoute allowedRoles={['seller', 'admin']}>
              <MainLayout>
                <SellerDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Property Search & Details Routes */}
        <Route
          path="/properties"
          element={
            <MainLayout>
              <SearchPage
                onSelectProperty={(prop) => {
                  usePropertyStore.getState().setSelectedProperty(prop);
                }}
              />
            </MainLayout>
          }
        />

        <Route
          path="/properties/:id"
          element={
            <MainLayout>
              <PropertyDetailRoute />
            </MainLayout>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
