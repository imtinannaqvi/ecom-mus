import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrder } from "../../services/orderService";

/*
  POINTS RULE
  -----------
  There is no points field on the backend yet, so points are derived from the
  user's real order history:

    • Every Rs. 10 spent on an item  → +1 point
    • Cancelled orders               → those points are deducted (negative)

  When you add a proper `points` / `pointsLedger` collection server-side, swap
  the derivation below for a direct fetch — the rest of this component won't
  need to change.
*/
const RUPEES_PER_POINT = 10;

const pointsForLine = (item) => {
  const lineTotal = (Number(item.price) || 0) * (Number(item.quantity) || 0);
  return Math.floor(lineTotal / RUPEES_PER_POINT);
};

const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "—";

function MaurishTouchpoints() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getOrder();
        const orders = res?.orders || (Array.isArray(res) ? res : []);

        // Flatten every order into one ledger entry per purchased item.
        const ledger = [];

        orders.forEach((order) => {
          const cancelled = order.orderStatus === "Cancelled";

          (order.orderItems || []).forEach((item) => {
            const product = item.productId || {};
            const earned = pointsForLine(item);
            if (earned === 0) return;

            ledger.push({
              id: `${order._id}-${product._id || item._id || Math.random()}`,
              name: product.name || "Product",
              date: order.createdAt,
              // Cancelled orders take the points back off the balance.
              points: cancelled ? -earned : earned,
              status: order.orderStatus,
              cancelled,
            });
          });
        });

        // Newest first.
        ledger.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(ledger);
      } catch (err) {
        console.error("Failed to load points history:", err.message);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalPoints = transactions.reduce((sum, t) => sum + t.points, 0);
  const earned = transactions
    .filter((t) => t.points > 0)
    .reduce((sum, t) => sum + t.points, 0);
  const deducted = transactions
    .filter((t) => t.points < 0)
    .reduce((sum, t) => sum + Math.abs(t.points), 0);
  const itemsBought = transactions.filter((t) => !t.cancelled).length;

  return (
    <div className="flex items-start justify-center p-4">
      {/* Main Card Container */}
      <div className="relative w-full max-w-2xl bg-black text-white rounded-xl overflow-hidden p-6 sm:p-8 pt-14 sm:pt-16">

        {/* Left and Right "Cut-out" effect circles */}
        <div className="absolute top-1/4 -left-6 w-12 h-12 bg-white rounded-full" />
        <div className="absolute top-1/4 -right-6 w-12 h-12 bg-white rounded-full" />

        <div className="w-full flex items-center justify-center mb-5">
          <img src="/images/footer-logo.png" alt="Maurish" className="h-8 object-contain" />
        </div>

        {/* ── Available Points ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 text-gray-400 mb-4">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span className="uppercase tracking-widest text-xs font-semibold">
              Available Points
            </span>
          </div>

          {/* Points Box with Dashed Border */}
          <div className="w-full border border-dashed border-gray-600 rounded-lg py-3 text-center">
            {loading ? (
              <div className="flex justify-center py-1">
                <div className="w-5 h-5 border-2 border-gray-700 border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              <h1 className="text-xl font-bold tracking-[0.4em] sm:tracking-[0.5em]">
                {totalPoints.toLocaleString()}
              </h1>
            )}
          </div>
        </div>

        {/* ── Lifetime summary ── */}
        {!loading && transactions.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="border border-gray-800 rounded-lg py-3 text-center">
              <p className="text-base font-bold text-emerald-400">+{earned.toLocaleString()}</p>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 mt-0.5">Earned</p>
            </div>
            <div className="border border-gray-800 rounded-lg py-3 text-center">
              <p className="text-base font-bold text-red-400">-{deducted.toLocaleString()}</p>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 mt-0.5">Deducted</p>
            </div>
            <div className="border border-gray-800 rounded-lg py-3 text-center">
              <p className="text-base font-bold">{itemsBought}</p>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 mt-0.5">Items</p>
            </div>
          </div>
        )}

        {/* ── Transaction History ── */}
        <div className="space-y-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold">Transaction History</h2>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">
              Rs. {RUPEES_PER_POINT} = 1 pt
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-gray-700 border-t-white rounded-full animate-spin" />
            </div>
          ) : transactions.length > 0 ? (
            transactions.map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-800 pb-4 flex justify-between items-center gap-3"
              >
                <div className="min-w-0">
                  <h3 className="text-sm font-medium truncate">
                    {item.cancelled ? "Refunded" : "Purchased"} {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(item.date)}
                    {item.status && (
                      <span className="ml-2 text-gray-600">· {item.status}</span>
                    )}
                  </p>
                </div>
                <div
                  className={`text-sm font-bold shrink-0 ${
                    item.points >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {item.points >= 0 ? "+" : ""}
                  {item.points}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-400">No points activity yet</p>
              <p className="text-xs text-gray-600 mt-1">
                Earn points every time you shop with us.
              </p>
              <Link
                to="/shop/men"
                className="inline-block mt-5 px-6 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MaurishTouchpoints;