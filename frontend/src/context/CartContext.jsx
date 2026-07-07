import { createContext, useState, useContext, useEffect, useCallback } from "react";
import {
  getCartApi,
  addToCartApi,
  removeItemApi,
} from "../services/cartServices";
import { AppContext } from "./AppContextProvider";

export const CartContext = createContext();

const GUEST_CART_KEY = "guestCart";

// --- Guest cart helpers (localStorage) ---
const readGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeGuestCart = (cart) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useContext(AppContext);

  // ---------------- FETCH CART ----------------
  const fetchCart = useCallback(async () => {
    if (!user) {
      // Guest: load from localStorage instead of calling the API
      setCartItems(readGuestCart());
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

  // ---------------- ADD TO CART ----------------
  const addToCart = async (productData) => {
    // productData expected shape: { productId, quantity, size, color, product }
    // "product" (the full product object) is required for guest mode so we can
    // display name/price/image without a backend populate.
    if (!user) {
      try {
        const guestCart = readGuestCart();

        const existingIndex = guestCart.findIndex(
          (item) =>
            item.productId?._id === productData.productId &&
            item.size === productData.size &&
            item.color === productData.color
        );

        if (existingIndex > -1) {
          guestCart[existingIndex].quantity += productData.quantity;
        } else {
          guestCart.push({
            _id: `guest-${Date.now()}`,
            productId: productData.product || { _id: productData.productId },
            quantity: productData.quantity,
            size: productData.size,
            color: productData.color,
          });
        }

        writeGuestCart(guestCart);
        setCartItems(guestCart);
        return { success: true };
      } catch (err) {
        console.error("Context: Guest AddToCart Error ->", err);
        return { success: false, message: "Something went wrong" };
      }
    }

    // Logged-in: use the real API
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

  // ---------------- REMOVE FROM CART ----------------
  const removeFromCart = async (id) => {
    if (!user) {
      const guestCart = readGuestCart().filter((item) => item._id !== id);
      writeGuestCart(guestCart);
      setCartItems(guestCart);
      return;
    }

    try {
      const res = await removeItemApi(id);
      if (res && res.success) {
        setCartItems(res.cart);
      }
    } catch (err) {
      console.error("Context: Remove Error ->", err);
    }
  };

  // ---------------- MERGE GUEST CART ON LOGIN ----------------
  // When a guest logs in, push their local cart items into the real account
  // cart, then clear localStorage so it isn't re-added next time.
  const mergeGuestCartIntoAccount = useCallback(async () => {
    const guestCart = readGuestCart();
    if (!guestCart.length) return;

    for (const item of guestCart) {
      try {
        await addToCartApi({
          productId: item.productId?._id || item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        });
      } catch (err) {
        console.error("Context: Merge Guest Cart Error ->", err);
      }
    }

    localStorage.removeItem(GUEST_CART_KEY);
  }, []);

  useEffect(() => {
    const run = async () => {
      if (user) {
        await mergeGuestCartIntoAccount();
      }
      await fetchCart();
    };
    run();
  }, [user, fetchCart, mergeGuestCartIntoAccount]);

  return (
    <CartContext.Provider
      value={{ cartItems, cartLoading, addToCart, removeFromCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};