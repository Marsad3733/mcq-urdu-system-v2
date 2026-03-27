import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import MenuPage from "./pages/MenuPage";
import TestPage from "./pages/TestPage";
import AdminPage from "./pages/AdminPage";
import ResultPage from "./pages/ResultPage";
import LoginPage from "./pages/LoginPage";

import "./App.css";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check login on app start
  useEffect(() => {
    const login = localStorage.getItem("isLoggedIn");
    if (login === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <div style={{ padding: "20px" }}>

        <Routes>

          {/* 🔐 Login Route */}
          <Route 
            path="/login" 
            element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} 
          />

          {/* 🔒 Protected Routes */}
          <Route 
            path="/" 
            element={isLoggedIn ? <MenuPage /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/test/:tradeId" 
            element={isLoggedIn ? <TestPage /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/admin" 
            element={isLoggedIn ? <AdminPage /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/result" 
            element={isLoggedIn ? <ResultPage /> : <Navigate to="/login" />} 
          />

        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;