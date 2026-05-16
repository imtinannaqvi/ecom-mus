import { 
  FiMoreHorizontal, 
  FiArrowUpRight, 
  FiArrowDownRight, 
  FiSliders, 
  FiMoreVertical 
} from 'react-icons/fi';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

function Report() {
  // 1. Mock Data for Revenue Line Chart
const revenueData = [
  { name: 'Jan', currentWeek: 13, previousWeek: 8 },
  { name: 'Feb', currentWeek: 8, previousWeek: 17 },
  { name: 'Mar', currentWeek: 11, previousWeek: 14 },
  { name: 'Apr', currentWeek: 17, previousWeek: 10 },
  { name: 'May', currentWeek: 21, previousWeek: 16 },
  { name: 'Jun', currentWeek: 20, previousWeek: 24 },
];

  // 2. Mock Data for Total Sales Donut Chart
  const salesDistribution = [
    { name: 'Direct', value: 300.56, color: '#1E3A8A' },
    { name: 'Affiliate', value: 135.18, color: '#0EA5E9' },
    { name: 'Sponsored', value: 154.02, color: '#635BFF' },
    { name: 'E-mail', value: 48.96, color: '#10B981' },
  ];

  // 3. Top Selling Products Data
  const topProducts = [
    { name: 'Shirt', price: '$76.89', category: 'Man Cloths', qty: 128, amount: '$6,647.15', img: 'https://placehold.co/40x40/e2e8f0/64748b?text=Shirt' },
    { name: 'T-Shirt', price: '$79.80', category: 'Women Cloths', qty: 89, amount: '$6,647.15', img: 'https://placehold.co/40x40/e2e8f0/64748b?text=TShirt' },
    { name: 'Pant', price: '$86.65', category: 'Kid Cloths', qty: 74, amount: '$6,647.15', img: 'https://placehold.co/40x40/e2e8f0/64748b?text=Pant' },
    { name: 'Sweater', price: '$56.07', category: 'Man Cloths', qty: 69, amount: '$6,647.15', img: 'https://placehold.co/40x40/e2e8f0/64748b?text=Sweater' },
    { name: 'Light Jacket', price: '$36.00', category: 'Women Cloths', qty: 65, amount: '$6,647.15', img: 'https://placehold.co/40x40/e2e8f0/64748b?text=Jacket' },
    { name: 'Half Shirt', price: '$46.78', category: 'Man Cloths', qty: 58, amount: '$6,647.15', img: 'https://placehold.co/40x40/e2e8f0/64748b?text=HShirt' },
  ];

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      
      {/* ================= TOP METRIC CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative">
          <div className="flex justify-between items-center text-gray-400 text-sm font-medium mb-2">
            <span>Total Sales</span>
            <FiMoreHorizontal className="cursor-pointer text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E1B4B] mb-3">$34.456.00</h2>
          <div className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#15803D] text-xs font-bold px-2 py-0.5 rounded-md">
            <FiArrowUpRight /> 14%
          </div>
          <span className="text-gray-400 text-xs ml-2 font-medium">in the last month</span>
        </div>

        {/* Total Order */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative">
          <div className="flex justify-between items-center text-gray-400 text-sm font-medium mb-2">
            <span>Total Order</span>
            <FiMoreHorizontal className="cursor-pointer text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E1B4B] mb-3">3456</h2>
          <div className="inline-flex items-center gap-1 bg-[#FEE2E2] text-[#B91C1C] text-xs font-bold px-2 py-0.5 rounded-md">
            <FiArrowDownRight /> 17%
          </div>
          <span className="text-gray-400 text-xs ml-2 font-medium">in the last month</span>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative">
          <div className="flex justify-between items-center text-gray-400 text-sm font-medium mb-2">
            <span>Total Revenue</span>
            <FiMoreHorizontal className="cursor-pointer text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E1B4B] mb-3">$1.456.00</h2>
          <div className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#15803D] text-xs font-bold px-2 py-0.5 rounded-md">
            <FiArrowUpRight /> 14%
          </div>
          <span className="text-gray-400 text-xs ml-2 font-medium">in the last month</span>
        </div>

        {/* Total Customer */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative">
          <div className="flex justify-between items-center text-gray-400 text-sm font-medium mb-2">
            <span>Total Customer</span>
            <FiMoreHorizontal className="cursor-pointer text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E1B4B] mb-3">42.456</h2>
          <div className="inline-flex items-center gap-1 bg-[#FEE2E2] text-[#B91C1C] text-xs font-bold px-2 py-0.5 rounded-md">
            <FiArrowDownRight /> 11%
          </div>
          <span className="text-gray-400 text-xs ml-2 font-medium">in the last month</span>
        </div>

      </div>

      {/* ================= MIDDLE SECTION: CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Revenue Analytics Curve Chart (7 Cols) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-base text-[#1E1B4B]">Revenue</h3>
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Current Week <strong className="text-gray-800">$58,211</strong>
                </span>
                <span className="flex items-center gap-1.5 text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#635BFF]"></span> Previous Week <strong className="text-gray-800">$68,768</strong>
                </span>
              </div>
            </div>
          </div>
          
          <div className="w-full h-64 text-xs text-gray-400">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(val) => `${val}M`} ticks={[0, 10, 20, 30]} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="currentWeek" stroke="#10B981" strokeWidth={2.5} fill="transparent" />
                <Area type="monotone" dataKey="previousWeek" stroke="#635BFF" strokeWidth={2.5} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Location (3 Cols) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-[#1E1B4B] mb-3">Sales By Location</h3>
            {/* World map layout reference mock placeholder */}
            <div className="h-28 bg-gray-50 rounded-xl relative overflow-hidden mb-4 border border-gray-100/50 flex items-center justify-center">
              <span className="text-xs text-gray-400 font-medium">Geographic Overlay Matrix</span>
              {/* Dot indicators mimicking specific map pointers */}
              <span className="absolute w-2 h-2 rounded-full bg-[#635BFF] top-1/3 left-1/4 animate-ping"></span>
              <span className="absolute w-1.5 h-1.5 rounded-full bg-[#635BFF] top-1/3 left-1/4"></span>
              <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-700 bottom-1/4 right-1/3"></span>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { city: "New York", amount: "72K", fill: "w-[75%] bg-[#635BFF]" },
              { city: "San Francisco", amount: "39K", fill: "w-[45%] bg-[#635BFF]" },
              { city: "Sydney", amount: "25K", fill: "w-[30%] bg-[#635BFF]" },
              { city: "Singapore", amount: "61K", fill: "w-[65%] bg-[#635BFF]" },
            ].map((loc, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between font-medium text-gray-700 mb-1">
                  <span>{loc.city}</span>
                  <span>{loc.amount}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${loc.fill}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Sales Donut Chart (3 Cols) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-3 flex flex-col justify-between">
          <h3 className="font-bold text-base text-[#1E1B4B]">Total Sales</h3>
          
          <div className="relative h-32 my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesDistribution}
                  innerRadius={36}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {salesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* 38.6% tooltip pill indicator mockup center-aligned */}
            <div className="absolute bg-[#1E293B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-md bottom-3">
              38.6%
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-xs">
            {salesDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between pr-2">
                <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-semibold text-gray-800">${item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ================= BOTTOM SECTION: TABLE & MONTHLY TARGET ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Selling Products List (8 Cols) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm lg:col-span-8 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#1E1B4B]">Top Selling Products</h3>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-50 transition">
                  <FiSliders className="text-gray-400" /> Filter
                </button>
                <button className="border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-50 transition">
                  See All
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 text-gray-400 font-semibold bg-gray-50/40">
                    <th className="p-3 pl-5 w-10">
                      <input type="checkbox" className="rounded border-gray-300 text-[#635BFF] focus:ring-[#635BFF]" />
                    </th>
                    <th className="p-3 font-medium">Product Name</th>
                    <th className="p-3 font-medium">Price</th>
                    <th className="p-3 font-medium">Category</th>
                    <th className="p-3 font-medium">Quantity</th>
                    <th className="p-3 font-medium">Amount</th>
                    <th className="p-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[13px] font-medium text-gray-700">
                  {topProducts.map((p, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 pl-5">
                        <input type="checkbox" className="rounded border-gray-300 text-[#635BFF] focus:ring-[#635BFF]" />
                      </td>
                      <td className="p-3 text-[#1E293B]">
                        <div className="flex items-center gap-2.5">
                          <img src={p.img} alt={p.name} className="w-7 h-7 rounded-lg object-cover border border-gray-100 bg-gray-50" />
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-500">{p.price}</td>
                      <td className="p-3 text-gray-500">{p.category}</td>
                      <td className="p-3 text-gray-800">{p.qty}</td>
                      <td className="p-3 text-[#1E293B] font-semibold">{p.amount}</td>
                      <td className="p-3 text-center">
                        <button className="text-gray-400 hover:text-gray-700 p-1 rounded transition">
                          <FiMoreVertical />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Monthly Target Gauge Control (4 Cols) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="font-bold text-base text-[#1E1B4B]">Monthly Target</h3>
              <p className="text-gray-400 text-xs mt-0.5">Target you've set for each month</p>
            </div>
            <button className="text-gray-400 hover:text-gray-700 p-1"><FiMoreVertical /></button>
          </div>

          {/* Semicircular Gauge Chart Arc Mock */}
          <div className="relative flex flex-col items-center justify-center pt-4">
            <svg width="180" height="100" viewBox="0 0 180 100" className="overflow-visible">
              {/* Background Arc Track */}
              <path d="M20,90 A70,70 0 0,1 160,90" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
              {/* Filled Arc Target Indicator */}
              <path d="M20,90 A70,70 0 0,1 145,45" fill="none" stroke="#635BFF" strokeWidth="12" strokeLinecap="round" strokeDasharray="220" strokeDashoffset="50" />
            </svg>
            
            <div className="absolute top-10 flex flex-col items-center">
              <span className="text-2xl font-bold text-[#1E1B4B]">75.34%</span>
              <span className="bg-[#E0F2FE] text-[#0369A1] text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1">
                +12%
              </span>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 font-medium px-4 mb-4">
            You earn <span className="text-gray-800 font-semibold">$3267</span> today, its higher than last month keep up your good trends!
          </div>

          <div className="border-t border-gray-50 pt-3 grid grid-cols-3 text-center text-xs">
            <div>
              <span className="text-gray-400 block mb-1 font-medium">Target</span>
              <span className="font-bold text-[#1E293B] flex items-center justify-center gap-0.5">$25k <FiArrowDownRight className="text-red-500" /></span>
            </div>
            <div className="border-x border-gray-100">
              <span className="text-gray-400 block mb-1 font-medium">Revenue</span>
              <span className="font-bold text-[#1E293B] flex items-center justify-center gap-0.5">$18k <FiArrowUpRight className="text-green-500" /></span>
            </div>
            <div>
              <span className="text-gray-400 block mb-1 font-medium">Today</span>
              <span className="font-bold text-[#1E293B] flex items-center justify-center gap-0.5">$1.8k <FiArrowUpRight className="text-green-500" /></span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Report;