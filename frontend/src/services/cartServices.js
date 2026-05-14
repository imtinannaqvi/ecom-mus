import API from "../api/api";

// 1. Add to Cart
export const addToCartApi = async (data) => {
  try {
    const response = await API.post("/cart/add-to-cart", data);
    return response.data; 
  } catch (error) {
    console.error("API Error (addToCart):", error.response?.data || error.message);
    throw error.response?.data || error; 
  }
};

// 2. Get Cart
export const getCartApi = async () => {
  try {
    const response = await API.get("/cart/get-cart");
    return response.data;
  } catch (error) {
    console.error("API Error (getCart):", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// 3. Remove Item from Cart
export const removeItemApi = async (id) => {
  try {
    const response = await API.delete(`/cart/delete-cart-item/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error (removeItem):", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};