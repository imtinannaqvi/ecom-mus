import { createContext, useState, useContext, useEffect } from "react";
import {
  getCartApi,
  addToCartApi,
  removeItemApi,
} from "../services/cartServices";
import { AppContext } from "./AppContextProvider";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useContext(AppContext);

  // 1. Fetch Cart
  const fetchCart = async () => {
    // Agar user nahi hai ya login process loading mein hai, toh wait karein
    if (!user) {
      setCartItems([]); 
      return;
    }
    
    setCartLoading(true);
    try {
      const res = await getCartApi(); 
      // FIX: 'res.data.success' ki jagah sirf 'res.success'
      if (res.success) {
        setCartItems(res.cart);
      }
    } catch (err) {
      console.error("Fetch Cart Error:", err.message);
    } finally {
      setCartLoading(false);
    }
  };

  // 2. Add to Cart Logic
  const addToCart = async (productData) => {
    try {
      const res = await addToCartApi(productData);
      // FIX: 'res.success' check karein
      if (res.success) {
        setCartItems(res.cart); 
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.message || "Something went wrong" };
    }
  };

  // 3. Remove Item Logic
  const removeFromCart = async (id) => {
    try {
      const res = await removeItemApi(id);
      // FIX: 'res.success' check karein
      if (res.success) {
        setCartItems(res.cart);
      }
    } catch (err) {
      console.error("Remove Error:", err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]); // Jab user login ho jaye, cart fetch ho

  return (
    <CartContext.Provider
      value={{ cartItems, cartLoading, addToCart, removeFromCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};