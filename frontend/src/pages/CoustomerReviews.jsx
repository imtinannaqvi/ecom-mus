import React from "react";

const CustomerReviews = () => {
  const reviewImages = [
    { id: 1, src: "/images/cr5.png", title: "Customer 1" },
    { id: 2, src: "/images/cr4.png", title: "Customer 2" },
    { id: 3, src: "/images/cr2.png", title: "Customer 3" },
    { id: 4, src: "/images/cr1.png", title: "Main Review" }, // Center
    { id: 5, src: "/images/cr3.png", title: "Customer 4" },
    { id: 6, src: "/images/cr6.png", title: "Customer 5" },
    { id: 7, src: "/images/cr7.png", title: "Customer 6" },
  ];

  return (
    <section className="relative w-full py-10 md:py-20 flex flex-col items-center justify-center overflow-hidden bg-[#fdfdfd]">
      <h1 className="text-sm md:text-lg text-center text-white py-2 bg-black px-6 uppercase tracking-widest mb-10">
        Customer Happiness
      </h1>

      {/* 
          Mobile: Horizontal Scroll (no-scrollbar utility recommended)
          Desktop: Flex Layout with Smooth X & Y expansion
      */}
      <div className="w-full flex md:flex-row items-center justify-start md:justify-center gap-3 px-6 overflow-x-auto md:overflow-visible h-[450px] md:h-[70vh] no-scrollbar">
        {reviewImages.map((img, index) => {
          const isCenter = index === 3;

          return (
            <div
              key={img.id}
              className={`
                relative flex-shrink-0 md:flex-shrink-1 
                h-[350px] md:h-full 
                rounded-2xl overflow-hidden cursor-pointer
                transition-all duration-500 ease-in-out group
                
                /* Mobile Width */
                w-[260px] md:w-auto

                /* Desktop Flex & Scale Logic (X & Y expansion) */
                ${isCenter 
                  ? "md:flex-[3] md:scale-100 grayscale-0 shadow-2xl border border-black/5" 
                  : "md:flex-1 md:grayscale md:scale-[0.92] hover:md:flex-[2.5] hover:md:scale-[1.02] hover:z-50 hover:grayscale-0 hover:shadow-2xl"
                }
              `}
            >
              {/* Image with internal zoom on hover */}
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src={img.src}
                alt={img.title}
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-medium uppercase tracking-widest opacity-70 mb-1">
                    Verified Purchase
                  </p>
                  <p className="text-white text-lg font-bold">
                    {img.title}
                  </p>
                </div>
              </div>

              {/* Glassmorphism subtle border */}
              <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Mobile Scroll Hint */}
      <p className="md:hidden mt-6 text-gray-400 text-xs animate-pulse">
        Swipe to see more reviews →
      </p>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
};

export default CustomerReviews;