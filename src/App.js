import { BrowserRouter, Routes, Route } from "react-router-dom";

import MenuPage from "./pages/MenuPage";
import TestPage from "./pages/TestPage";
import AdminPage from "./pages/AdminPage";
import ResultPage from "./pages/ResultPage";

import "./App.css";

function App() {
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