import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBanner from "../components/HeroBanner";
import Product from "./Product";
import CoustomerReviews from "./CoustomerReviews";

function Home() {
  return (
    <div>
      <Header />
      <HeroBanner />
      <Product/>
      <CoustomerReviews/>
      <Footer />
    </div>
  );
}

export default Home;
