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

 const submitProductReview = async (formData) => {
  try {
    const res = await API.put('/product/rating', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // File upload ke liye zaroori hai
      },
    });
    
    return res.data;
  } catch (err) {
    // Backend se aane wala error message pakadne ke liye
    const errorMsg = err.response?.data?.message || err.message;
    console.error("Rating Service Error:", errorMsg);
    throw new Error(errorMsg); 
  }
};


  return {
    fetchMainCategory,
    fetchProducts,
    loading,
    submitProductReview,
    setLoading,
    products
  };
};

export default useProduct;