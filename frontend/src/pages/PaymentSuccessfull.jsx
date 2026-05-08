import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function PaymentSuccessfull() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Main Content Section */}
      <section className="flex-grow w-full max-w-3xl mx-auto text-[#0C0C0C] text-center px-6 py-12 md:py-20 flex flex-col items-center justify-center gap-4">
        
        {/* Success Icon */}
        <div className="w-24 h-24 md:w-32 md:h-32 mb-2">
          <img 
            src="/images/success.png" 
            alt="Success" 
            className="w-full h-full object-contain" 
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Payment Successful
        </h1>

        {/* Message */}
        <div className="space-y-4">
          <p className="text-lg md:text-xl font-normal leading-relaxed capitalize">
            Thank you for choosing <span className="font-bold">maurish</span>, <br className="hidden md:block" />
            Your order will be generated based on your delivery request.
          </p>
          
          <p className="text-gray-600 text-sm md:text-base">
            The Receipt has been sent to your email.
          </p>
        </div>

        {/* Contact Info Section */}
        <div className="w-full border-t border-b border-gray-100 py-6 my-4 space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-widest">Or contact us for any query</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
            <p className="font-bold text-sm md:text-base">+1(000)000-000</p>
            <p className="font-bold text-sm md:text-base underline">hello@maurish.com</p>
          </div>
        </div>

        {/* Action Button */}
        <Link 
          to={'/'} 
          className="w-full sm:w-auto sm:px-24 bg-black text-white py-4 rounded-sm font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-all shadow-lg"
        >
          Continue Shopping
        </Link>

        {/* Discount Note */}
        <p className="mt-4 text-[10px] md:text-xs text-gray-500 uppercase tracking-tighter max-w-xs">
          <b>Rate your purchase</b> and get <span className="text-red-600 font-bold">5% Discount</span> once the product has arrived
        </p>

      </section>

      <Footer />
    </main>
  );
}

export default PaymentSuccessfull;