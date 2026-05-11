import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBanner from "../components/HeroBanner";
import Product from "./Product";
import CoustomerReviews from "./CoustomerReviews";
import { useParams } from "react-router-dom";

function Home() {
  const {mainCategory} = useParams()
  console.log(mainCategory)

  return (
    <div>
      <Header  category={mainCategory} />
      <HeroBanner category={mainCategory} />
      <Product category={mainCategory}   />
      <CoustomerReviews/>
      <Footer />
    </div>
  );
}

export default Home;
