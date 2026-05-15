import { createContext, useState, useEffect, useCallback } from "react";
import API from "../api/api";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 1. Initial State ko localStorage se uthao (Refresh fix)
  const [address, setAddress] = useState([]); 
  const [selectedAddress, setSelectedAddress] = useState(() => {
    const saved = localStorage.getItem("selectedAddress");
    return saved ? JSON.parse(saved) : null;
  });
  const [paymentMethod, setPaymentMethod] = useState(() => {
    return localStorage.getItem("paymentMethod") || 'COD';
  });

  // 2. Jab bhi selectedAddress change ho, localStorage update karo
  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
    }
  }, [selectedAddress]);

  // 3. Jab bhi paymentMethod change ho, localStorage update karo
  useEffect(() => {
    localStorage.setItem("paymentMethod", paymentMethod);
  }, [paymentMethod]);

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
    products, setProducts,
    loading, setLoading,
    user, setUser, loadUser,
    address, setAddress,
    selectedAddress, setSelectedAddress,
    paymentMethod, setPaymentMethod
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;