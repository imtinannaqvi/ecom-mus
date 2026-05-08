import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductDetails from "../components/ProductDetails";
import ProductTabs from "../components/ProductTabs";
import SizeChartOverlay from "../components/SizeChartOverlay";
import { NewArrivals } from "./Product";
import CoustomerReviews from "./CoustomerReviews";

function SingleProduct() {
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [hoveredSize, setHoveredSize] = useState(null);

  const productName = "Marvel Merchandise Official";
  const productDescription = "Men's White Iron Man Of War Graphic Printed T-shirt";
  
  const typeSource = `${productName} ${productDescription}`.toLowerCase();
  const productType = typeSource.includes("jean") ? "jeans" : typeSource.includes("sweater") ? "sweater" : "tshirt";

  // FIX: This object was missing in prop passing
  const sizeGuideImages = {
    tshirt: "/images/tshirt-size-guide.png",
    jeans: "/images/jeans-size-guide.png",
    sweater: "/images/sweater-size-guide.png",
  };

  const sizeGuideData = {
    tshirt: {
      title: "T-Shirt Size Guide",
      note: "Measure chest, length, and sleeve from a flat garment.",
      headers: ["Size", "Chest", "Length", "Sleeve"],
      sizes: [
        { size: "S", chest: "38", length: "26", sleeve: "8" },
        { size: "M", chest: "40", length: "27", sleeve: "8.5" },
        { size: "L", chest: "42", length: "28", sleeve: "9" },
        { size: "XL", chest: "44", length: "29", sleeve: "9.5" },
        { size: "XXL", chest: "46", length: "30", sleeve: "10" },
      ],
    },
    jeans: { title: "Jeans Size Guide", note: "Measure waist...", headers: ["Size", "Waist", "Hip", "Outseam", "Inseam"], sizes: [{ size: "S", waist: "30", hip: "38", outseam: "40", inseam: "30" }] },
    sweater: { title: "Sweater Size Guide", note: "Measure chest...", headers: ["Size", "Chest", "Length", "Shoulder"], sizes: [{ size: "S", chest: "40", length: "26", shoulder: "18" }] },
  };

  const sizeGuide = sizeGuideData[productType];
  const sizeDetailsBySize = sizeGuide.sizes.reduce((acc, row) => {
    acc[row.size] = row;
    return acc;
  }, {});

  const guideLabel = productType === "jeans" ? ["Waist", "Hip", "Outseam", "Inseam"] : productType === "sweater" ? ["Chest", "Length", "Shoulder"] : ["Chest", "Length", "Sleeve"];

  const thumbnails = ["/images/spImg/2.jpg", "/images/spImg/3.jpg", "/images/spImg/4.jpg", "/images/spImg/5.jpg"];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <div className={`transition-all duration-300 ${sizeGuideOpen ? "blur-md pointer-events-none" : ""}`}>
          <section className="max-w-[1440px] mx-auto px-4 md:px-10 py-6 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-16">
              <div className="lg:col-span-6 xl:col-span-7">
                <ProductImageGallery thumbnails={thumbnails} mainImage="/images/spImg/1.jpg" />
              </div>
              <div className="lg:col-span-6 xl:col-span-5">
                <ProductDetails
                  productName={productName}
                  productDescription={productDescription}
                  selectedSize={selectedSize}
                  setSelectedSize={setSelectedSize}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  setSizeGuideOpen={setSizeGuideOpen}
                  hoveredSize={hoveredSize}
                  setHoveredSize={setHoveredSize}
                  productType={productType}
                  sizeGuide={sizeGuide}
                  sizeGuideImages={sizeGuideImages} // Passed correctly now
                  sizeDetailsBySize={sizeDetailsBySize}
                  guideLabel={guideLabel}
                />
              </div>
            </div>
          </section>

          <section className="max-w-[1440px] mx-auto px-4 md:px-10 py-10">
            <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </section>

          <section className="bg-[#fcfcfc] py-16">
            <div className="max-w-[1440px] mx-auto space-y-20">
              <NewArrivals />
              <div className="px-4 md:px-10"><CoustomerReviews /></div>
            </div>
          </section>
        </div>

        {sizeGuideOpen && (
          <SizeChartOverlay sizeGuide={sizeGuide} productType={productType} guideLabel={guideLabel} setSizeGuideOpen={setSizeGuideOpen} />
        )}
      </main>
      <Footer />
    </div>
  );
}
export default SingleProduct;