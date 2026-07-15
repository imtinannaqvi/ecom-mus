import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBanner from "../components/HeroBanner";
import Product from "./Product";
import CoustomerReviews from "./CoustomerReviews";
import { AppContext } from "../context/AppContextProvider";
import useProduct from "../hooks/productService";
import TopCategories from "../components/TopCategories";

function Home() {
  const { mainCategory } = useParams();
  const { fetchMainCategory, fetchProducts, loading, setLoading, products } =
    useProduct();

  const [subCategories, setSubCategories] = useState([]);

  const loadPageData = async () => {
    setLoading(true);
    try {
     
      const [catRes, productData] = await Promise.all([
        fetchMainCategory(),
        fetchProducts({ mainCategory }),
      ]);

      const foundCategory = catRes.data.find(
        (cat) => cat.name.toLowerCase() === mainCategory.toLowerCase(),
      );

      if (foundCategory) {
        setSubCategories(foundCategory.subCategories);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, [mainCategory]);

  return (
    <div>
      <Header category={subCategories} />

      <HeroBanner mainCategory={mainCategory} subCategories={subCategories} />
      <TopCategories
        mainCategory={mainCategory}
        subCategories={subCategories}
      />

      {loading ? (
        <div className="w-full py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
        </div>
      ) : (
        <Product
          category={mainCategory}
          products={products} 
        />
      )}

      <CoustomerReviews />
      <Footer />
    </div>
  );
}

export default Home;