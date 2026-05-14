import { createContext, useState, useEffect, useCallback } from "react";
import API from "../api/api";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. User authentication load
  const loadUser = async () => {
    try {
      const res = await API.get("/auth/me");
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      setUser(null);
    }
  };

  // 2. Persistent Product Load (Reload Fix)
  const hydrateProducts = useCallback(async () => {
    const lastCategory = localStorage.getItem("lastCategory");
    if (lastCategory) {
      try {
        const res = await API.get(`/product/get-products/${lastCategory}`);
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error("Hydration Error:", error.message);
      }
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadUser();
      await hydrateProducts();
      setLoading(false);
    };
    init();
  }, [hydrateProducts]);

  const value = {
    products,
    setProducts,
    loading,
    setLoading,
    user,
    setUser,
    loadUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;