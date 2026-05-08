import React from "react";
import { CiSearch } from "react-icons/ci";

function Country() {
  const countries = [
    { id: 1, name: "Afghanistan", code: "af", flag: "https://flagcdn.com/w40/af.png" },
    { id: 2, name: "Albania", code: "al", flag: "https://flagcdn.com/w40/al.png" },
    { id: 3, name: "Algeria", code: "dz", flag: "https://flagcdn.com/w40/dz.png" },
    { id: 4, name: "Andorra", code: "ad", flag: "https://flagcdn.com/w40/ad.png" },
    { id: 5, name: "Angola", code: "ao", flag: "https://flagcdn.com/w40/ao.png" },
    { id: 6, name: "Argentina", code: "ar", flag: "https://flagcdn.com/w40/ar.png" },
    { id: 7, name: "Armenia", code: "am", flag: "https://flagcdn.com/w40/am.png" },
    { id: 8, name: "Australia", code: "au", flag: "https://flagcdn.com/w40/au.png" },
    { id: 9, name: "Austria", code: "at", flag: "https://flagcdn.com/w40/at.png" },
    { id: 10, name: "Azerbaijan", code: "az", flag: "https://flagcdn.com/w40/az.png" },
    { id: 11, name: "Bahamas", code: "bs", flag: "https://flagcdn.com/w40/bs.png" },
  ];

  return (
    <section className="w-full h-screen bg-black/10 flex items-center justify-center p-4 backdrop-blur-sm">
      {/* Main Container */}
      <div className="w-full max-w-[450px] bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800">Choose Country</h1>
          
          {/* Search Bar */}
          <div className="flex items-center border border-gray-300 rounded-xl px-3 mt-4 focus-within:border-black transition-all">
            <CiSearch className="text-xl text-gray-500" />
            <input
              className="w-full outline-none px-3 py-3 text-sm"
              type="search"
              placeholder="Search your Country"
            />
          </div>
        </div>

        {/* Country List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          <div className="flex flex-col gap-1">
            {countries.map((item) => (
              <div
                key={item.id}
                className="flex p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 w-full cursor-pointer items-center gap-4 group"
              >
                <img 
                  className="w-8 h-5 object-cover rounded shadow-sm group-hover:scale-110 transition-transform" 
                  src={item.flag} 
                  alt={item.name} 
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-black">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Country;