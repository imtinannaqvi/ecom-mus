import React, { useState } from 'react';
import { FiTrash2, FiSearch, FiUsers, FiShield } from 'react-icons/fi';

const UserList = () => {
  // Dummy Users Data (Admin aur Users mixed)
  const [users, setUsers] = useState([
    { _id: "u1", name: "Hamza Ahmed", email: "hamza@example.com", role: "admin" },
    { _id: "u2", name: "Zeeshan Ali", email: "zeeshan@test.com", role: "user" },
    { _id: "u3", name: "Sana Khan", email: "sana@maurish.com", role: "user" },
    { _id: "u4", name: "Ayesha Malik", email: "ayesha@example.com", role: "user" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // Logic: Filter out admin first, then apply search queries
  const filteredUsers = users
    .filter((user) => user.role !== "admin")
    .filter((user) => 
       user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const deleteUserHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this customer account permanently?")) {
      console.log("Deleting User ID:", id);
      // Apka Axios / API delete trigger call yahan aayega
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
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      <div className="max-w-6xl mx-auto">
        
        {/* Modern Unified Header Layout */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#1E1B4B]">Registered Customers</h1>
              <span className="text-[10px] bg-indigo-50 text-[#635BFF] px-2 py-0.5 rounded-md font-extrabold border border-indigo-100">
                {users.filter(u => u.role !== "admin").length} Total
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              User identity matrix. View active consumer accounts, access privileges, and manage lifecycles.
            </p>
          </div>

          {/* Premium Search input structure wrapper */}
          <div className="relative w-full sm:w-80">
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Profile Identity</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Account Tier</th>
                  <th className="p-4 pr-6 text-center">Terminate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-all group">
                      
                      {/* Customer Avatar & Name Group */}
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm tracking-wide ${getAvatarStyle(user.name)}`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-700 text-sm tracking-tight">{user.name}</span>
                      </td>
                      
                      {/* Email Identity */}
                      <td className="p-4 text-gray-500 font-normal select-all">
                        {user.email}
                      </td>

                      {/* Account Class Privilege Status Tag */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 border border-gray-200/60 text-gray-500 font-bold uppercase text-[9px] tracking-wider">
                          Verified Buyer
                        </span>
                      </td>
                      
                      {/* Action Trigger control links */}
                      <td className="p-4 pr-6 text-center">
                        <button 
                          type="button"
                          onClick={() => deleteUserHandler(user._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center"
                          title="Revoke access and delete account"
                        >
                          <FiTrash2 size={14} />
                        </button>
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