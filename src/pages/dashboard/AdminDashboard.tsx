import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboardPage } from '../AdminDashboardPage';
import { usePropertyStore } from '../../store/usePropertyStore';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { setSelectedProperty } = usePropertyStore();

  return (
    <AdminDashboardPage
      onSelectProperty={(prop) => {
        setSelectedProperty(prop);
        navigate(`/properties/${prop.id}`);
      }}
    />
  );
}
