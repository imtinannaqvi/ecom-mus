import React from 'react';
import { CiSearch } from 'react-icons/ci';

function Language() {
  const languages = [
    { id: 1, name: "Arabic", flag: "https://flagcdn.com/w40/sa.png" },
    { id: 2, name: "Bengali", flag: "https://flagcdn.com/w40/bd.png" },
    { id: 3, name: "English", flag: "https://flagcdn.com/w40/gb.png" },
    { id: 4, name: "French", flag: "https://flagcdn.com/w40/fr.png" },
    { id: 5, name: "German", flag: "https://flagcdn.com/w40/de.png" },
    { id: 6, name: "Hindi", flag: "https://flagcdn.com/w40/in.png" },
    { id: 7, name: "Italian", flag: "https://flagcdn.com/w40/it.png" },
    { id: 8, name: "Japanese", flag: "https://flagcdn.com/w40/jp.png" },
    { id: 9, name: "Javanese", flag: "https://flagcdn.com/w40/id.png" },
    { id: 10, name: "Korean", flag: "https://flagcdn.com/w40/kr.png" },
    { id: 11, name: "Marathi", flag: "https://flagcdn.com/w40/in.png" },
    { id: 12, name: "Portuguese", flag: "https://flagcdn.com/w40/pt.png" },
    { id: 13, name: "Russian", flag: "https://flagcdn.com/w40/ru.png" },
    { id: 14, name: "Spanish", flag: "https://flagcdn.com/w40/es.png" },
    { id: 15, name: "Swahili", flag: "https://flagcdn.com/w40/ke.png" },
    { id: 16, name: "Tamil", flag: "https://flagcdn.com/w40/lk.png" },
    { id: 17, name: "Telugu", flag: "https://flagcdn.com/w40/in.png" },
    { id: 18, name: "Turkish", flag: "https://flagcdn.com/w40/tr.png" },
    { id: 19, name: "Urdu", flag: "https://flagcdn.com/w40/pk.png" },
  ];

  return (
    <section className="w-full h-screen bg-black/10 flex items-center justify-center p-4 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="w-full max-w-[400px] bg-white shadow-2xl rounded-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header Section */}
        <div className="p-5 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800">Choose Language</h1>
          
          {/* Search Bar */}
          <div className="flex items-center border border-gray-300 rounded-xl px-3 mt-4 focus-within:border-black transition-all bg-gray-50">
            <CiSearch className="text-xl text-gray-500" />
            <input
              className="w-full outline-none px-3 py-3 text-sm bg-transparent"
              type="search"
              placeholder="Search your Language"
            />
          </div>
        </div>

        {/* Scrollable Language List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {languages.map((item) => (
            <div
              key={item.id}
              className="flex w-full rounded-xl hover:bg-gray-100 cursor-pointer items-center justify-start p-3 gap-4 group transition-all"
            >
              <img 
                className="w-7 h-5 rounded-sm object-cover shadow-sm group-hover:scale-110 transition-transform" 
                src={item.flag} 
                alt={item.name} 
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-black">
                {item.name}
              </span>
            </div>
          ))}
        </div>

        {/* Optional Footer (For padding/clean look) */}
        <div className="h-4 bg-white"></div>
      </div>
    </section>
  );
}

export default Language;