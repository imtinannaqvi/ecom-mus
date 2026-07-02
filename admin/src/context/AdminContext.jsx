import React, { createContext, useState, useContext } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null); // Admin ki details
  const [allProducts, setAllProducts] = useState([]); // Products list
  const [allOrders, setAllOrders] = useState([]); // Orders list
  const [loading, setLoading] = useState(false); // Loading state for buttons
  // Survives refresh: a token in localStorage means an active admin session.
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("adminToken")
  );

  const login = (token, adminData) => {
    localStorage.setItem("adminToken", token);
    setAdmin(adminData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem("adminToken");
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        setAdmin,
        allProducts,
        setAllProducts,
        allOrders,
        setAllOrders,
        loading,
        setLoading,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// Custom Hook (Istemal asaan karne ke liye)
export const useAdmin = () => useContext(AdminContext);
