import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContextProvider";


const ShoppingBag = () => {
  const {cartItem ,setCartItem} = useContext(AppContext)

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
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item,
      ),
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
          mdFontSize: 12,
          color: "#999",
        }}
      >
        Cart / <span style={{ color: "#222", fontWeight: 600 }}>Info</span> /
        Shipping / Payment
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
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#111",
            margin: 0,
          }}
        >
          Checkout Details
        </p>
        <p style={{ fontSize: 12, color: "#777", margin: 0 }}>
          Have An Account?{" "}
          <Link
            to="/login"
            style={{
              color: "#111",
              fontWeight: 700,
              textDecoration: "underline",
            }}
          >
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
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}
        >
          {/* Step Indicators - Responsive Grid */}
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
            {[
              {
                label: "Address",
                step: 1,
                active: true,
                done: true,
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 24V20"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M13.4264 3.75996L4.18637 11.16C3.14637 11.9866 2.4797 13.7333 2.70637 15.04L4.4797 25.6533C4.7997 27.5466 6.61304 29.08 8.53304 29.08H23.4664C25.373 29.08 27.1997 27.5333 27.5197 25.6533L29.293 15.04C29.5064 13.7333 28.8397 11.9866 27.813 11.16L18.573 3.7733C17.1464 2.62663 14.8397 2.62663 13.4264 3.75996Z"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ),
              },
              {
                label: "Payment Method",
                step: 2,
                active: true,
                done: false,
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.66602 11.3398H29.3327"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M8 22.0066H10.6667"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14 22.0066H19.3333"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M8.58602 4.67334H23.3993C28.146 4.67334 29.3327 5.84667 29.3327 10.5267V21.4733C29.3327 26.1533 28.146 27.3267 23.4127 27.3267H8.58602C3.85268 27.34 2.66602 26.1667 2.66602 21.4867V10.5267C2.66602 5.84667 3.85268 4.67334 8.58602 4.67334Z"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ),
              },
              {
                label: "Review",
                step: 3,
                active: false,
                done: false,
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M29.3327 13.3334V20.0001C29.3327 26.6667 26.666 29.3334 19.9993 29.3334H11.9993C5.33268 29.3334 2.66602 26.6667 2.66602 20.0001V12.0001C2.66602 5.33341 5.33268 2.66675 11.9993 2.66675H18.666"
                      stroke="#292D32"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M29.3327 13.3334H23.9993C19.9993 13.3334 18.666 12.0001 18.666 8.00008V2.66675L29.3327 13.3334Z"
                      stroke="#292D32"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.33398 17.3333H17.334"
                      stroke="#292D32"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.33398 22.6667H14.6673"
                      stroke="#292D32"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ),
              },
            ].map((s, idx) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 16px",
                  borderRight: !isMobile && idx < 2 ? "1px solid #eee" : "none",
                  borderBottom: isMobile && idx < 2 ? "1px solid #eee" : "none",
                  background: s.active ? "#fff" : "#fafafa",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: s.active ? "#111" : "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: s.active ? "#fff" : "#aaa",
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#aaa",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: s.active ? "#111" : "#aaa",
                    }}
                  >
                    Step {s.step}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Note */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e8e8",
              borderRadius: 12,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 16 }}>🚚</div>
            <span style={{ fontSize: 13, color: "#555" }}>
              Estimated Delivery:{" "}
              <strong style={{ color: "#111" }}>15 May 2025</strong>
            </span>
          </div>

          {/* Cart Items */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e8e8",
              borderRadius: 12,
              padding: isMobile ? 15 : 20,
            }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 15 }}>
              Items in Bag ({items.length})
            </h3>
            {items.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  paddingBottom: 18,
                  marginBottom: idx < items.length - 1 ? 18 : 0,
                  borderBottom:
                    idx < items.length - 1 ? "1px solid #f0f0f0" : "none",
                }}
              >
                <div style={{ display: "flex", gap: 14 }}>
                  <img
                    src={item.images}
                    alt={item.title}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#111",
                          marginBottom: 4,
                          maxWidth: "80%",
                        }}
                      >
                        {item.title}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          border: "none",
                          background: "none",
                          color: "#c0392b",
                          fontSize: 18,
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ fontSize: 11, color: "#999" }}>
                      Size:{" "}
                      <strong style={{ color: "#555" }}>{item.size}</strong>{" "}
                      &nbsp; Color:{" "}
                      <strong style={{ color: "#555" }}>{item.color}</strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 12,
                      }}
                    >
                      <div
                        style={{ fontSize: 16, fontWeight: 700, color: "#111" }}
                      >
                        ₹{item.price * item.qty}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #e8e8e8",
                          borderRadius: 20,
                          overflow: "hidden",
                          background: "#fafafa",
                        }}
                      >
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          style={{
                            width: 28,
                            height: 28,
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            width: 24,
                            textAlign: "center",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          style={{
                            width: 28,
                            height: 28,
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Address & Payment Layout (Stacked) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e8e8e8",
                borderRadius: 12,
                padding: "14px 18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#aaa",
                      marginBottom: 6,
                    }}
                  >
                    Shipping Address
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
                    Brooklyn Simmons
                  </div>
                  <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>
                    2972 Westheimer Rd, Illinois 85486
                  </div>
                </div>
                <button
                  style={{
                    fontSize: 11,
                    padding: "5px 12px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e8e8e8",
                borderRadius: 12,
                padding: "14px 18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#aaa",
                      marginBottom: 6,
                    }}
                  >
                    Payment Method
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
                    Debit Card (**** 6378)
                  </div>
                  <div style={{ fontSize: 11, color: "#22c55e", marginTop: 2 }}>
                    Verified & Secured
                  </div>
                </div>
                <button
                  style={{
                    fontSize: 11,
                    padding: "5px 12px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div
          style={{
            width: isMobile ? "100%" : "320px",
            background: "#fff",
            border: "1px solid #e8e8e8",
            borderRadius: 12,
            padding: 20,
            alignSelf: "start",
            position: isMobile ? "static" : "sticky",
            top: 20,
            boxSizing: "border-box",
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>
            Order Summary
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 15,
            }}
          >
            <span style={{ fontSize: 13, color: "#888" }}>Subtotal</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>
              ₹{subtotal}
            </span>
          </div>

          <div
            style={{
              background: "#f8f8f8",
              border: "1px solid #eee",
              borderRadius: 10,
              padding: 12,
              marginBottom: 15,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 11, color: "#666" }}>Coupon Code</span>
              <span
                style={{
                  fontSize: 11,
                  color: "#22c55e",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Offers
              </span>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="PROMO10"
                style={{
                  flex: 1,
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  padding: "6px 10px",
                  fontSize: 12,
                  outline: "none",
                }}
              />
              <button
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: "#111",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Apply
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
              }}
            >
              <span style={{ color: "#888" }}>Delivery</span>
              <span style={{ fontWeight: 600, color: "#22c55e" }}>FREE</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 15,
                borderTop: "1px solid #eee",
                paddingTop: 10,
                marginTop: 5,
              }}
            >
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontWeight: 800, color: "#111" }}>
                ₹{subtotal}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              marginBottom: 15,
            }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              style={{ marginTop: 3, cursor: "pointer" }}
            />
            <span style={{ fontSize: 11, color: "#555", lineHeight: "1.4" }}>
              I agree to the <strong>Terms</strong> and{" "}
              <strong>Return Policy</strong>.
            </span>
          </div>

          <Link
            to="/checkout"
            style={{
              display: "block",
              width: "100%",
              padding: "14px 0",
              background: agreed ? "#111" : "#ccc",
              color: "#fff",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              textAlign: "center",
              textDecoration: "none",
              pointerEvents: agreed ? "auto" : "none",
              transition: "0.3s",
            }}
          >
            Confirm Order
          </Link>

          <div
            style={{
              marginTop: 20,
              textAlign: "center",
              borderTop: "1px solid #eee",
              paddingTop: 15,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "#bbb",
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              Secure Checkout
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                justifyContent: "center",
              }}
            >
              {["VISA", "MC", "UPI", "COD"].map((b) => (
                <span
                  key={b}
                  style={{
                    border: "1px solid #eee",
                    padding: "2px 6px",
                    fontSize: 10,
                    borderRadius: 4,
                    color: "#666",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShoppingBag;
