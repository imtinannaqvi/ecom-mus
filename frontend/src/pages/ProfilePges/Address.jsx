import React, { useState, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import { BiSolidEdit } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";
import API from '../../api/api';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Address() {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]); // List storage
  const [editId, setEditId] = useState(null); // Edit tracking

  // 1. Form State Object
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "India",
    flatColony: "",
    state: "Maharashtra",
    city: "Mumbai",
    zipCode: "",
    mobileNumber: { countryCode: "+91", number: "" }
  });

  // Input Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "number") {
      setFormData(prev => ({
        ...prev,
        mobileNumber: { ...prev.mobileNumber, number: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 2. Fetch Addresses (Initial Load)
  const fetchAddresses = async () => {
    try {
      const res = await API.get('/address/get-address'); // Apni get api use karein
      if (res.data.success) setAddresses(res.data.addresses);
    } catch (err) { console.log(err.message); }
  };

  useEffect(() => { fetchAddresses(); }, []);

  // 3. Add or Update Function
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update Logic
        const res = await API.put(`/address/update/${editId}`, formData);
        if (res.data.success) toast.success("Address added successfully");;
      } else {
        // Add Logic
        const res = await API.post('/address/add', formData);
        if (res.data.success) toast.success("Address updated successfully");;
      }
      setShowAddressForm(false);
      setEditId(null);
      resetForm();
      fetchAddresses(); // Refresh list
    } catch (err) {
toast.error(err.response?.data?.message || "Something went wrong");    }
  };

const handleDelete = async (id) => {
  try {
    const res = await API.delete(`/address/delete/${id}`);

    if (res.data.success) {
      toast.success("Address deleted successfully");
      fetchAddresses();
    }
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.log("Delete Error:", msg);
    toast.error(msg);
  }
};

  // 4. Edit Button Click (Old data form mein lana)
  const handleEditClick = (address) => {
    setEditId(address._id);
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      country: address.country,
      flatColony: address.flatColony,
      state: address.state,
      city: address.city,
      zipCode: address.zipCode,
      mobileNumber: address.mobileNumber
    });
    setShowAddressForm(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: "", lastName: "", country: "India", flatColony: "",
      state: "Maharashtra", city: "Mumbai", zipCode: "",
      mobileNumber: { countryCode: "+91", number: "" }
    });
  };

  return (
    <section className="w-full h-full relative">
      {showAddressForm && (
        <div className="fixed inset-0 w-full h-full bg-black/40 backdrop-blur-sm z-[100] flex justify-end">
          <div className="relative w-full sm:max-w-[500px] h-full bg-white shadow-2xl flex flex-col">
            <form onSubmit={handleSaveAddress} className="flex flex-col h-full">
              <div className="sticky top-0 bg-white flex justify-between items-center px-6 py-5 border-b z-10">
                <h2 className="text-[20px] font-bold">{editId ? "Update Address" : "Add New Address"}</h2>
                <button type="button" onClick={() => { setShowAddressForm(false); setEditId(null); resetForm(); }}>
                  <IoClose className="text-[#EF4444] text-3xl" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>

                <InputField label="Flat, Colony, Street, Sector" name="flatColony" value={formData.flatColony} onChange={handleChange} />

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="State" name="state" value={formData.state} onChange={handleChange} />
                  <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
                </div>

                <InputField label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleChange} />

                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold">Mobile Number</label>
                  <div className="flex items-center h-[54px] px-4 rounded-lg border border-[#D1D5DB]">
                    <span className="pr-3 border-r font-bold">+91</span>
                    <input
                      type="text" name="number" value={formData.mobileNumber.number}
                      onChange={handleChange} placeholder="Number"
                      className="flex-1 h-full pl-4 focus:outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full h-[58px] bg-black text-white font-bold rounded-lg mt-6">
                  {editId ? "Update Address" : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="w-full p-2 flex justify-end">
        <button onClick={() => setShowAddressForm(true)} className="bg-black px-8 py-3 rounded-lg text-white flex items-center gap-2">
          <IoIosAdd size={24} /> Add New Address
        </button>
      </div>

      <div className="w-full px-2 mt-6 space-y-4">
        {addresses.map((addr) => (
          <div key={addr._id} className="w-full border-b pb-6 flex items-center justify-between border-gray-200">
            <div className="md:w-[45%]">
              <h4 className="text-lg font-semibold">{addr.firstName} {addr.lastName}</h4>
              <p className="text-xs text-gray-400">{addr.flatColony}, {addr.city}, {addr.state} - {addr.zipCode}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEditClick(addr)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg font-bold text-xs">
                <BiSolidEdit size={16} /> Edit
              </button>
              <button onClick={() => { handleDelete(addr._id) }} className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-xs">
                <RiDeleteBin5Line size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Updated Reusable Component
const InputField = ({ label, name, value, onChange, required, placeholder }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[14px] font-semibold text-[#1A1A1A]">{label}</label>
    <input
      type="text" name={name} value={value} onChange={onChange}
      placeholder={placeholder}
      className="w-full h-[54px] px-4 rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-1 focus:ring-black text-sm"
      required={required}
    />
  </div>
);

export default Address;