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
import API from '../api/api'
import { getCartApi } from '../services/cartServices'
import { CartContext } from "../context/CartContext";
import { BACKEND_URL } from "../api/api";

/*
  Size chart data. SizeChartOverlay expects `sizeGuide`, `productType` and
  `guideLabel` — none of which were being passed before, which is why the
  overlay crashed on `sizeGuide.title` and nothing appeared on screen.

  Swap these measurements for your real ones whenever you have them.
*/
const SIZE_GUIDES = {
  jeans: {
    title: "Jeans Size Guide",
    note: "Measure around your natural waist, keeping the tape comfortably loose. For the inseam, measure from the crotch seam down to the ankle.",
    headers: ["Size", "Waist (in)", "Hip (in)", "Inseam (in)"],
    sizes: [
      { size: "S",   waist: "28-30", hip: "34-36", inseam: "30" },
      { size: "M",   waist: "31-33", hip: "37-39", inseam: "31" },
      { size: "L",   waist: "34-36", hip: "40-42", inseam: "32" },
      { size: "XL",  waist: "37-39", hip: "43-45", inseam: "32" },
      { size: "XXL", waist: "40-42", hip: "46-48", inseam: "33" },
    ],
  },
  top: {
    title: "Top Wear Size Guide",
    note: "Measure across the chest, one inch below the armholes, with your arms relaxed. Length is taken from the highest shoulder point down to the hem.",
    headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
    sizes: [
      { size: "S",   chest: "36-38", length: "27", shoulder: "17" },
      { size: "M",   chest: "39-41", length: "28", shoulder: "18" },
      { size: "L",   chest: "42-44", length: "29", shoulder: "19" },
      { size: "XL",  chest: "45-47", length: "30", shoulder: "20" },
      { size: "XXL", chest: "48-50", length: "31", shoulder: "21" },
    ],
  },
};

// Decide which chart to show from the product's subCategory.
const resolveProductType = (product) => {
  const sub = (product?.subCategory || "").toLowerCase();
  const bottomKeywords = ["jean", "pant", "trouser", "track", "jogger", "bottom", "pajama"];
  return bottomKeywords.some((k) => sub.includes(k)) ? "jeans" : "top";
};

function SingleProduct() {
  const { id } = useParams();
  // Context se products nikal rahe hain
  const { products } = useContext(AppContext);


  // States for Data
  const [product, setProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Local UI States
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    const getProductFromContext = () => {
      setLoading(true);

      // 1. Context array se specific product find karein
      const foundProduct = products.find((p) => p._id === id);

      if (foundProduct) {
        setProduct(foundProduct);

        // Default selection for Size
        if (foundProduct.sizes?.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }

        // Default selection for Color
        if (foundProduct.colors?.length > 0) {
          setSelectedColor(foundProduct.colors[0]);
        }

        // 2. Related Products filter logic (Context se hi)
        if (foundProduct.mainCategory) {
          const related = products
            .filter(
              (p) =>
                p.mainCategory === foundProduct.mainCategory && p._id !== id,
            )
            .slice(0, 8); // Limit to 8

          setFilteredProducts(related);
        }
      }

      setLoading(false);
    };

    if (products && products.length > 0) {
      getProductFromContext();
    }

    window.scrollTo(0, 0);
  }, [id, products]); // Products array change hone par re-run hoga

  useEffect(() => {
    if (!product) return;

    document.title = product.seoTitle || product.name || "Maurish";

    const description = product.seoDescription || product.shortDescription || product.description || "";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description.slice(0, 160));
  }, [product]);


  const { addToCart } = useContext(CartContext);

  const handleAddToCart = async () => {
    if (hasSizing && !selectedSize) {
      alert("Please select a size first!");
      return;
    }


    const payload = {
      productId: product._id,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      product: product,
    };


    const result = await addToCart(payload);

    // 3. Response handle karein
    if (result.success) {
      alert("✅ Added to cart successfully!");
    } else {
      console.error("Add Error:", result.message);
      alert(result.message || "❌ Failed to add to cart");
    }
  };

  if (loading || !product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  // Sizing Logic
  const hasSizing =
    product.sizes &&
    product.sizes.length > 0 &&
    product.sizes[0] !== "Free" &&
    product.sizes[0] !== "Standard";

  // ── Size guide props for the overlay ──────────────────────────
  const productType = resolveProductType(product);
  const sizeGuide = SIZE_GUIDES[productType] || SIZE_GUIDES.top;
  const guideLabel =
    productType === "jeans"
      ? ["Waist", "Hip", "Thigh", "Inseam"]
      : ["Chest", "Shoulder", "Length"];

  // Image Processing Logic (Same as before)
  const processImages = (imgs) => {
    if (Array.isArray(imgs)) {
      return imgs
        .map((item) => {
          const imagePath = typeof item === "object" ? item.url : item;
          if (!imagePath) return null;
          return imagePath.startsWith("http")
            ? imagePath
            : `${BACKEND_URL}${imagePath}`;
        })
        .filter((img) => img !== null);
    }
    return [];
  };

  const processedImagesList = processImages(product.images);
  const mainImage =
    processedImagesList.length > 0
      ? processedImagesList[0]
      : "/images/placeholder.png";
  const thumbnails =
    processedImagesList.length > 0 ? processedImagesList : [mainImage];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <div
          className={`transition-all duration-300 ${sizeGuideOpen ? "blur-md pointer-events-none" : ""}`}
        >
          <section className="max-w-[1440px] mx-auto px-4 md:px-10 py-12 h-fit">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start h-fit">
              <div className="lg:col-span-7 h-fit">
                <ProductImageGallery
                  thumbnails={thumbnails}
                  mainImage={mainImage}
                />
              </div>

              <div className="lg:col-span-5 sticky top-28 h-fit">
                <ProductDetails
                  product={product}
                  hasSizing={hasSizing}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  selectedSize={selectedSize}
                  setSelectedSize={setSelectedSize}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  setSizeGuideOpen={setSizeGuideOpen}
                  handleAddToCart={handleAddToCart}
                />
              </div>
            </div>
          </section>

          <section className="max-w-[1440px] mx-auto px-4 md:px-10 py-10">
            <ProductTabs
              activeTab={activeTab}
              product={product}
              setActiveTab={setActiveTab}
              onProductUpdate={(updatedProduct) => setProduct(updatedProduct)}
            />
          </section>

          <section className="bg-[#fcfcfc] py-16">
            <div className="max-w-[1440px] mx-auto space-y-20">
              {/* Context se filtered products pass kiye hain */}
              <NewArrivals products={filteredProducts} />
              <div className="px-4 md:px-10">
                <CoustomerReviews />
              </div>
            </div>
          </section>
        </div>

       
        {sizeGuideOpen && (
          <SizeChartOverlay
            sizeGuide={sizeGuide}
            productType={productType}
            guideLabel={guideLabel}
            setSizeGuideOpen={setSizeGuideOpen}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default SingleProduct;