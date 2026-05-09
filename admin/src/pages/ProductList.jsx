import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import { Link } from 'react-router-dom';
const ProductList = () => {
  // 1. Original Data (Jo backend se aye ga)
  const [products, setProducts] = useState([
    { _id: "1", name: "Maurish Black Hoodie", price: 2500, stock: 15, category: "Hoodie", image: "https://via.placeholder.com/50" },
    { _id: "2", name: "Oversized White Tee", price: 1800, stock: 5, category: "T-Shirt", image: "https://via.placeholder.com/50" },
    { _id: "3", name: "Luxury Sweatpants", price: 3200, stock: 0, category: "Bottoms", image: "https://via.placeholder.com/50" },
    // Aur products yahan honge...
  ]);

  // 2. Filtered Data (Jo screen par dikhayenge)
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // 3. Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Backend se data lane ka effect (Dummy for now)
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // --- Search aur Filter ka Logic ---
  useEffect(() => {
    let result = products;

    // Search by Name
    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by Category
    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory);
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Product Inventory ({filteredProducts.length})</h1>
        
        {/* Search Bar */}
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

      {/* Filters Area */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <button 
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory === "" ? "bg-black text-white" : "bg-white text-gray-600 border border-gray-200"}`}
        >
          All
        </button>
        {["Hoodie", "T-Shirt", "Bottoms"].map((cat) => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory === cat ? "bg-black text-white" : "bg-white text-gray-600 border border-gray-200"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
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
                      <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                      <span className="font-semibold text-gray-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">{product.category}</td>
                  <td className="p-4 font-bold text-gray-900">Rs. {product.price}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-4">
                   <td className="p-4">
  <div className="flex justify-center gap-2">
    
    {/* Edit Button - Link ke sath */}
    <Link 
      to={`/admin/product/${product._id}`} 
      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" 
      title="Edit"
    >
      <FiEdit2 />
    </Link>

    {/* Delete Button - Function ke sath */}
    <button 
      onClick={() => deleteProductHandler(product._id)}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" 
      title="Delete"
    >
      <FiTrash2 />
    </button>
    
  </div>
</td>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400 font-medium">
                  No products found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;