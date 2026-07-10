import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiSearch, FiUsers, FiShield, FiEye } from 'react-icons/fi';
import Api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await Api.get("/admin/users");
        if (isMounted) {
          setUsers(res.data.users || []);
        }
      } catch (err) {
        toast.error(
          "Failed to load customers: " + (err.response?.data?.message || err.message)
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => { isMounted = false; };
  }, []);

  // Logic: exclude any admin accounts, then apply search
  const filteredUsers = users
    .filter((user) => user.role !== "admin")
    .filter((user) =>
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

  const deleteUserHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer account permanently?")) return;
    try {
      await Api.delete(`/admin/users/${id}`);
      toast.success("Customer account deleted successfully!");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error(
        "Error deleting: " + (err.response?.data?.message || err.message)
      );
    }
  };

  // Avatar Color Generator (Premium look ke liye soft professional colors)
  const getAvatarStyle = (name) => {
    const colors = [
      "bg-indigo-50 text-[#635BFF]",
      "bg-emerald-50 text-emerald-700",
      "bg-amber-50 text-amber-700",
      "bg-rose-50 text-rose-700"
    ];
    const safeName = name || "?";
    const index = safeName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto min-w-0">

        <ToastContainer />

        {/* Modern Unified Header Layout */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight italic text-[#1E1B4B]">Registered Customers</h1>
              <span className="text-[10px] bg-indigo-50 text-[#635BFF] px-2 py-0.5 rounded-md font-extrabold border border-indigo-100 shrink-0">
                {users.filter(u => u.role !== "admin").length} Total
              </span>
            </div>
           
          </div>

          {/* Premium Search input structure wrapper */}
          <div className="relative w-full sm:w-80 shrink-0">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none text-xs font-medium transition-all shadow-sm placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Consumers Data Sheets Grid Layout container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
              <thead>
                <tr className="bg-slate-50/70 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4 pl-6 whitespace-nowrap">Profile Identity</th>
                  <th className="p-4 whitespace-nowrap">Email Address</th>
                  <th className="p-4 whitespace-nowrap">Account Tier</th>
                  <th className="p-4 pr-6 text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-all group">

                      {/* Customer Avatar & Name Group */}
                      <td className="p-4 pl-6 flex items-center gap-3 whitespace-nowrap">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm tracking-wide shrink-0 ${getAvatarStyle(user.name)}`}>
                          {(user.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-700 text-sm tracking-tight truncate max-w-[180px] sm:max-w-xs">{user.name || "Unnamed"}</span>
                      </td>

                      {/* Email Identity */}
                      <td className="p-4 text-gray-500 font-normal select-all whitespace-nowrap truncate max-w-[200px] sm:max-w-xs">
                        {user.email}
                      </td>

                      {/* Account Class Privilege Status Tag */}
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-bold uppercase text-[9px] tracking-wider ${
                          user.isVerified
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                            : "bg-slate-50 border-gray-200/60 text-gray-500"
                        }`}>
                          {user.isVerified ? "Verified Buyer" : "Unverified"}
                        </span>
                      </td>

                      {/* Action Trigger control links */}
                      <td className="p-4 pr-6 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/admin/users/${user._id}`}
                            className="p-2 text-gray-400 hover:text-[#635BFF] hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center justify-center"
                            title="View customer details & saved addresses"
                          >
                            <FiEye size={14} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteUserHandler(user._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center"
                            title="Revoke access and delete account"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  /* Fallback Screen Context Empty Data View grid representation */
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-gray-400">
                      <div className="p-3 bg-slate-50 border border-gray-100 text-gray-300 rounded-xl mb-3 inline-block mx-auto">
                        <FiUsers size={22} />
                      </div>
                      <p className="text-xs font-semibold text-gray-500">No consumers records found</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Adjust lookup strings or monitor database sync loops</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserList;