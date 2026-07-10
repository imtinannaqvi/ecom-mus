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
    // Check karein agar size select nahi kiya (agar product mein sizes hain)
    if (hasSizing && !selectedSize) {
      alert("Please select a size first!");
      return;
    }

    // 1. Data prepare karein (exact wahi format jo backend maang raha hai)
    // "product" (the full product object) is included so the guest cart
    // (localStorage, no backend populate) can display name/image/price
    // immediately without an extra API call.
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