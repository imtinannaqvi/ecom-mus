import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";

function Payment() {
  const [showCardForm, setShowCardForm] = useState(false);

  return (
    <section className="w-full relative h-full">
      {/* Add Card Modal/Sidebar */}
      {showCardForm && (
        <div className="fixed inset-0 w-full h-screen bg-black/40 backdrop-blur-sm z-[999] flex justify-end">
          <div className="w-full sm:max-w-[400px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add New Card</h2>
              <RxCross2
                className="text-2xl cursor-pointer text-gray-500 hover:text-red-500 transition-colors"
                onClick={() => setShowCardForm(false)}
              />
            </div>

            {/* Modal Form Body */}
            <div className="p-6 flex flex-col gap-5 overflow-y-auto h-full">
              <InputField label="Card Number*" placeholder="3523 1495 2316 4785" />
              <InputField label="Card Holder Name" placeholder="Brooklyn Simmons" />

              <div className="flex items-center gap-4">
                <InputField label="Expiry Date*" placeholder="MM/YY" />
                <InputField label="CVV*" placeholder="123" type="password" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer mt-2 group">
                <input type="checkbox" className="w-5 h-5 accent-black cursor-pointer" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors">
                  Use as the primary card
                </span>
              </label>

              <div className="mt-auto pt-6">
                <button className="w-full bg-black text-white py-4 rounded-lg font-bold text-sm shadow-lg active:scale-[0.98] transition-all hover:bg-gray-900">
                  Add New Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Action Button */}
      <div className="w-full flex items-center justify-end p-2">
        <button
          onClick={() => setShowCardForm(true)}
          className="w-full sm:w-auto px-6 md:px-10 py-3 rounded-lg flex items-center justify-center gap-2 text-base md:text-lg bg-black text-white transition-transform active:scale-95"
        >
          <IoIosAdd size={24} /> Add new Card
        </button>
      </div>

      {/* Cards List */}
      <div className="w-full mt-6 md:mt-10 flex flex-col gap-4">
        <CardRow type="Mastercard" number="xxxx xxxx xxxx 3443" isMaster={true} />
        <CardRow type="Visa" number="xxxx xxxx xxxx 8821" isMaster={false} />
        <CardRow type="Mastercard" number="xxxx xxxx xxxx 1092" isMaster={true} />
      </div>
    </section>
  );
}

// Sub-component for Card Rows
const CardRow = ({ type, number, isMaster }) => (
  <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 md:h-24 border-b border-gray-200 hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-4 w-full md:w-auto">
      {/* Card Icon Container */}
      <div className="w-16 h-10 md:w-20 md:h-12 bg-gray-100 flex items-center justify-center rounded shrink-0">
        {isMaster ? (
          <svg width="40" height="25" viewBox="0 0 70 44">
            <path d="M44.443 4.64795H25.5V38.8073H44.443V4.64795Z" fill="#FF5A00" />
            <path d="M26.7612 21.7276C26.7612 14.7874 30.0118 8.62774 34.9997 4.64787C31.3288 1.75086 26.6981 0 21.6471 0C9.68166 0 0 9.71764 0 21.7276C0 33.7375 9.68166 43.4551 21.6471 43.4551C26.6981 43.4551 31.3288 41.7043 34.9997 38.8073C30.0048 34.8836 26.7612 28.6677 26.7612 21.7276Z" fill="#EB001B" />
            <path d="M69.9997 21.7276C69.9997 33.7375 60.318 43.4551 48.3526 43.4551C43.3016 43.4551 38.6709 41.7043 35 38.8073C40.051 34.8204 43.2385 28.6677 43.2385 21.7276C43.2385 14.7874 39.9879 8.62774 35 4.64787C38.6639 1.75086 43.2946 0 48.3456 0C60.318 0 69.9997 9.78092 69.9997 21.7276Z" fill="#F79E1B" />
          </svg>
        ) : (
          <svg width="40" height="15" viewBox="0 0 67 21">
            <path d="M23.5672 20.2052L26.9416 0.404787H32.3387L28.962 20.2052H23.5672ZM48.4603 0.831624C47.3912 0.430478 45.7155 0 43.6233 0C38.2904 0 34.5338 2.68543 34.502 6.53435C34.4717 9.37959 37.1837 10.9668 39.2307 11.9139C41.3316 12.8844 42.0377 13.5033 42.0278 14.37C42.0146 15.6972 40.3502 16.3036 38.799 16.3036C36.6389 16.3036 35.4913 16.0035 33.7188 15.2642L33.0233 14.9496L32.2658 19.3821C33.5264 19.9348 35.8575 20.4136 38.2777 20.4384C43.951 20.4384 47.6338 17.7837 47.6758 13.6735C47.696 11.4211 46.2582 9.707 43.1444 8.29379C41.258 7.37791 40.1027 6.76658 40.115 5.83917C40.115 5.01614 41.0928 4.13597 43.2057 4.13597C44.9706 4.10866 46.2492 4.49352 47.2453 4.89456L47.7288 5.12316L48.4603 0.831624ZM62.3487 0.404483H58.1782C56.8863 0.404483 55.9195 0.757181 55.3521 2.04649L47.3369 20.1921H53.0042C53.0042 20.1921 53.9307 17.7522 54.1403 17.2166C54.7598 17.2166 60.2652 17.2251 61.0524 17.2251C61.2138 17.9182 61.7089 20.1921 61.7089 20.1921H66.717L62.3487 0.403876V0.404483ZM55.7319 13.1904C56.1782 12.0495 57.8823 7.65535 57.8823 7.65535C57.8503 7.70815 58.3252 6.50896 58.5978 5.76553L58.9624 7.47278C58.9624 7.47278 59.996 12.1992 60.212 13.1904H55.7319ZM18.9855 0.404483L13.7016 13.9075L13.1386 11.1634C12.1549 8.00026 9.09019 4.57322 5.66406 2.85748L10.4954 20.1737L16.2057 20.1672L24.7024 0.404281H18.9855" fill="#0E4595" />
            <path d="M8.7716 0.403726H0.0688805L0 0.815694C6.77052 2.45467 11.2505 6.41545 13.1106 11.1741L11.2181 2.07496C10.8914 0.821257 9.94398 0.447117 8.7718 0.40332" fill="#F2AE14" />
          </svg>
        )}
      </div>

      <div className="flex-1">
        <h4 className="text-sm md:text-base font-bold text-gray-900">{type}</h4>
        <p className="text-xs md:text-sm text-gray-500 font-medium">{number}</p>
      </div>
    </div>

    {/* Radio and Delete Button Wrapper */}
    <div className="flex items-center justify-between w-full md:w-auto gap-4">
      <div className="flex items-center gap-2">
        <input type="radio" name="primary_card" className="w-4 h-4 accent-black cursor-pointer" />
        <p className="text-xs md:text-sm text-gray-600 whitespace-nowrap">Primary Card</p>
      </div>

      <button className="flex items-center justify-center gap-2 px-4 py-2 text-xs md:text-sm font-bold bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">
        <RiDeleteBinLine size={18} />
        <span className="hidden sm:inline">Delete</span>
      </button>
    </div>
  </div>
);

// Reusable Input Field
const InputField = ({ label, placeholder, type = "text" }) => (
  <div className="flex flex-col gap-2 flex-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      required
      className="w-full text-sm px-4 py-3 outline-none border border-gray-300 rounded-md focus:border-black transition-all placeholder:text-gray-400"
      placeholder={placeholder}
      type={type}
    />
  </div>
);

export default Payment;