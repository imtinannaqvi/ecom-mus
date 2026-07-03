import React from 'react'
import Button from './Button';
import {Link} from 'react-router-dom'
import { BACKEND_URL } from "../api/api";

function TopCategories({ mainCategory, subCategories }) {
 
  

  return (
    <section className="w-full flex items-center justify-center flex-col p-4 md:p-10">
      <Button text={"TOP CATEGORIES"} />
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 mt-8 md:mt-10">
        {subCategories.map((elem , idx) => (
          <Link  key={idx}
            to={`/shop/${mainCategory}/${elem.name}`}
            key={elem.id}
            className="relative h-60 md:h-80 rounded-lg overflow-hidden group"
          >
            <img
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              src={`${BACKEND_URL}${elem.image}`}
              alt={elem.name}
            />
            <div className="w-full px-4 py-2 absolute left-0 top-0 bg-black/60">
              <p
                className="text-xl md:text-2xl font-extrabold capitalize tracking-tighter"
                style={{
                  color: "rgba(0,0,0,0.6)",
                  WebkitTextStroke: "1px white",
                  paintOrder: "stroke fill",
                }}
              >
                {elem.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};


export default TopCategories