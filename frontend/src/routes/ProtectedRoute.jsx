import { useContext } from "react";
import { AppContext } from "../context/AppContextProvider";
import { Navigate, Outlet } from "react-router-dom";

// ProtectedRoute.jsx
const ProtectedRoute = () => {
  const { user, loading } = useContext(AppContext);

  if (loading) {
   return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" /></div>; // Yahan spinner dikhao
  }

  // Agar loading khatam ho gayi aur user nahi mila, tab login bhejo
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
