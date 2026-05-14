import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import CategoriesProduct from "../pages/CategoriesProduct";
import SingleProduct from "../pages/SingleProduct";
import Login from "../pages/Login";
import Register from "../pages/Register";
import OTPVerification from "../pages/OTPVerification";
import ShoppingBag from "../pages/ShoppingBag";
import Checkout from "../pages/Checkout";
import PaymentSuccessfull from "../pages/PaymentSuccessfull";
import Profile from "../pages/ProfilePges/Profile";
import Orders from "../pages/ProfilePges/Orders";
import OrdersDetail from "../pages/ProfilePges/OrdersDetail";
import ProductReviews from "../pages/ProfilePges/ProductReviews";
import TrackOrders from "../pages/ProfilePges/TrackOrders";
import MaurishTouchpoints from "../pages/ProfilePges/MaurishTouchpoints";
import Wishlist from "../pages/ProfilePges/Wishlist";
import Address from "../pages/ProfilePges/Address";
import Payment from "../pages/ProfilePges/Payment";
import Returns from "../pages/ProfilePges/Returns";
import Security from "../pages/ProfilePges/Security";
import Notifications from "../pages/ProfilePges/Notifications";
import Country from "../pages/ProfilePges/Country";
import Language from "../pages/ProfilePges/Language";
import Support from "../pages/ProfilePges/Support";
import LandinPage from "../pages/LandinPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRoute() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/" element={<LandinPage />} />
      <Route path="/shop/:mainCategory" element={<Home />} />
      <Route
        path="/shop/:mainCategory/:subCategory"
        element={<CategoriesProduct />}
      />
      <Route path="/product/:id" element={<SingleProduct />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<OTPVerification />} />

      {/* --- Protected Routes (Login Required) --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/shopping-bag" element={<ShoppingBag />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-successfull" element={<PaymentSuccessfull />} />
        
        {/* Profile and its nested routes */}
        <Route path="/profile" element={<Profile />}>
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrdersDetail />} />
          <Route path="orders/review/:id" element={<ProductReviews />} />
          <Route path="track" element={<TrackOrders />} />
          <Route path="touchpoints" element={<MaurishTouchpoints />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="address" element={<Address />} />
          <Route path="payment" element={<Payment />} />
          <Route path="returns" element={<Returns />} />
          <Route path="security" element={<Security />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="country" element={<Country />} />
          <Route path="language" element={<Language />} />
          <Route path="support" element={<Support />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoute;