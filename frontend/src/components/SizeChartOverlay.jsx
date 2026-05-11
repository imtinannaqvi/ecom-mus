import React from "react";

function SizeChartOverlay({ sizeGuide, productType, guideLabel, setSizeGuideOpen }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={() => setSizeGuideOpen(false)}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200"
        >
          ×
        </button>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="space-y-4 lg:w-1/2">
            {/* Header section with product type and measurement instructions */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{sizeGuide.title}</h2>
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                  {productType.toUpperCase()} Reference
                </p>
              </div>
            </div>
            <div className="relative rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <div className="absolute inset-x-6 top-6 h-40 rounded-3xl bg-white shadow-sm" />
              <div className="relative flex h-40 items-center justify-center">
                <div className="h-40 w-36 rounded-3xl border-2 border-dashed border-gray-300 bg-white" />
              {/* Visual guide labels indicating measurement points on garment */}
                <div className="absolute left-4 top-10 text-xs font-semibold uppercase tracking-[0.2em] text-gray-700">
                  {guideLabel[0]}
                </div>
                <div className="absolute right-4 top-10 text-xs font-semibold uppercase tracking-[0.2em] text-gray-700">
                  {guideLabel[1]}
                </div>
                {productType === "jeans" ? (
                  <>
                    <div className="absolute left-8 top-20 text-xs font-semibold uppercase tracking-[0.15em] text-gray-700">
                      {guideLabel[2]}
                    </div>
                    <div className="absolute right-8 top-24 text-xs font-semibold uppercase tracking-[0.15em] text-gray-700">
                      {guideLabel[3]}
                    </div>
                  </>
                ) : (
                  <div className="absolute left-4 bottom-10 text-xs font-semibold uppercase tracking-[0.15em] text-gray-700">
                    {guideLabel[2]}
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">How to measure</p>
              <p>{sizeGuide.note}</p>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white">
              <table className="min-w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50">
                  <tr>
                    {sizeGuide.headers.map((header) => (
                      <th key={header} className="border-b border-gray-200 px-4 py-3 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeGuide.sizes.map((row) => (
                    <tr key={row.size} className="hover:bg-gray-50">
                      {Object.values(row).map((value, index) => (
                        <td key={`${row.size}-${index}`} className="border-b border-gray-100 px-4 py-3">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SizeChartOverlay;
