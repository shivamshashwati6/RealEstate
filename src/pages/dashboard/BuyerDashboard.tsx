import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyerDashboardPage } from '../BuyerDashboardPage';
import { usePropertyStore } from '../../store/usePropertyStore';

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { setSelectedProperty } = usePropertyStore();

  return (
    <BuyerDashboardPage
      onSelectProperty={(prop) => {
        setSelectedProperty(prop);
        navigate(`/properties/${prop.id}`);
      }}
    />
  );
}
