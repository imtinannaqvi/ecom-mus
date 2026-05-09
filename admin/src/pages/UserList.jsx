import React, { useState } from 'react';
import { FiTrash2, FiSearch } from 'react-icons/fi';

const UserList = () => {
  // Dummy Users Data (Admin bhi shamil hai)
  const [users] = useState([
    { _id: "u1", name: "Hamza Ahmed", email: "hamza@example.com", role: "admin" },
    { _id: "u2", name: "Zeeshan Ali", email: "zeeshan@test.com", role: "user" },
    { _id: "u3", name: "Sana Khan", email: "sana@maurish.com", role: "user" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // Logic: Pehle admin ko filter out karo, phir search apply karo
  const filteredUsers = users
    .filter((user) => user.role !== "admin") // Sirf wo dikhao jo admin nahi hain
    .filter((user) => 
       user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const deleteUserHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      console.log("Deleting User ID:", id);
      // Axios call here
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black italic tracking-tighter">REGISTERED CUSTOMERS</h1>
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg outline-none text-sm focus:ring-2 focus:ring-black transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-xs font-black text-gray-400 uppercase">Customer</th>
              <th className="p-4 text-xs font-black text-gray-400 uppercase">Email</th>
              <th className="p-4 text-xs font-black text-gray-400 uppercase text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-800">{user.name}</span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm italic">{user.email}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => deleteUserHandler(user._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-10 text-center text-gray-400 italic">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;