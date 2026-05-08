import React from 'react';
import { BiSupport, BiMessageDetail, BiEnvelope } from "react-icons/bi"; // icons install kar lena: npm install react-icons

const supportOptions = [
  {
    id: 1,
    title: "Live Chat",
    desc: "Average response time: 2 mins",
    icon: <BiMessageDetail className="text-2xl text-blue-600" />,
    btnText: "Start Chat"
  },
  {
    id: 2,
    title: "Email Support",
    desc: "Get a reply within 24 hours",
    icon: <BiEnvelope className="text-2xl text-green-600" />,
    btnText: "Send Email"
  },
  {
    id: 3,
    title: "24/7 Helpline",
    desc: "+1 (800) 123-4567",
    icon: <BiSupport className="text-2xl text-purple-600" />,
    btnText: "Call Now"
  }
];

function Support() {
  return (
    <section className="max-w-5xl mx-auto p-8 my-12 bg-white rounded-3xl shadow-sm border border-gray-100">
      {/* Top Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">How can we help?</h2>
        <p className="text-gray-500 mt-2 text-lg">Our team is available 24/7 to answer your questions.</p>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {supportOptions.map((option) => (
          <div 
            key={option.id} 
            className="flex flex-col items-center p-8 bg-gray-50 rounded-2xl hover:bg-blue-50/50 border border-transparent hover:border-blue-200 transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
              {option.icon}
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">{option.title}</h3>
            <p className="text-sm text-gray-500 text-center mb-6 h-10">
              {option.desc}
            </p>

            <button className="w-full py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-colors shadow-sm">
              {option.btnText}
            </button>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-12 text-center bg-gray-900 text-white p-6 rounded-2xl">
        <p className="text-sm font-light opacity-80">Looking for something else?</p>
        <button className="mt-2 text-white font-bold hover:underline">
          Visit our Documentation →
        </button>
      </div>
    </section>
  );
}

export default Support;