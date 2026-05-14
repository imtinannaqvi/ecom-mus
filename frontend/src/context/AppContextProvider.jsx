import { createContext, useState, useEffect } from "react";
import API from "../api/api";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sirf User authentication ka logic yahan rahega
  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await API.get("/auth/me");
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.log("Auth Error:", error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    products,
    setProducts,
    loading,
    setLoading,
    user,
    setUser,
    loadUser, // Isse login/logout ke waqt call kar sakte hain
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
