import React, { useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { GoGift } from "react-icons/go";
import { AiOutlinePicture } from "react-icons/ai";
import { IoCameraOutline } from "react-icons/io5";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import { FaStar } from "react-icons/fa6"; // Filled star ke liye
import useProduct from "../../hooks/productService";

function ProductReviews() {
  const { id } = useParams(); // Order ya Product ID
  const navigate = useNavigate();
  const { submitProductReview } = useProduct();

  // States
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState(0);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // File Handle Function
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Submit Logic
  const handleSubmit = async () => {
    // Basic Validation
    if (stars === 0) return alert("Please select at least 1 star");
    if (!description.trim()) return alert("Please write something about the product");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("stars", stars);
      formData.append("description", description);
      formData.append("productId", id); // URL se aayi ID
      if (file) formData.append("reviewMedia", file);

      const res = await submitProductReview(formData);
      
      if (res?.success) {
        setShowModal(true);
      }
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full relative h-full">
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/20 z-50 backdrop-blur-lg">
          <div className="w-80 h-80 text-center p-5 rounded-xl flex items-center justify-center flex-col bg-white shadow-2xl">
            <img className="w-20 h-20 object-center object-cover" src="/images/Check.png" alt="Success" />
            <h1 className="text-lg font-semibold mt-5">Thank you for your feedback!</h1>
            <p className="text-sm text-gray-600">We appreciated your feedback. We’ll use your feedback to improve your experience.</p>
            <button 
              onClick={() => {
                setShowModal(false);
                navigate("/profile/orders"); // Feedback ke baad wapas bhej diya
              }} 
              className="w-full bg-black text-white mt-5 py-2 rounded-md font-bold uppercase text-xs tracking-widest"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <Link className="flex items-center gap-2 font-bold" to={"/profile/orders"}>
        <BsArrowLeft className="scale-x-150 text-lg font-bold" /> Back
      </Link>

      <div className="w-full rounded-sm flex items-center justify-between mt-10 bg-[#BDC8CF] p-2 ">
        <GoGift size={34} />
        <p className="text-sm">Submit your reviews on the product to get 5% discount in your next order</p>
        <MdKeyboardArrowRight />
      </div>

      {/* Stars Section (Dynamic) */}
      <div className="mt-5 w-full flex flex-col items-center justify-center gap-1">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <span key={num} onClick={() => setStars(num)} className="cursor-pointer">
              {num <= stars ? (
                <FaStar size={24} className="text-yellow-400" />
              ) : (
                <CiStar size={24} className="text-gray-300" />
              )}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-500 ml-1">({stars}.0 Rating)</span>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Would you like to write anything about this product?"
        className="w-full resize-none mt-5 h-32 p-4 outline-none border rounded-lg shadow-sm border-gray-300 transition-all focus:border-black"
      ></textarea>

      {/* Media Upload Section */}
      <div className="flex items-center gap-4 mt-5">
        <label className="p-4 rounded-xl flex items-center justify-center border-3 border-dashed border-[#CCD2E3] cursor-pointer hover:bg-gray-50 transition-all">
          <input type="file" hidden accept="image/*,video/*" onChange={handleFileChange} />
          <AiOutlinePicture color="#CCD2E3" size={24} />
        </label>
        
        <label className="p-4 rounded-xl flex items-center justify-center border-3 border-dashed border-[#CCD2E3] cursor-pointer hover:bg-gray-50 transition-all">
          <input type="file" hidden capture="camera" accept="image/*" onChange={handleFileChange} />
          <IoCameraOutline color="#CCD2E3" size={24} />
        </label>

        {/* Preview functionality */}
        {preview && (
          <div className="w-16 h-16 relative">
            <img src={preview} className="w-full h-full object-cover rounded-lg border" alt="preview" />
            <button onClick={() => {setFile(null); setPreview(null)}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-[10px]">X</button>
          </div>
        )}
      </div>

      {/* Submit Button with Loading */}
      <button 
        onClick={handleSubmit} 
        disabled={loading}
        className={`w-full mt-10 py-4 text-white text-center font-bold uppercase tracking-widest bg-black active:scale-95 transition-all ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {loading ? "Submitting..." : "Submit Reviews"}
      </button>

      <div className="w-full mt-5 text-[#6c7284] flex items-center justify-center gap-4">
        <p className="text-xs font-bold uppercase">Share</p> 
        <FaFacebookF className="cursor-pointer hover:text-black" /> 
        <FaTwitter className="cursor-pointer hover:text-black" /> 
        <FaInstagram className="cursor-pointer hover:text-black" /> 
        <FaWhatsapp className="cursor-pointer hover:text-black" />
      </div>
    </section>
  );
}

export default ProductReviews;