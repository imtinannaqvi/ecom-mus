import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const ProtectedRoute = () => {
  const { admin, loading } = useAdmin();

  // Jab tak API check kar rahi hai (loading), tab tak khali screen ya spinner dikhao
  if (loading) return null; 

  return admin ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;