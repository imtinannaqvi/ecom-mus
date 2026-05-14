import { useContext } from "react";
import { AppContext } from "../context/AppContextProvider";
import { Navigate, Outlet } from "react-router-dom";

// ProtectedRoute.jsx
const ProtectedRoute = () => {
  const { user, loading } = useContext(AppContext);

  if (loading) {
    return <p>Loading your profile...</p>; // Yahan spinner dikhao
  }

  // Agar loading khatam ho gayi aur user nahi mila, tab login bhejo
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
