import React, { useState } from "react"; // 1. useState import kiya
import { BsArrowLeft } from "react-icons/bs";
import { Link } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { GoGift } from "react-icons/go";
import { AiOutlinePicture } from "react-icons/ai";
import { IoCameraOutline } from "react-icons/io5";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

function ProductReviews() {
  // 2. State banayi (shuru mein false taake modal hidden rahe)
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="w-full relative h-full">
      
      {/* 3. Conditional Rendering: Agar showModal true hoga tabhi yeh dikhega */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/20 z-50 backdrop-blur-lg">
          <div className="w-80 h-80 text-center p-5 rounded-xl flex items-center justify-center flex-col bg-white shadow-2xl">
            <img className="w-20 h-20 object-center object-cover" src="/images/Check.png" alt="" />
            <h1 className="text-lg font-semibold mt-5">Thank you for your feedback!</h1>
            <p className="text-sm text-gray-600">We appreciated your feedback. We’ll use your feedback to improve your experience.</p>
            
            {/* 4. Continue Shopping par click karne se modal band ho jayega */}
            <button 
              onClick={() => setShowModal(false)} 
              className="w-full bg-black text-white mt-5 py-2 rounded-md"
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
        <p className="text-sm">
          Submit your reviews on the product to get 5% discount in your next order
        </p>
        <MdKeyboardArrowRight />
      </div>

      <div className="mt-5 w-full flex items-center justify-center gap-1">
        {[...Array(5)].map((_, i) => (
          <CiStar
            key={i}
            size={20}
            className={i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">(4.0)</span>
      </div>

      <textarea
        placeholder="Would you like mt5 to write anything about this product? "
        className="w-full resize-none mt-5 h-30 p-4 outline-none border rounded-lg shadow-lg border-gray-300 "
      ></textarea>

      <div className="w-40 h-20 mt-5 flex items-center justify-between">
        <span className="p-4 rounded-xl flex items-center justify-center border-3 border-dashed border-[#CCD2E3] cursor-pointer">
          <AiOutlinePicture color="#CCD2E3" size={24} />
        </span>
        <span className="p-4 rounded-xl flex items-center justify-center border-3 border-dashed border-[#CCD2E3] cursor-pointer">
          <IoCameraOutline color="#CCD2E3" size={24} />
        </span>
      </div>

      {/* 5. Submit button par onClick function lagaya jo modal show karega */}
      <div 
        onClick={() => setShowModal(true)} 
        className="w-full mt-5 py-4 text-white text-center font-semibold bg-black cursor-pointer active:scale-95 transition-all"
      >
        Submit Reviews
      </div>

      <div className="w-full mt-5 text-[#6c7284] flex items-center justify-center gap-2">
        <p>Share</p> <FaFacebookF /> <FaTwitter /> <FaInstagram /> <FaWhatsapp />
      </div>
    </section>
  );
}

export default ProductReviews;