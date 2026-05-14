import { useContext } from "react";
import API from "../api/api";
import { AppContext } from "../context/AppContextProvider";

const useProduct = () => {
  const { products, setProducts, loading, setLoading } = useContext(AppContext);

  const fetchMainCategory = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/all");
      const data = res.data;
      return data;
    } catch (error) {}
  };

 const fetchProducts = async ({ mainCategory }) => {
  try {
    const response = await API.get(`/product/get-products/${mainCategory}`);
    
    if (response.data.success) {
      console.log("Products found:", response.data.data);
      setProducts(response.data.data)
    }
  } catch (error) {
    console.error("API Error:", error.response?.data?.message || error.message);
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
