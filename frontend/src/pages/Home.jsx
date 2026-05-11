import React, { useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBanner from "../components/HeroBanner";
import Product from "./Product";
import CoustomerReviews from "./CoustomerReviews";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContextProvider";

function Home() {
  const { products } = useContext(AppContext);
  const { mainCategory } = useParams();

  const filteredProduct = products.filter((item) => {
    return item.category.toLowerCase() === mainCategory.toLocaleLowerCase();
  });


  return (
    <div>
      <Header category={mainCategory} />
      <HeroBanner category={mainCategory} />
      <Product category={mainCategory} products={filteredProduct} />
      <CoustomerReviews />
      <Footer />
    </div>
  );
}

export default Home;
