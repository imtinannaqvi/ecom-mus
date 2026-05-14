import { createContext, useState, useContext, useEffect, useCallback } from "react";
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

  const fetchCart = useCallback(async () => {
    if (!user) {
      console.log("Context: No user found, skipping fetchCart");
      setCartItems([]);
      return;
    }

    setCartLoading(true);
    try {
      const res = await getCartApi();

      if (res && res.success) {
        setCartItems(res.cart || []); 
      }
    } catch (err) {
      console.error("Context: Fetch Cart Error ->", err);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  // 2. Add to Cart Logic
  const addToCart = async (productData) => {
    try {
      const res = await addToCartApi(productData);

      if (res && res.success) {
        setCartItems(res.cart);
        return { success: true };
      }
      return { success: false, message: "Server replied with success: false" };
    } catch (err) {
      console.error("Context: AddToCart Error ->", err);
      return { success: false, message: err?.message || "Something went wrong" };
    }
  };

  // 3. Remove Item Logic
  const removeFromCart = async (id) => {
    try {
      const res = await removeItemApi(id);

      if (res && res.success) {
        setCartItems(res.cart);
      }
    } catch (err) {
      console.error("Context: Remove Error ->", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{ cartItems, cartLoading, addToCart, removeFromCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};