import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppContextProvider from "./context/AppContextProvider.jsx";
import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppContextProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AppContextProvider>
  </StrictMode>,
);
