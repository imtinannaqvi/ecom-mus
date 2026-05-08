import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { BiSolidEdit } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";

function Address() {
  const [showAddressForm, setShowAddressForm] = useState(false);

  return (
    <section className="w-full h-full relative">
      {/* Address Form Sidebar/Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 w-full h-full bg-black/40 backdrop-blur-sm z-[100] flex justify-end">
          <div className="relative w-full sm:max-w-[500px] h-full bg-gray-100 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex-1 overflow-y-auto bg-white border-l border-gray-200">
              {/* Header */}
              <div className="sticky top-0 bg-white flex justify-between items-center px-6 py-5 border-b border-gray-100 z-10">
                <h2 className="text-[20px] font-bold text-[#1A1A1A]">Add New Address</h2>
                <button onClick={() => setShowAddressForm(false)} className="hover:rotate-90 transition-transform duration-200">
                  <IoClose className="text-[#EF4444] text-3xl cursor-pointer" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="First Name" placeholder="Cameron" required />
                    <InputField label="Last Name" placeholder="Williamson" />
                </div>
                
                <SelectField label="Country" value="India" />
                <InputField label="Flat, Colony, Street, Sector" placeholder="4517 Washington Ave." />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField label="State" value="Maharashtra" />
                    <SelectField label="City" value="Mumbai" />
                </div>

                <InputField label="Zip Code" placeholder="411001" />

                {/* Mobile Number */}
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-[#1A1A1A]">Mobile Number</label>
                  <div className="flex items-center w-full h-[54px] px-4 rounded-lg border border-[#D1D5DB] bg-white">
                    <div className="flex items-center gap-2 pr-3 border-r border-gray-200 cursor-pointer h-full">
                      <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3.5 object-cover rounded-sm" />
                      <span className="font-bold text-[14px]">+91</span>
                      <FiChevronDown className="text-xs" />
                    </div>
                    <input type="text" placeholder="Enter Mobile Number" className="flex-1 h-full pl-4 focus:outline-none text-[14px]" />
                  </div>
                </div>

                {/* Checkbox */}
                <div className="flex items-center gap-3 py-2 cursor-pointer group">
                  <div className="w-5 h-5 flex items-center justify-center bg-[#10B981] rounded text-white text-[10px]">✓</div>
                  <span className="text-[14px] font-medium text-[#1A1A1A]">Use as shipping address</span>
                </div>

                <div className="pb-10">
                  <button className="w-full h-[58px] bg-black text-white font-bold rounded-lg shadow-lg hover:bg-gray-900 transition-all">
                    Add New Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar: Add Button */}
      <div className="w-full p-2 flex justify-end">
        <button
          onClick={() => setShowAddressForm(true)}
          className="bg-black w-full sm:w-auto px-8 md:px-12 flex items-center justify-center gap-2 rounded-lg py-3 text-white text-sm font-semibold"
        >
          <IoIosAdd size={24} /> Add New Address
        </button>
      </div>

      {/* Address List */}
      <div className="w-full px-2 mt-6 space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="w-full border-b pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-gray-200">
            <div className="md:w-[45%]">
              <h4 className="text-lg font-semibold">Savannah Nguyen</h4>
              <p className="text-xs md:text-sm text-gray-400 mt-1">
                4517 Washington Ave. Manchester, Kentucky 39495
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <input className="w-4 h-4 accent-black" type="checkbox" id={`ship-${item}`} />
              <label htmlFor={`ship-${item}`} className="text-sm text-gray-700">Use as shipping address</label>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex-1 md:flex-none flex items-center justify-center py-2.5 gap-2 w-full md:w-24 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <BiSolidEdit size={16} /> Edit
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center py-2.5 gap-2 w-full md:w-24 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                <RiDeleteBin5Line size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Reusable Input Component for cleaner code
const InputField = ({ label, placeholder, required }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[14px] font-semibold text-[#1A1A1A]">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full h-[54px] px-4 rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-1 focus:ring-black placeholder-[#9CA3AF] text-sm"
    />
    {required && <span className="text-[#EF4444] text-[11px] font-medium">Field is required*</span>}
  </div>
);

const SelectField = ({ label, value }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[14px] font-semibold text-[#1A1A1A]">{label}</label>
    <div className="w-full h-[54px] px-4 flex items-center justify-between rounded-lg border border-[#D1D5DB] text-sm cursor-pointer bg-white">
      <span>{value}</span>
      <FiChevronDown className="text-xl" />
    </div>
  </div>
);

export default Address;