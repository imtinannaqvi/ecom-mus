import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import OrderList from "./pages/OrderList";
import ProcessOrder from "./pages/ProcessOrder";
import NewProduct from "./pages/NewProduct";
import UserList from "./pages/UserList";
import UpdateProduct from "./pages/UpdateProduct";
// Baki pages bhi import karein...

function App() {
  return (
    <Router>
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />

        <div className="flex-1 ml-64 p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/order/:id" element={<ProcessOrder />} />
            <Route path="/admin/product/new" element={<NewProduct />} />
            <Route path="/admin/orders" element={<OrderList />} />
            <Route path="/admin/users"  element={<UserList/>} />
            <Route  path="/admin/product/:id" element={<UpdateProduct />} />
          </Routes> 
        </div>
      </div>
    </Router>
  );
}

export default App;
