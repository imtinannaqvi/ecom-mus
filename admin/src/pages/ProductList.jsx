import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import Api from "../api/api";

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ fetchProducts called inside useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await Api.get("/product/all");
        setAllProducts(res.data.products);
      } catch (err) {
        console.log("API error: ", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // runs once on mount

  // ✅ Derived state — no useEffect needed
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory = selectedCategory
      ? product.mainCategory === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const deleteProductHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await Api.delete(`/product/delete/${id}`);
        setAllProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Product Inventory ({filteredProducts.length})
        </h1>
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search product by name..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            selectedCategory === ""
              ? "bg-black text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          All
        </button>
        {["Men", "Women", "Kids"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              selectedCategory === cat
                ? "bg-black text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-500">Loading Products...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Main Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`http://localhost:3000${product.images[0]?.url}`}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null; // ✅ stops infinite loop
                            e.target.src = "https://placehold.co/50x50";
                          }}
                        />
                        <span className="font-semibold text-gray-800">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">{product.mainCategory}</td>
                    <td className="p-4 font-bold text-gray-900">Rs. {product.price}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          product.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/product/${product._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          onClick={() => deleteProductHandler(product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductList;