import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import OrderList from "./pages/OrderList";
import ProcessOrder from "./pages/ProcessOrder";
import NewProduct from "./pages/NewProduct";
import UserList from "./pages/UserList";
import UpdateProduct from "./pages/UpdateProduct";
import NewCategory from "./pages/NewCategory";
import NewMainCategory from "./pages/NewMainCategory";
import Report from "./pages/Report";
import DashboardLayout from "./DashboardLayout";
import CategoryList from "./pages/CategoryList";
import Notification from "./pages/Notification";
import Setting from "./pages/Setting";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Coupons from './pages/Coupons'
import NewCategoryItem from "./pages/NewCategoryItem";
import Reviews from "./pages/Reviews";
// Baki pages bhi import karein...

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Protected: everything under /admin requires an admin session */}
        <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<DashboardLayout />}>
  {/* Index route ka matlab hai ke jab koi sirf "/admin" par aaye, toh automatically Dashboard dikhe */}
  <Route index element={<Dashboard />} />
  
  {/* Baqi saare child routes ab bina "/admin" prefix ke likhenge kyunki parent ka path "/admin" hai */}
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="products" element={<ProductList />} />
  <Route path="product/new" element={<NewProduct />} />
  <Route path="product/:id" element={<UpdateProduct />} />
  <Route path="category"   element={<CategoryList/>} />
  <Route path="category/new" element={<NewCategory />} />
  <Route path="category/main" element={<NewMainCategory />} />
  <Route path="coupons" element={<Coupons />} />
  <Route path="orders" element={<OrderList />} />
  <Route path="order/:id" element={<ProcessOrder />} />
  <Route path="report" element={<Report />} />
  <Route path="users" element={<UserList />} />
  <Route path='notification' element={<Notification/>} /> 
  <Route path='setting' element={<Setting/>} />
  <Route path="category/item/new" element={<NewCategoryItem />} />
  <Route path="reviews" element={<Reviews />} />

</Route>
        </Route>
      </Routes>

    </Router>
  );
}

export default App;