import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SellerDashboardPage } from '../SellerDashboardPage';
import { usePropertyStore } from '../../store/usePropertyStore';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { setSelectedProperty } = usePropertyStore();

  return (
    <SellerDashboardPage
      onSelectProperty={(prop) => {
        setSelectedProperty(prop);
        navigate(`/properties/${prop.id}`);
      }}
    />
  );
}
