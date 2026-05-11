import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContextProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductDetails from "../components/ProductDetails";
import ProductTabs from "../components/ProductTabs";
import SizeChartOverlay from "../components/SizeChartOverlay";
import { NewArrivals } from "./Product";
import CoustomerReviews from "./CoustomerReviews";

function SingleProduct() {
  const { id } = useParams();
  const { products, cartItem, setCartItem } = useContext(AppContext);
  const product = products.find((p) => p.id === parseInt(id));

    const filteredProducts = products.filter((item)=> item.category === product.category )


  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [hoveredSize, setHoveredSize] = useState(null);

  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    window.scrollTo(0, 0); // Page change par top par scroll kare
  }, [product]);

  if (!product)
    return (
      <div className="h-screen flex items-center justify-center font-bold">
        Loading...
      </div>
    );

  // Sizing Logic
  const hasSizing =
    product.sizes &&
    product.sizes.length > 0 &&
    product.sizes[0] !== "Free" &&
    product.sizes[0] !== "Standard";

  const mainImage = Array.isArray(product.images)
    ? product.images[0]
    : product.images;
  const thumbnails = Array.isArray(product.images)
    ? product.images
    : [product.images, "/images/caps.jpg", "/images/banner.png"];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <div
          className={`transition-all duration-300 ${sizeGuideOpen ? "blur-md pointer-events-none" : ""}`}
        >
          <section className="max-w-[1440px] mx-auto px-4 md:px-10 py-12 h-fit">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start h-fit">
              {/* Left Column (Images) */}
              <div className="lg:col-span-7 h-fit">
                <ProductImageGallery
                  thumbnails={thumbnails}
                  mainImage={mainImage}
                />
              </div>

              {/* Right Column (Details) - Ye div sticky hoga */}
              <div className="lg:col-span-5 sticky top-28 h-fit">
                <ProductDetails
                  product={product}
                  hasSizing={hasSizing}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  // other props...
                />
              </div>
            </div>
          </section>

          {/* TABS & REVIEWS */}
          <section className="max-w-[1440px] mx-auto px-4 md:px-10 py-10">
            <ProductTabs
              activeTab={activeTab}
              product={product}
              setActiveTab={setActiveTab}
            />
          </section>

          <section className="bg-[#fcfcfc] py-16">
            <div className="max-w-[1440px]  mx-auto space-y-20">
              <NewArrivals products={filteredProducts} />
              <div className="px-4 md:px-10">
                <CoustomerReviews />
              </div>
            </div>
          </section>
        </div>

        {sizeGuideOpen && (
          <SizeChartOverlay
            setSizeGuideOpen={setSizeGuideOpen}
            product={product}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default SingleProduct;
