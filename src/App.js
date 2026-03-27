import { BrowserRouter, Routes, Route } from "react-router-dom";
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

  // 🔒 If not logged in → show login page only
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <BrowserRouter>
      <div style={{ padding: "20px" }}>
        <Routes>

          {/* Menu Page */}
          <Route path="/" element={<MenuPage />} />

          {/* Test Page */}
          <Route path="/test/:tradeId" element={<TestPage />} />

          {/* Admin Page */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Result Page */}
          <Route path="/result" element={<ResultPage />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;