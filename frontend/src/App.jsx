import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "./styles/styles.css";
import AppRoutes from "./routes/AppRoutes.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { FlashProvider } from "./context/FlashContext";
import FlashMessage from "./components/FlashMessage";

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-black text-white">
        <FlashProvider>
          <FlashMessage />
          <AppRoutes />
        </FlashProvider>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
};

export default App;
