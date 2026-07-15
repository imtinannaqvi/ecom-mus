import React, { useState, useEffect, useMemo } from "react";
import { FiSearch, FiSliders, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import Api, { BACKEND_URL } from "../api/api";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 8;
const CATEGORY_OPTIONS = ["All", "Men", "Women", "Kids"];


const buildPageList = (total, current) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await Api.get("/product/all");
        setAllProducts(res.data.products || []);
      } catch (err) {
        console.log("API error: ", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
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

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch = searchTerm
        ? (product.name || "").toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesCategory = selectedCategory
        ? product.mainCategory === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, searchTerm, selectedCategory]);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Pagination: slice the filtered list for the current page.
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const pageList = buildPageList(totalPages, safePage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  // Select-all applies to the products visible on THIS page.
  const handleSelectAll = () => {
    const nextState = !selectAll;
    setSelectAll(nextState);
    const updatedSelections = { ...selectedItems };
    paginatedProducts.forEach((p) => {
      updatedSelections[p._id] = nextState;
    });
    setSelectedItems(updatedSelections);
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusStyles = (status) => {
    const normalize = status?.toLowerCase() || "active";
    if (normalize.includes("sched")) return "bg-[#E0F2FE] text-[#0369A1]";
    if (normalize.includes("draft")) return "bg-[#FFEDD5] text-[#C2410C]";
    return "bg-[#DCFCE7] text-[#15803D]";
  };

  const getImage = (product) => {
    const img = product.images?.[0];
    const path = typeof img === "object" ? img?.url : img;
    if (!path) return "https://placehold.co/48x48/f1f5f9/94a3b8?text=—";
    return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white min-h-screen font-sans">
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

          {/* FILTER — now a working category dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setFilterOpen((prev) => !prev)}
              className={`flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory
                  ? "border-[#635BFF] text-[#635BFF] bg-[#F5F3FF]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FiSliders className={selectedCategory ? "text-[#635BFF]" : "text-gray-400"} />
              {selectedCategory || "Filter"}
            </button>

            {filterOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                {CATEGORY_OPTIONS.map((cat) => {
                  const value = cat === "All" ? "" : cat;
                  const active = selectedCategory === value;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => { setSelectedCategory(value); setFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition ${
                        active ? "bg-[#F5F3FF] text-[#635BFF]" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => { setSelectedCategory(""); setSearchTerm(""); }}
            className="border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition shrink-0"
          >
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

      {/* Result count + active filter hint */}
      <p className="text-xs text-gray-400 mb-3">
        {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}
        {selectedCategory && ` in ${selectedCategory}`}
        {searchTerm && ` matching "${searchTerm}"`}
      </p>

      <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-slate-50/70 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-10">
                    <input
                      type="checkbox"
                      checked={selectAll && paginatedProducts.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 accent-[#635BFF] cursor-pointer"
                    />
                  </th>
                  <th className="p-4">Product</th>
                  <th className="p-4 whitespace-nowrap">Category</th>
                  <th className="p-4 whitespace-nowrap">Price</th>
                  <th className="p-4 whitespace-nowrap">Stock</th>
                  <th className="p-4 whitespace-nowrap">Status</th>
                  <th className="p-4 pr-6 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[13px]">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 pl-6">
                        <input
                          type="checkbox"
                          checked={!!selectedItems[product._id]}
                          onChange={() => handleSelectItem(product._id)}
                          className="w-4 h-4 accent-[#635BFF] cursor-pointer"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={getImage(product)}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100 bg-gray-50 shrink-0"
                          />
                          <span className="font-semibold text-[#1E293B] truncate max-w-[220px]">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-[#5D6B82] whitespace-nowrap">{product.mainCategory || "General"}</td>
                      <td className="p-4 font-medium text-[#1E293B] whitespace-nowrap">
                        ${parseFloat(product.price || 0).toFixed(2)}
                      </td>
                      <td className="p-4 text-[#5D6B82] whitespace-nowrap">{product.stock}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide inline-block ${getStatusStyles(product.status || (product.stock > 0 ? 'Active' : 'Draft'))}`}>
                          {product.status || (product.stock > 0 ? "Active" : "Draft")}
                        </span>
                      </td>
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
                            onClick={() => handleDeleteProduct(product._id)}
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

        {/* Pagination: driven by real page count, all buttons wired */}
        {!loading && filteredProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 p-4 bg-white gap-4 sm:gap-0 text-sm">
            <button
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              className="w-full sm:w-auto border border-gray-200 px-4 py-1.5 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-center"
            >
              &larr; Previous
            </button>

            <div className="flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar py-1">
              {pageList.map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof page === "number" && goToPage(page)}
                  disabled={typeof page !== "number"}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition shrink-0 ${
                    page === safePage
                      ? "bg-[#F5F3FF] text-[#635BFF]"
                      : "text-gray-500 hover:bg-gray-50"
                  } ${typeof page !== "number" ? "cursor-default" : ""}`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="w-full sm:w-auto border border-gray-200 px-4 py-1.5 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-center"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;