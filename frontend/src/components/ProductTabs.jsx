import React from "react";
import { Star } from "lucide-react";

const tabs = ["Description", "Additional Info", "Vendor", "Reviews"];

function ProductTabs({ activeTab, setActiveTab, product }) {
  // --- Fallback / Dummy Data ---
  const dummyDescription = "Uninhibited candor flared played in whipped cider gorilla knoll depends and much yikes off for quetzal goodness and from far grimaced spacemen unaccountably and melodrama roam unblinkingly crucial scallop tightly nervous.";
  
  const dummyAdditionalInfo = ["Standard Fit", "Cotton Blend", "Pre-shrunk Fabric", "Eco-friendly Dye"];

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold transition rounded-t ${
              activeTab === tab
                ? "bg-black text-white"
                : "bg-transparent text-gray-600 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6 space-y-4 text-sm text-gray-700">
        
        {/* DESCRIPTION TAB */}
        {activeTab === "Description" && (
          <div className="space-y-4 animate-fadeIn">
            <p className="leading-relaxed">
              {product?.description || dummyDescription}
            </p>
            {/* Agar product mein longDescription hai toh wo bhi dikha sakte hain */}
            {product?.longDescription && <p>{product.longDescription}</p>}
          </div>
        )}

        {/* ADDITIONAL INFO TAB */}
        {activeTab === "Additional Info" && (
          <div className="space-y-3 animate-fadeIn">
            <ul className="list-disc list-inside space-y-2 text-gray-700 font-medium">
              {product?.additionalInfo ? (
                product.additionalInfo.map((info, i) => <li key={i}>{info}</li>)
              ) : (
                <>
                  <li>Category: {product?.subCategory || "General Merchandise"}</li>
                  <li>Material: {product?.material || "Premium Quality"}</li>
                  <li>Available Sizes: {product?.sizes?.join(", ") || "Free Size"}</li>
                  <li>Stock Status: {product?.stock > 0 ? "In Stock" : "Limited Edition"}</li>
                </>
              )}
            </ul>
          </div>
        )}

        {/* VENDOR TAB */}
        {activeTab === "Vendor" && (
          <div className="space-y-3 animate-fadeIn">
            <p className="font-semibold text-gray-900">
              Vendor: {product?.vendorName || "Marvel Merchandise Official"}
            </p>
            <p>
              {product?.vendorDetails || 
               "Beautiful clothes, new trend ideas about stylish dress designs. Find the latest outfit styling tips from top fashion influencers."}
            </p>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "Reviews" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-gray-900">
              <Star size={16} fill="#FBBF24" className="text-yellow-400" />
              <span className="text-sm font-semibold">
                {product?.rating || "4.6"}/5 overall rating
              </span>
            </div>

            {/* Agar real reviews hain toh wo map honge, warna empty state dikhayega */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {product?.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, index) => (
                  <div key={index} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                    <p className="font-semibold">{review.user}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                    <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic col-span-2 text-center py-4">
                  No reviews yet for this product.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductTabs;