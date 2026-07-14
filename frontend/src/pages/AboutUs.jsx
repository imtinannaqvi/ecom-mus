import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutUs = () => {
  return (
    <>
      <Header />

      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-black italic text-gray-900">
              About Maurish
            </h1>

            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-14 h-1 bg-black"></div>
              <div className="w-3 h-3 rounded-full bg-black"></div>
              <div className="w-14 h-1 bg-black"></div>
            </div>

            <p className="text-gray-500 mt-5 max-w-3xl mx-auto leading-8">
              Maurish is a modern fashion destination that brings together
              style, quality, and affordability. We offer carefully selected
              clothing, footwear, and accessories for men, women, and kids,
              making shopping simple, enjoyable, and accessible for everyone.
            </p>
          </div>

          {/* Story */}
          <div className="bg-gray-50 rounded-3xl p-8 lg:p-14 mb-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Logo */}
              <div className="flex justify-center">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 w-full max-w-md flex items-center justify-center hover:shadow-2xl transition-all duration-300">
                  <img
                    src="/images/logo.png"
                    alt="Maurish Logo"
                    className="w-72 object-contain"
                  />
                </div>
              </div>

              {/* Story Content */}
              <div>
                <h2 className="text-3xl font-bold mb-5 text-gray-900">
                  Our Story
                </h2>

                <p className="text-gray-600 leading-8 mb-5">
                  Maurish was created with a simple vision—to make fashion
                  accessible without compromising on quality. Our platform
                  offers a wide collection of trendy clothing, footwear, and
                  lifestyle accessories designed for every occasion. We 
                  continuously update our collections with the latest
                  fashion trends, ensuring every customer enjoys a seamless
                  shopping experience backed by secure payments, fast delivery,
                  and dedicated customer support.
                </p>
              </div>

            </div>
          </div>

          {/* Mission */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">

            <div className="border rounded-xl p-8 shadow-sm hover:shadow-lg transition hover:bg-black hover:text-white">
              <h3 className="text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-7 hover:text-gray-300">
                To provide fashionable, high-quality products at competitive
                prices while delivering an exceptional online shopping
                experience.
              </p>
            </div>

            <div className="border rounded-xl p-8 shadow-sm hover:shadow-lg transition hover:bg-black hover:text-white">
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-7 hover:text-gray-300">
                To become a trusted global fashion brand by combining
                innovation, customer satisfaction, and the latest fashion
                trends.
              </p>
            </div>

            <div className="border rounded-xl p-8 shadow-sm hover:shadow-lg transition hover:bg-black hover:text-white">
              <h3 className="text-xl font-bold mb-3">Our Values</h3>
              <p className="text-gray-600 leading-7 hover:text-gray-300">
                Quality, integrity, customer satisfaction, affordability, and
                continuous innovation are the core values that drive everything
                we do.
              </p>
            </div>

          </div>

          {/* Why Choose Us */}
          <div className="bg-gray-50 rounded-2xl p-10">
            <h2 className="text-3xl font-bold text-center mb-10">
              Why Choose Maurish?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">

              <div className="group bg-white border border-gray-200 rounded-lg p-6 transition-all duration-300 hover:bg-black hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                <h3 className="text-3xl font-bold text-black group-hover:text-white">
                  10K+
                </h3>
                <p className="text-gray-600 mt-2 group-hover:text-gray-300">
                  Happy Customers
                </p>
              </div>

              <div className="group bg-white border border-gray-200 rounded-lg p-6 transition-all duration-300 hover:bg-black hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                <h3 className="text-3xl font-bold text-black group-hover:text-white">
                  5K+
                </h3>
                <p className="text-gray-600 mt-2 group-hover:text-gray-300">
                  Premium Products
                </p>
              </div>

              <div className="group bg-white border border-gray-200 rounded-lg p-6 transition-all duration-300 hover:bg-black hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                <h3 className="text-3xl font-bold text-black group-hover:text-white">
                  100+
                </h3>
                <p className="text-gray-600 mt-2 group-hover:text-gray-300">
                  Fashion Brands
                </p>
              </div>

              <div className="group bg-white border border-gray-200 rounded-lg p-6 transition-all duration-300 hover:bg-black hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                <h3 className="text-3xl font-bold text-black group-hover:text-white">
                  24/7
                </h3>
                <p className="text-gray-600 mt-2 group-hover:text-gray-300">
                  Customer Support
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
};

export default AboutUs;