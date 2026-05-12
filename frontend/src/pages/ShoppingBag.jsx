import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate add kiya
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContextProvider";

const ShoppingBag = () => {
  const { cartItem, setCartItem } = useContext(AppContext);
  const navigate = useNavigate(); // Hook initialize kiya

  // Items state: cartItem se data lekar qty initialize ki
  const [items, setItems] = useState(cartItem.map((i) => ({ ...i, qty: 1 })));
  const [coupon, setCoupon] = useState("");
  const [agreed, setAgreed] = useState(true);

  // Responsive check
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <Header />

      {/* Breadcrumb */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: "10px 24px",
          fontSize: 10,
          color: "#999",
        }}
      >
        <Link to="/cart" style={{ color: "inherit", textDecoration: "none" }}>Cart</Link> /{" "}
        <span style={{ color: "#222", fontWeight: 600 }}>Info</span> / Shipping / Payment
      </div>

      {/* Page Header */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: "14px 24px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
          Checkout Details
        </p>
        <p style={{ fontSize: 12, color: "#777", margin: 0 }}>
          Have An Account?{" "}
          <Link to="/login" style={{ color: "#111", fontWeight: 700, textDecoration: "underline" }}>
            Log In
          </Link>
        </p>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: isMobile ? "15px" : "24px 20px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 20,
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          
          {/* Step Indicators */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e8e8",
              borderRadius: 12,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
              overflow: "hidden",
            }}
          >
            {/* Step 1: Address (Active) */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRight: !isMobile ? "1px solid #eee" : "none", background: "#fff" }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>📍</div>
              <div>
                <div style={{ fontSize: 9, textTransform: "uppercase", color: "#aaa" }}>Address</div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>Step 1</div>
              </div>
            </div>
            {/* Step 2: Payment (Active) */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRight: !isMobile ? "1px solid #eee" : "none", background: "#fff" }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>💳</div>
              <div>
                <div style={{ fontSize: 9, textTransform: "uppercase", color: "#aaa" }}>Payment</div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>Step 2</div>
              </div>
            </div>
            {/* Step 3: Review */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "#fafafa" }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>📝</div>
              <div>
                <div style={{ fontSize: 9, textTransform: "uppercase", color: "#aaa" }}>Review</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa" }}>Step 3</div>
              </div>
            </div>
          </div>

          {/* Delivery Note */}
          <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 16 }}>🚚</div>
            <span style={{ fontSize: 13, color: "#555" }}>
              Estimated Delivery: <strong style={{ color: "#111" }}>15 May 2026</strong>
            </span>
          </div>

          {/* Cart Items */}
          <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: isMobile ? 15 : 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 15 }}>Items in Bag ({items.length})</h3>
            {items.map((item, idx) => (
              <div key={item.id} style={{ paddingBottom: 18, marginBottom: idx < items.length - 1 ? 18 : 0, borderBottom: idx < items.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <img src={item.images} alt={item.title} style={{ width: 80, height: 80, borderRadius: 8, objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</div>
                      <button onClick={() => removeItem(item.id)} style={{ border: "none", background: "none", color: "#c0392b", fontSize: 18, cursor: "pointer" }}>×</button>
                    </div>
                    <div style={{ fontSize: 11, color: "#999" }}>Size: {item.size} | Color: {item.color}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>₹{item.price * item.qty}</div>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid #e8e8e8", borderRadius: 20, background: "#fafafa" }}>
                        <button onClick={() => updateQty(item.id, -1)} style={{ width: 28, border: "none", background: "none", cursor: "pointer" }}>−</button>
                        <span style={{ width: 24, textAlign: "center", fontSize: 12 }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} style={{ width: 28, border: "none", background: "none", cursor: "pointer" }}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Address & Payment (Ab click par redirect karega) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: "14px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 9, textTransform: "uppercase", color: "#aaa", marginBottom: 6 }}>Shipping Address</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Brooklyn Simmons</div>
                  <div style={{ fontSize: 12, color: "#777" }}>2972 Westheimer Rd, Illinois 85486</div>
                </div>
                {/* Yahan redirect logic lagaya */}
                <button 
                  onClick={() => navigate("/checkout")} 
                  style={{ fontSize: 11, padding: "5px 12px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}
                >
                  Edit
                </button>
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: "14px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 9, textTransform: "uppercase", color: "#aaa", marginBottom: 6 }}>Payment Method</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Debit Card (**** 6378)</div>
                  <div style={{ fontSize: 11, color: "#22c55e" }}>Verified & Secured</div>
                </div>
                {/* Yahan redirect logic lagaya */}
                <button 
                  onClick={() => navigate("/checkout")} 
                  style={{ fontSize: 11, padding: "5px 12px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ width: isMobile ? "100%" : "320px", background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: 20, alignSelf: "start", position: isMobile ? "static" : "sticky", top: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
            <span style={{ fontSize: 13, color: "#888" }}>Subtotal</span>
            <span style={{ fontSize: 16, fontWeight: 700 }}>₹{subtotal}</span>
          </div>

          {/* Coupon */}
          <div style={{ background: "#f8f8f8", border: "1px solid #eee", borderRadius: 10, padding: 12, marginBottom: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 11 }}>
              <span style={{ color: "#666" }}>Coupon Code</span>
              <span style={{ color: "#22c55e", fontWeight: 700, cursor: "pointer" }}>Offers</span>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="PROMO10" style={{ flex: 1, border: "1px solid #ddd", borderRadius: 6, padding: "6px 10px", fontSize: 12 }} />
              <button style={{ padding: "6px 12px", borderRadius: 6, background: "#111", color: "#fff", fontSize: 11, cursor: "pointer", border: "none" }}>Apply</button>
            </div>
          </div>

          {/* Total */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#888" }}>Delivery</span>
              <span style={{ fontWeight: 600, color: "#22c55e" }}>FREE</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, borderTop: "1px solid #eee", paddingTop: 10 }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontWeight: 800 }}>₹{subtotal}</span>
            </div>
          </div>

          {/* Terms */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 15 }}>
            <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} style={{ cursor: "pointer" }} />
            <span style={{ fontSize: 11, color: "#555" }}>I agree to the <strong>Terms</strong> and <strong>Return Policy</strong>.</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            disabled={!agreed}
            style={{ width: "100%", padding: "14px 0", background: agreed ? "#111" : "#ccc", color: "#fff", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: agreed ? "pointer" : "not-allowed", border: "none" }}
          >
            Confirm Order
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShoppingBag;