import { useContext } from "react";
import API from "../api/api";
import { AppContext } from "../context/AppContextProvider";

const useProduct = () => {
  const { products, setProducts, loading, setLoading } = useContext(AppContext);

  // Sabse main function jo category wise data layega
  const fetchProducts = async ({mainCategory}) => {
    if (!mainCategory) return;

    setLoading(true);
    try {
      const response = await API.get(`/product/get-products/${mainCategory}`);
      
      if (response.data.success) {
        console.log(`Products fetched for: ${mainCategory}`, response.data.data);
        
        // State update karein
        setProducts(response.data.data);
        
        // LocalStorage mein save karein taake reload par kaam aye
        localStorage.setItem("lastCategory", mainCategory);
      }
    } catch (error) {
      console.error("API Error (fetchProducts):", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Optional: Sirf categories list lane ke liye (Home page grid ke liye)
  const fetchMainCategory = async () => {
    try {
      const res = await API.get("/admin/all");
      return res.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return {
    fetchMainCategory,
    fetchProducts,
    loading,
    setLoading,
    products
  };
};

export default useProduct;