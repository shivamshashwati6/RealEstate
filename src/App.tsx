import React, { useState } from 'react';
import { RoleSwitcherBar } from './components/layout/RoleSwitcherBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthPage } from './pages/AuthPage';

// Modals & Drawers
import { ChatDrawer } from './components/chat/ChatDrawer';
import { PropertyCompareModal } from './components/property/PropertyCompareModal';
import { PropertyFormModal } from './components/seller/PropertyFormModal';

// Stores & Types
import { useAuthStore } from './store/useAuthStore';
import { usePropertyStore } from './store/usePropertyStore';
import type { Property } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchParams, setSearchParams] = useState<{ query?: string; city?: string; type?: string }>({});

  const { isAuthModalOpen, closeAuthModal } = useAuthStore();
  const { selectedProperty, setSelectedProperty } = usePropertyStore();

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleNavigateToSearch = (city?: string, type?: string) => {
    setSearchParams({ city, type });
    setActiveTab('search');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Quick Demo Role Switcher Bar */}
      <RoleSwitcherBar />

      {/* 2. Main Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={(tab) => {
        setSelectedProperty(null);
        setActiveTab(tab);
      }} />

      {/* 3. Page Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedProperty ? (
          <PropertyDetailPage
            property={selectedProperty}
            onBack={() => setSelectedProperty(null)}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomePage
                onSelectProperty={handleSelectProperty}
                onNavigateToSearch={(query) => {
                  setSearchParams({ query });
                  setActiveTab('search');
                }}
              />
            )}

            {activeTab === 'search' && (
              <SearchPage
                onSelectProperty={handleSelectProperty}
                initialSearchQuery={searchParams.query}
                initialCity={searchParams.city}
                initialType={searchParams.type}
              />
            )}

            {activeTab === 'buyer-dashboard' && (
              <BuyerDashboardPage onSelectProperty={handleSelectProperty} />
            )}

            {activeTab === 'seller-dashboard' && (
              <SellerDashboardPage onSelectProperty={handleSelectProperty} />
            )}

            {activeTab === 'admin-dashboard' && (
              <AdminDashboardPage onSelectProperty={handleSelectProperty} />
            )}
          </>
        )}
      </main>

      {/* 4. Global Footer */}
      <Footer />

      {/* 5. Drawers & Modals */}
      <ChatDrawer />
      <PropertyCompareModal />
      <PropertyFormModal />
      <AuthPage isOpen={isAuthModalOpen} onClose={closeAuthModal} />

      {/* 6. Notifications Toast Host */}
      <ToastContainer />
    </div>
  );
}

export default App;
