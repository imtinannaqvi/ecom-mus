import React from 'react'
import Button from './Button';
import { Link } from 'react-router-dom'
import { BACKEND_URL } from "../api/api";

// Same slug format used everywhere else (Header, CategoriesProduct) so links
// always land on a matching page.
const slugify = (name) => (name || "")
  .toLowerCase()
  .replace(/\//g, "-")
  .replace(/\s+/g, "-");
function TopCategories({ mainCategory, subCategories }) {

  return (
    <section className="w-full flex items-center justify-center flex-col p-4 md:p-10">
      <Button text={"TOP CATEGORIES"} />
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 mt-8 md:mt-10">
        {subCategories.map((group) => (
          <div key={group._id} className="flex flex-col">

            {/* Group tile — clicking it shows every product across all of
                this group's items, aggregated (see CategoriesProduct.jsx) */}
            <Link
              to={`/shop/${mainCategory}/${slugify(group.name)}`}
              className="relative h-60 md:h-80 rounded-lg overflow-hidden group"
            >
              <img
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                src={`${BACKEND_URL}${group.image}`}
                alt={group.name}
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
                  {group.name}
                </p>
              </div>
            </Link>

            {/* Item list — the actual specific items inside this group,
                each linking directly to that exact item's products */}
            {group.items && group.items.length > 0 ? (
              <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5">
                {group.items.slice(0, 6).map((item) => (
                  <Link
                    key={item._id}
                    to={`/shop/${mainCategory}/${slugify(item.name)}`}
                    className="text-[10px] text-gray-500 hover:text-black hover:underline underline-offset-2 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-2.5 text-[10px] text-gray-300 italic">No items added yet</p>
            )}

          </div>
        ))}
      </div>
    </section>
  );
};

export default TopCategories