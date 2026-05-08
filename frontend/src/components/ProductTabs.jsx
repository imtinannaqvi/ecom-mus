import React from "react";
import { Star } from "lucide-react";

const tabs = ["Description", "Additional Info", "Vendor", "Reviews"];

function ProductTabs({ activeTab, setActiveTab }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold transition rounded-t ${
              activeTab === tab
                ? "bg-black text-white"
                : "bg-transparent text-gray-600 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4 text-sm text-gray-700">
        {activeTab === "Description" && (
          <div className="space-y-4">
            <p>
              Uninhibited candor flared played in whipped cider gorilla knoll
              depends and much yikes off for quetzal goodness and from far
              grimaced spacemen unaccountably and melodrama roam unblinkingly
              crucial scallop tightly nervous but very some well down futuristic
              spirit.
            </p>
            <p>
              Spluttered nervously when left mouth in fluke bowed this that
              grizzly muck holo on spaceship that also throughput much
              downright richly and more galaxies frequent fluidly so formidable
              acceptably fishguts besides and much chrome over the beautifully low
              precarious sybilline zavatodon goodness engraved a jellyfish and one
              however because.
            </p>
          </div>
        )}

        {activeTab === "Additional Info" && (
          <div className="space-y-3">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>T-Shirt</li>
              <li>Green, Pink, Powder Blue, Purple</li>
              <li>XXXL</li>
              <li>70%</li>
              <li>Carton</li>
            </ul>
            <p>
              Laconic overhead deer woodchuck were the outrageously tart however
              for levels for meadowlark inhabitants surprisingly hugged their yikes
              minimal unguent pouted flirtatiously as beeper bedazzled above
              forward enwreaths across the Japanese benevolently coddity less a ton
              maxwellism that merge upheld due to the idea when proud then believe
              after jazz enchanting cloudically more match were obviously
              retrospective impet.
            </p>
          </div>
        )}

        {activeTab === "Vendor" && (
          <div className="space-y-3">
            <p className="font-semibold text-gray-900">About this vendor</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
            <p>
              Beautiful clothes, new trend ideas about stylish dress designs. Find
              the latest outfit styling tips and heads from the top fashion
              influencers.
            </p>
          </div>
        )}

        {activeTab === "Reviews" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-900">
              <Star size={16} fill="#FBBF24" className="text-yellow-400" />
              <span className="text-sm font-semibold">4.6/5 overall rating</span>
            </div>
            <p className="text-gray-600">
              One inspiration colors naturally. Many control pieces of shirt. Great
              fit and premium materials make this an excellent choice.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                <p className="font-semibold">Jane D.</p>
                <p className="text-xs text-gray-500">May 11, 2026</p>
                <p className="mt-2 text-sm text-gray-700">
                  Large, comfortable, and bold design. Shipping was fast and
                  quality is exceptional.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                <p className="font-semibold">Mark R.</p>
                <p className="text-xs text-gray-500">May 8, 2026</p>
                <p className="mt-2 text-sm text-gray-700">
                  Very happy with the material and print. The sizing guide is
                  helpful and the shirt looks great.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductTabs;
