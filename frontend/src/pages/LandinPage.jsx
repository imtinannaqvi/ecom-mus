import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaBars,
  FaYoutube,
} from "react-icons/fa";
import { Mail, Phone } from "lucide-react";
import { IoMdMail } from "react-icons/io";
import useProduct from "../hooks/productService";

function LandinPage() {
  const [items, setItems] = useState([]);

  const { fetchMainCategory } = useProduct();

  const fetchCategory = async () => {
    try {
      const res = await fetchMainCategory();
      setItems(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <main className="w-full ">
      <header className="w-full  shadow ">
        <div className="hidden md:flex w-full h-10 items-center justify-between text-white px-6 bg-black relative z-[110]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-[11px] tracking-wider">
              <FaPhoneAlt size={10} /> 1-888-923-8044
            </span>
            <span className="flex items-center gap-2 text-[11px] tracking-wider">
              <IoMdMail size={12} /> HELP@MAURISH.COM
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
            <div className="flex gap-3 items-center">
              <FaFacebookF className="hover:text-blue-500 cursor-pointer" />
              <FaInstagram className="hover:text-pink-500 cursor-pointer" />
              <FaTwitter className="hover:text-blue-400 cursor-pointer" />
            </div>
            <span className="h-3 w-[1px] bg-gray-700 mx-2"></span>
            <Link
              to="/profile/track"
              className="hover:text-red-500 transition-colors"
            >
              Track Order
            </Link>
            <Link
              to="/profile/support"
              className="hover:text-red-500 transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
        <div className="w-full h-15  p-4 flex items-center justify-center ">
          <img
            className="w-fit h-fit object-cover"
            src="/images/logo.png"
            alt=""
          />
        </div>
      </header>
      <section className="w-full py-5 px-4  min-h-screen flex flex-wrap items-stretch justify-between gap-4">
        {items.map((item, idx) => {
          return (
            <div
              key={idx}
              className="w-full sm:w-[48%] lg:w-[32%] shrink-0 relative h-screen overflow-hidden "
            >
              {/* Image */}
              <img
                className="w-full h-full object-cover object-top"
                src={`http://localhost:3000${item.image}`}
                alt={item.title}
              />

              {/* Overlay Content */}
              <div className="w-full flex items-center gap-4 flex-col justify-center bottom-0 h-[30%] bg-black/60 absolute backdrop-blur-sm">
                <h1 className="text-xl uppercase font-bold text-white text-center px-2">
                  {item.title}
                </h1>
                <Link
                  to={`/shop/${item.name}`}
                  className="px-6 py-2 bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          );
        })}
      </section>
      <footer className="w-full lg:p-10 p-5  bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 border-b border-gray-800 pb-12">
          {/* Brand Info */}
          <div className="col-span-1">
            <img src="/images/footer-logo.png" alt="" />
            <div className="space-y-4 text-sm text-gray-400">
              <p className="flex items-center mt-4 gap-2">
                <Mail size={16} /> help@maurish.com
              </p>
              <div>
                <p className="flex items-center gap-2 text-white font-bold text-lg">
                  <Phone size={18} /> 1-888-92-8044
                </p>
                <p className="text-xs ml-7">Working 8:00 - 22:00</p>
              </div>
              <div>
                <p className="flex items-center gap-2 text-white font-bold text-lg">
                  <Phone size={18} /> 1-888-923-8055
                </p>
                <p className="text-xs ml-7">24/7 Support Center</p>
              </div>
              <p className="text-[10px] pt-4">
                © 2025, <span className="text-white">maurish</span> - A
                Ecommerce platform. All rights reserved
              </p>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold mb-6 text-sm">COMPANY</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>About Us</li>
              <li>We Are Hiring</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
            <h4 className="font-bold mt-8 mb-4 text-sm">Download App</h4>
            <div className="flex w-60 gap-2">
              <div className="bg-black w-60 border border-gray-700 p-2 rounded flex items-center gap-1 cursor-pointer hover:bg-gray-900">
                <svg
                  width="22"
                  height="26"
                  viewBox="0 0 22 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.6098 13.557C17.5804 10.3363 20.2905 8.7695 20.4144 8.69655C18.8796 6.49519 16.5006 6.19441 15.6646 6.17043C13.6665 5.96358 11.7284 7.34655 10.7106 7.34655C9.67244 7.34655 8.10508 6.19041 6.41582 6.22439C4.24203 6.25736 2.20842 7.49544 1.09309 9.41802C-1.20869 13.3381 0.507992 19.0988 2.71327 22.2675C3.81642 23.8203 5.10545 25.5521 6.79268 25.4911C8.44334 25.4252 9.05992 24.4569 11.0519 24.4569C13.0256 24.4569 13.6046 25.4911 15.3253 25.4521C17.0968 25.4252 18.2122 23.8933 19.2767 22.3275C20.5515 20.5498 21.0635 18.7971 21.0838 18.7071C21.0432 18.6931 17.6444 17.4161 17.6098 13.557ZM14.3593 4.08597C15.2471 2.99378 15.8545 1.50788 15.6859 0C14.4009 0.0559585 12.794 0.874352 11.8686 1.94256C11.0498 2.88386 10.3185 4.42672 10.5074 5.87764C11.9509 5.98356 13.4329 5.16117 14.3593 4.08597Z"
                    fill="white"
                  />
                </svg>
                <span className="w-full text-white h-full flex flex-col items-start justify-start">
                  <span className="text-[8px]">Download on the</span>
                  <span className="text-xs font-bold">App Store</span>
                </span>
              </div>
              <div className="bg-black w-60 border border-gray-700 p-2 rounded flex items-center gap-1 cursor-pointer hover:bg-gray-900">
                <img
                  className="w-5 h-5 object-cover"
                  src="/images/play-store.png"
                  alt=""
                />

                <span className="w-full h-full text-white flex flex-col items-start justify-start ">
                  <span className="text-[8px]">GET IT ON</span>
                  <span className="text-xs font-bold">Google Play</span>
                </span>
              </div>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold mb-6 text-sm">CUSTOMER SERVICE</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>Contact Us</li>
              <li>Track Order</li>
              <li>Return Order</li>
              <li>Cancel Order</li>
            </ul>
          </div>

          {/* Socials & Payments */}
          <div>
            <h4 className="font-bold mb-6 text-sm">CONNECT WITH US</h4>
            <div className="space-y-3 text-sm text-gray-400 mb-6">
              <p className="flex items-center gap-2">
                <FaFacebookF size={16} className="text-blue-600" /> 3.5 People
                Like This
              </p>
              <p className="flex items-center gap-2">
                <FaInstagram size={16} className="text-pink-500" /> 1.5 People
                Like This
              </p>
            </div>
            <h4 className="font-bold mb-4 text-sm">
              100% Secured Payment Gateways
            </h4>
            <div className="flex gap-1 flex-wrap">
              {/* Replace these with actual payment SVG icons */}
              {["Visa", "Master", "Amex", "PayPal", "Maestro", "Klarna"].map(
                (p) => (
                  <div
                    key={p}
                    className="w-10 h-6 bg-gray-200 rounded text-[8px] text-black flex items-center justify-center font-bold"
                  >
                    {p}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase">
              Keep up to date
            </h4>
            <div className="flex mb-4">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="bg-[#222] text-white border-none p-3 text-sm w-full outline-none focus:ring-1 focus:ring-gray-500"
              />
              <button className="bg-white text-black px-4 py-2 text-xs font-bold hover:bg-gray-200 transition">
                Subscribe
              </button>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <span className="text-xs font-bold">Follow Us</span>
              <FaFacebookF
                size={18}
                className="cursor-pointer hover:text-gray-400"
              />
              <FaTwitter
                size={18}
                className="cursor-pointer hover:text-gray-400"
              />
              <FaInstagram
                size={18}
                className="cursor-pointer hover:text-gray-400"
              />
              <FaYoutube
                size={18}
                className="cursor-pointer hover:text-gray-400"
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-2">
              Up to 15% discount on your first subscribe
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default LandinPage;
