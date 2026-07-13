import React, { useState, useEffect } from "react";
import { FiSearch, FiSliders, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import Api, { BACKEND_URL } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  

  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});


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
  }, []);

 
  const handleDeleteProduct = async (productId, productName) => {

    setDeletingId(productId);
    try {
      await Api.delete(`/product/delete/${productId}`);
      toast.success("Product deleted successfully!");
      setAllProducts((prev) => prev.filter((p) => p._id !== productId));
      setSelectedItems((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    } catch (err) {
      toast.error("Error deleting product: " + (err.response?.data?.message || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  
  const handleBulkDelete = async () => {
    const idsToDelete = Object.keys(selectedItems).filter((id) => selectedItems[id]);
    if (idsToDelete.length === 0) return;

    try {
      await Promise.all(idsToDelete.map((id) => Api.delete(`/product/delete/${id}`)));
      toast.success(`${idsToDelete.length} product(s) deleted successfully!`);
      setAllProducts((prev) => prev.filter((p) => !idsToDelete.includes(p._id)));
      setSelectedItems({});
      setSelectAll(false);
    } catch (err) {
      toast.error("Some products failed to delete: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory = selectedCategory
      ? product.mainCategory === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  const handleSelectAll = () => {
    const nextState = !selectAll;
    setSelectAll(nextState);
    const updatedSelections = {};
    filteredProducts.forEach(p => {
      updatedSelections[p._id] = nextState;
    });
    setSelectedItems(updatedSelections);
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusStyles = (status) => {
    const normalize = status?.toLowerCase() || "active";
    if (normalize.includes("sched")) {
      return "bg-[#E0F2FE] text-[#0369A1]"; 
    }
    if (normalize.includes("draft")) {
      return "bg-[#FFEDD5] text-[#C2410C]"; 
    }
    return "bg-[#DCFCE7] text-[#15803D]"; 
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white min-h-screen font-sans">
      <ToastContainer />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-[#1E1B4B] italic shrink-0">Products list</h1>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 min-w-[160px] sm:w-64 md:w-72 lg:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-gray-400 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition shrink-0">
            <FiSliders className="text-gray-400" /> Filter
          </button>
          
          <button onClick={() => { setSelectedCategory(""); setSearchTerm(""); }} className="border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition shrink-0">
            See All
          </button>

          {selectedCount > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 border border-red-200 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition shrink-0"
            >
              <FiTrash2 className="text-base" /> Delete ({selectedCount})
            </button>
          )}
          
          <Link to="/admin/product/new" className="flex items-center gap-1.5 bg-[#635BFF] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition shrink-0 ml-auto sm:ml-0">
            <FiPlus className="text-lg" /> Add Product
          </Link>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
        {loading ? (
<div className="p-20 flex justify-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" /></div>        ) : (
          /* Preserves scroll containment below md, scales wide on md and lg without clipping content */
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[900px] md:min-w-0">
              <thead>
                <tr className="border-b border-gray-100 text-[#8A94A6] text-xs font-semibold bg-gray-50/50">
                  <th className="p-4 w-12 text-center shrink-0">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-[#635BFF] focus:ring-[#635BFF] w-4 h-4 cursor-pointer"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 font-medium text-[13px] whitespace-nowrap">Product Name</th>
                  <th className="p-4 font-medium text-[13px] whitespace-nowrap">Category</th>
                  <th className="p-4 font-medium text-[13px] whitespace-nowrap">Price</th>
                  <th className="p-4 font-medium text-[13px] whitespace-nowrap">Stock</th>
                  <th className="p-4 font-medium text-[13px] whitespace-nowrap">Status</th>
                  <th className="p-4 font-medium text-[13px] text-right whitespace-nowrap pr-6">Action</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-50 text-[14px]">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/40 transition-colors group">
                      
                      {/* Checkbox Column */}
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-[#635BFF] focus:ring-[#635BFF] w-4 h-4 cursor-pointer"
                          checked={!!selectedItems[product._id]}
                          onChange={() => handleSelectItem(product._id)}
                        />
                      </td>

                      {/* Product details combined */}
                      <td className="p-4 font-medium text-[#1E293B]">
                        <div className="flex items-center gap-3">
                          <img
                            src={`${BACKEND_URL}${product.images?.[0]?.url || ''}`}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100 bg-gray-50 shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/40x40/f3f4f6/a1a1aa?text=Image";
                            }}
                          />
                          {/* Ensures product names wrap naturally or expand fully rather than forcing row clip */}
                          <span className="break-words max-w-[220px] sm:max-w-xs md:max-w-none">{product.name}</span>
                        </div>
                      </td>

                      {/* Category Display */}
                      <td className="p-4 text-[#5D6B82] whitespace-nowrap">{product.mainCategory || "General"}</td>

                      {/* Clean currency formatting match */}
                      <td className="p-4 font-medium text-[#1E293B] whitespace-nowrap">
                        ${parseFloat(product.price).toFixed(2)}
                      </td>

                      {/* Stock Counter item */}
                      <td className="p-4 text-[#5D6B82] whitespace-nowrap">{product.stock}</td>

                      {/* Precise Status Pill matching image rules */}
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide inline-block ${getStatusStyles(product.status || (product.stock > 0 ? 'Active' : 'Draft'))}`}>
                          {product.status || (product.stock > 0 ? "Active" : "Draft")}
                        </span>
                      </td>

                      {/* Details View/Action Router link + Delete */}
                      <td className="p-4 text-right pr-6 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/admin/product/${product._id}`}
                            className="text-[#635BFF] hover:underline font-semibold text-xs inline-flex items-center gap-1 transition"
                          >
                            Detail
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                            disabled={deletingId === product._id}
                            title="Delete product"
                            className="text-gray-400 hover:text-red-500 transition disabled:opacity-50"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-16 text-center text-gray-400">
                      No inventory records loaded matching this setup.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Dynamic Image-Accurate Pagination Panel */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 p-4 bg-white gap-4 sm:gap-0 text-sm">
          <button 
            disabled={currentPage === 1}
            className="w-full sm:w-auto border border-gray-200 px-4 py-1.5 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-center"
          >
            &larr; Previous
          </button>

          <div className="flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar py-1">
            {[1, 2, 3, "...", 8, 9, 10].map((page, idx) => (
              <button
                key={idx}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition shrink-0 ${
                  page === currentPage
                    ? "bg-[#F5F3FF] text-[#635BFF]"
                    : "text-gray-500 hover:bg-gray-50"
                } ${typeof page !== 'number' ? 'cursor-default' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            className="w-full sm:w-auto border border-gray-200 px-4 py-1.5 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition text-center"
          >
            Next &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductList;