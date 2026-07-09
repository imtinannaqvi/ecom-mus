import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Box,
  Truck,
  Headphones,
  CircleDollarSign,
} from "lucide-react";
import { FaFacebookF, FaYoutube, FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useProduct from "../hooks/productService";

// Colorful Payment Method Icons
const VisaIcon = () => (
  <svg
    width="40"
    height="28"
    viewBox="0 0 40 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="28" rx="4" fill="#1A1F71" />
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="white"
      fontSize="10"
      fontWeight="bold"
    >
      VISA
    </text>
  </svg>
);

const MastercardIcon = () => (
  <svg
    width="40"
    height="28"
    viewBox="0 0 40 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="28" rx="4" fill="#EB001B" />
    <circle cx="16" cy="14" r="8" fill="#FF5F00" />
    <circle cx="24" cy="14" r="8" fill="#FFB81C" />
  </svg>
);

const AmexIcon = () => (
  <svg
    width="40"
    height="28"
    viewBox="0 0 40 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="28" rx="4" fill="#006FCF" />
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="white"
      fontSize="8"
      fontWeight="bold"
    >
      AMEX
    </text>
  </svg>
);

const PaypalIcon = () => (
  <svg
    width="40"
    height="28"
    viewBox="0 0 40 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="28" rx="4" fill="#003087" />
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="white"
      fontSize="9"
      fontWeight="bold"
    >
      PayPal
    </text>
  </svg>
);

const GooglePayIcon = () => (
  <svg
    width="40"
    height="28"
    viewBox="0 0 40 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="28" rx="4" fill="#000000" />
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="white"
      fontSize="8"
      fontWeight="bold"
    >
      G Pay
    </text>
  </svg>
);

const ApplePayIcon = () => (
  <svg
    width="40"
    height="28"
    viewBox="0 0 40 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="28" rx="4" fill="#000000" />
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="white"
      fontSize="9"
      fontWeight="bold"
    >
      Apple
    </text>
  </svg>
);

// Builds the exact same URL-safe slug used elsewhere (Header, TopCategories),
// so footer links always land on a real, matching item page.
const toSlug = (name) => (name || "")
  .toLowerCase()
  .replace(/\//g, "-")
  .replace(/\s+/g, "-");
const Footer = () => {
  const [categories, setCategories] = useState([]);
  const { fetchMainCategory } = useProduct();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchMainCategory();
        setCategories((res.data || []).filter((cat) => cat.isActive !== false));
      } catch (err) {
        console.error("Failed to load footer categories", err);
      }
    };
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <footer className="w-full font-sans text-gray-300">
      {/* Promotional section with feature highlights like returns, shipping, etc */}
      <div className="bg-[#f3f4f6] py-12 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-black">
          {[
            {
              icon: <Box size={32} />,
              title: "RETURN ORDER",
              desc: "Over The Last Few Weeks, And As Reported Previously In Our First Article",
            },
            {
              icon: <Truck size={32} />,
              title: "FREE SHIPPING",
              desc: "Over The Last Few Weeks, And As Reported Previously In Our First Article",
            },
            {
              icon: <Headphones size={32} />,
              title: "24/7 CUSTOMER SERVICE",
              desc: "Over The Last Few Weeks, And As Reported Previously In Our First Article",
            },
            {
              icon: <CircleDollarSign size={32} />,
              title: "TRACK ORDER",
              desc: "Over The Last Few Weeks, And As Reported Previously In Our First Article",
            },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                {item.icon}
              </div>
              <h4 className="font-bold text-sm tracking-widest mb-2">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer content with company info, links, and subscription */}
      <div className="bg-black text-white pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 border-b border-gray-800 pb-12">
          {/* Company logo and contact information section */}
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

          {/* Company navigation and mobile app download links */}
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
                <span className="w-full  h-full flex flex-col items-start justify-start">
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

                <span className="w-full h-full  flex flex-col items-start justify-start ">
                  <span className="text-[8px]">GET IT ON</span>
                  <span className="text-xs font-bold">Google Play</span>
                </span>
              </div>
            </div>
          </div>

          {/* Customer support contact and assistance options */}
          <div>
            <h4 className="font-bold mb-6 text-sm">CUSTOMER SERVICE</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>Contact Us</li>
              <li>Track Order</li>
              <li>Return Order</li>
              <li>Cancel Order</li>
            </ul>
          </div>

          {/* Social media connections and payment method icons */}
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
            <div className="flex gap-3 flex-wrap">
              {/* Colorful payment method icons */}
              <div
                title="Visa"
                className="hover:scale-110 transition-transform cursor-pointer"
              >
                <VisaIcon />
              </div>
              <div
                title="Mastercard"
                className="hover:scale-110 transition-transform cursor-pointer"
              >
                <MastercardIcon />
              </div>
              <div
                title="American Express"
                className="hover:scale-110 transition-transform cursor-pointer"
              >
                <AmexIcon />
              </div>
              <div
                title="PayPal"
                className="hover:scale-110 transition-transform cursor-pointer"
              >
                <PaypalIcon />
              </div>
              <div
                title="Google Pay"
                className="hover:scale-110 transition-transform cursor-pointer"
              >
                <GooglePayIcon />
              </div>
              <div
                title="Apple Pay"
                className="hover:scale-110 transition-transform cursor-pointer"
              >
                <ApplePayIcon />
              </div>
            </div>
          </div>

          {/* Email subscription form for newsletter and promotions */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase">
              Keep up to date
            </h4>
            <div className="flex mb-4">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="bg-[#222] border-none p-3 text-sm w-full outline-none focus:ring-1 focus:ring-gray-500"
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

        {/* Sitemap — dynamically built from real categories/subcategories,
            so it never drifts out of sync with what's actually in the store. */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 py-12 text-gray-400 text-[13px]">

          {categories.map((cat) => (
            <div key={cat._id} className="space-y-2">
              <h4 className="text-white font-bold mb-4 border-b border-gray-800 pb-2 uppercase">
                {cat.name}
              </h4>
              {cat.subCategories && cat.subCategories.length > 0 ? (
                cat.subCategories.map((group) => (
                  <div key={group._id} className="mb-3">
                    <p className="text-xs font-semibold text-gray-300 uppercase mb-1">
                      {group.name}
                    </p>
                    <div className="space-y-2">
                      {(group.items || []).map((item) => (
                        <Link
                          key={item._id}
                          to={`/shop/${cat.name.toLowerCase()}/${toSlug(item.name)}`}
                          className="block text-xs text-gray-400 hover:text-white transition"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-600 italic">Coming soon</p>
              )}
            </div>
          ))}

          {/* Quick links and company information */}
          <div className="space-y-2">
            <h4 className="text-white font-bold mb-4 border-b border-gray-800 pb-2 uppercase">
              Help & Info
            </h4>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-300 uppercase">
                Support
              </p>
              <Link
                to="/profile/support"
                className="block text-xs text-gray-400 hover:text-white transition"
              >
                Contact Us
              </Link>
              <Link
to="/profile/orders"
                className="block text-xs text-gray-400 hover:text-white transition"
              >
                Track Order
              </Link>
              <a
                href="#"
                className="block text-xs text-gray-400 hover:text-white transition"
              >
                FAQ
              </a>
              <a
                href="#"
                className="block text-xs text-gray-400 hover:text-white transition"
              >
                Shipping Info
              </a>
              <a
                href="#"
                className="block text-xs text-gray-400 hover:text-white transition"
              >
                Return Policy
              </a>
            </div>
            <div className="space-y-2 mt-3">
              <p className="text-xs font-semibold text-gray-300 uppercase">
                Company
              </p>
              <a
                href="#"
                className="block text-xs text-gray-400 hover:text-white transition"
              >
                About Us
              </a>
              <a
                href="#"
                className="block text-xs text-gray-400 hover:text-white transition"
              >
                Careers
              </a>
              <a
                href="#"
                className="block text-xs text-gray-400 hover:text-white transition"
              >
                Blog
              </a>
            </div>
          </div>

          {/* Prominent display of return policy for customer assurance */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 text-white font-bold">
              <Truck size={20} />
              <span className="text-sm">10 Days Return Policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;