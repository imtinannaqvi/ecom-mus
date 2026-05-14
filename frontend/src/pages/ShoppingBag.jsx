import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";

const ShoppingBag = () => {
  const { cartItems, removeFromCart, addToCart, cartLoading } = useContext(CartContext);
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:3000";

  const [agreed, setAgreed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Responsive logic
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 1. Quantity Update (Backend Sync)
  const handleUpdateQty = async (item, delta) => {
    if (item.quantity === 1 && delta === -1) return;

    await addToCart({
      productId: item.productId?._id || item.productId,
      quantity: delta, 
      size: item.size,
      color: item.color
    });
  };

  // 2. Remove Item (Fixed to prevent loops)
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      await removeFromCart(id);
    }
  };

  // 3. Subtotal calculation
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  if (cartLoading && cartItems.length === 0) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p>Loading your bag...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "'Segoe UI', sans-serif" }}>
      <Header />

      {/* Breadcrumb */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "10px 24px", fontSize: 10, color: "#999" }}>
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link> /{" "}
        <span style={{ color: "#222", fontWeight: 600 }}>Shopping Bag</span>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "15px" : "24px 20px", display: "flex", flexDirection: isMobile ? "column" : "row", gap: 20 }}>
        
        {/* LEFT COLUMN: Items */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          
          {/* Progress Steps UI */}
          <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", overflow: "hidden" }}>
            <div style={{ padding: "15px", background: "#f0f0f0", borderRight: "1px solid #e8e8e8", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#111", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 10 }}>1</div>
              <span style={{ fontSize: 12, fontWeight: 700 }}>Bag</span>
            </div>
            <div style={{ padding: "15px", borderRight: "1px solid #e8e8e8", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: "1px solid #ccc", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 10, color: "#999" }}>2</div>
              <span style={{ fontSize: 12, color: "#999" }}>Shipping</span>
            </div>
            <div style={{ padding: "15px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: "1px solid #ccc", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 10, color: "#999" }}>3</div>
              <span style={{ fontSize: 12, color: "#999" }}>Payment</span>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: isMobile ? 15 : 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 15 }}>Items ({cartItems.length})</h3>
            
            {cartItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{ color: "#888", marginBottom: 10 }}>Your bag is empty.</p>
                <Link to="/" style={{ color: "#111", fontWeight: 700, fontSize: 13, textDecoration: "underline" }}>Continue Shopping</Link>
              </div>
            ) : (
              cartItems.map((item, idx) => {
                const product = item.productId || {};
                
                // SAFE IMAGE LOGIC (Infinite Loop Proof)
                let imgSource = "https://placehold.co/150x150?text=No+Image"; 
                if (product.images && product.images.length > 0) {
                  const rawImg = product.images[0];
                  const path = typeof rawImg === "object" ? rawImg.url : rawImg;
                  if (path && typeof path === "string") {
                    imgSource = path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
                  }
                }

                return (
                  <div key={item._id || `item-${idx}`} style={{ paddingBottom: 18, marginBottom: idx < cartItems.length - 1 ? 18 : 0, borderBottom: idx < cartItems.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                    <div style={{ display: "flex", gap: 14 }}>
                      <img 
                        src={imgSource} 
                        alt={product.name} 
                        style={{ width: 85, height: 85, borderRadius: 8, objectFit: "cover", background: "#f9f9f9" }} 
                        onError={(e) => { 
                          e.target.onerror = null; // Crucial: stops the loop
                          e.target.src = "https://placehold.co/150x150?text=Error"; 
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{product.name || "Unknown Product"}</div>
                          <button onClick={() => handleRemove(item._id)} style={{ border: "none", background: "none", color: "#c0392b", fontSize: 20, cursor: "pointer", padding: "0 5px" }}>×</button>
                        </div>
                        <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
                          {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12 }}>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>₹{(product.price || 0) * item.quantity}</div>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e8e8e8", borderRadius: 20, background: "#fafafa" }}>
                            <button onClick={() => handleUpdateQty(item, -1)} style={{ width: 30, height: 30, border: "none", background: "none", cursor: "pointer", fontSize: 16 }}>−</button>
                            <span style={{ width: 24, textAlign: "center", fontSize: 12, fontWeight: 600 }}>{item.quantity}</span>
                            <button onClick={() => handleUpdateQty(item, 1)} style={{ width: 30, height: 30, border: "none", background: "none", cursor: "pointer", fontSize: 16 }}>+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🚚</span>
            <span style={{ fontSize: 12, color: "#555" }}>Free standard delivery on all orders.</span>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ width: isMobile ? "100%" : "340px", alignSelf: "start", position: isMobile ? "static" : "sticky", top: 20 }}>
          <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#888" }}>Subtotal</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>₹{subtotal}</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#888" }}>Shipping</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#22c55e" }}>FREE</span>
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: 15, marginTop: 15, display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Total (GST included)</span>
              <span style={{ fontWeight: 800, fontSize: 18 }}>₹{subtotal}</span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 20 }}>
              <input 
                type="checkbox" 
                id="agree"
                checked={agreed} 
                onChange={() => setAgreed(!agreed)} 
                style={{ cursor: "pointer", marginTop: 3 }} 
              />
              <label htmlFor="agree" style={{ fontSize: 11, color: "#666", lineHeight: "1.4", cursor: "pointer" }}>
                By checking this, I agree to the <b>Terms & Conditions</b> and Privacy Policy.
              </label>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              disabled={!agreed || cartItems.length === 0}
              style={{ 
                width: "100%", 
                padding: "16px 0", 
                background: (agreed && cartItems.length > 0) ? "#111" : "#ccc", 
                color: "#fff", 
                borderRadius: 10, 
                fontSize: 13, 
                fontWeight: 700, 
                cursor: (agreed && cartItems.length > 0) ? "pointer" : "not-allowed", 
                border: "none",
                transition: "background 0.3s"
              }}
            >
              Secure Checkout
            </button>
          </div>

          <div style={{ marginTop: 15, textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "#999" }}>We accept all major credit cards and UPI.</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <Footer />
      </div>
    </div>
  );
};

export default ShoppingBag;