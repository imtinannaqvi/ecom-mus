import React, { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const CustomerReviews = () => {
  const reviewImages = [
    { id: 1, src: "/images/cr5.png", title: "Customer 1" },
    { id: 2, src: "/images/cr4.png", title: "Customer 2" },
    { id: 3, src: "/images/cr2.png", title: "Customer 3" },
    { id: 4, src: "/images/cr1.png", title: "Main Review" }, // Default Center
    { id: 5, src: "/images/cr3.png", title: "Customer 4" },
    { id: 6, src: "/images/cr6.png", title: "Customer 5" },
    { id: 7, src: "/images/cr7.png", title: "Customer 6" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // 5 items in one view
  const itemsToShow = 5;
  const maxIndex = reviewImages.length - itemsToShow;

  const nextSlide = () => setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  const prevSlide = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));

  return (
    <section className="relative w-full py-10 md:py-20 flex flex-col items-center justify-center overflow-hidden bg-[#fdfdfd] px-4 md:px-10">
      <h1 className="text-sm md:text-lg text-center text-white py-2 bg-black px-6 uppercase tracking-widest mb-14">
        Customer Happiness
      </h1>

      <div className="relative w-full max-w-[1440px] mx-auto">
        {/* Navigation Buttons */}
        <button onClick={prevSlide} className="absolute -left-6 top-1/2 -translate-y-1/2 z-50 bg-white shadow-xl p-3 rounded-full hover:bg-black hover:text-white transition-all hidden lg:block">
          <IoChevronBack size={24} />
        </button>
        <button onClick={nextSlide} className="absolute -right-6 top-1/2 -translate-y-1/2 z-50 bg-white shadow-xl p-3 rounded-full hover:bg-black hover:text-white transition-all hidden lg:block">
          <IoChevronForward size={24} />
        </button>

        {/* Slider */}
        <div className="w-full overflow-hidden py-10">
          <div 
            className="flex transition-transform duration-700 ease-in-out gap-4"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
          >
            {reviewImages.map((img, index) => {
              // Logic: Agar mouse nahi hai toh exactly center (index 2 relative to current) active ho
              // Otherwise jo hovered hai wo active ho
              const isActive = hoveredIndex === null 
                ? (index === currentIndex + 2) 
                : (hoveredIndex === index);

              return (
                <div
                  key={img.id}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`
                    relative flex-shrink-0 transition-all duration-500 ease-out cursor-pointer rounded-2xl overflow-hidden
                    /* Responsive Width for 5 items */
                    w-[280px] sm:w-[45%] lg:w-[calc(100%/5-1rem)]
                    
                    /* Effect: No grayscale, only scale and brightness/opacity */
                    ${isActive 
                      ? "scale-105 z-20 shadow-2xl opacity-100 brightness-100" 
                      : "scale-95 z-10 opacity-50 brightness-75 hover:opacity-80"
                    }
                  `}
                >
                  <div className="w-full h-[450px] md:h-[550px]">
                    <img
                      className="w-full h-full object-cover"
                      src={img.src}
                      alt={img.title}
                    />
                  </div>
                  
                  {/* Overlay Content */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-500 flex flex-col justify-end p-6 ${isActive ? "opacity-100" : "opacity-0"}`}>
                    <p className="text-white text-[10px] uppercase tracking-widest mb-1">Verified Purchase</p>
                    <p className="text-white text-lg font-bold tracking-tight">{img.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-500 rounded-full h-1.5 ${currentIndex === idx ? "w-10 bg-black" : "w-2 bg-gray-300"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default CustomerReviews;