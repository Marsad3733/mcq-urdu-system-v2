import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MenuPage() {

  const [trades, setTrades] = useState([]);
  const navigate = useNavigate();

  // 🔐 CHECK LOGIN
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  // 📡 LOAD TRADES
  useEffect(() => {
    axios.get("https://mcq-urdu-system-v2.onrender.com/api/trades")
      .then(res => setTrades(res.data));
  }, []);

  // 🚪 USER LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // ✅ FIXED
    navigate("/login");
  };

  // 🔐 ADMIN ACCESS
  const handleAdminAccess = () => {
    const pass = prompt("Enter Admin Password:");

    if (pass === "admin123") {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin");
    } else if (pass !== null) {
      alert("Wrong password!");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #5f6fdc, #7b4bb7)",
      fontFamily: "sans-serif",
      color: "white"
    }}>

      <h1 style={{ textAlign: "center", marginTop: "20px" }}>
        Father And Sons
      </h1>

      {/* TOP BAR */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "10px",
        margin: "20px"
      }}>

        {/* 🔐 Admin Button */}
        <button
          onClick={handleAdminAccess}
          style={{
            background: "#ff4d4d",
            border: "none",
            color: "white",
            padding: "8px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Admin
        </button>

        {/* 🚪 Logout */}
        <button onClick={handleLogout} style={{
          background: "#333",
          border: "none",
          color: "white",
          padding: "8px 18px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}>
          Logout
        </button>
      </div>

      {/* Welcome */}
      <div style={{
        textAlign: "center",
        marginTop: "30px",
        marginBottom: "30px"
      }}>
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          خوش آمدید!
        </h1>
        <p style={{ opacity: 0.9 }}>
          اپنا ٹیسٹ منتخب کریں
        </p>
      </div>

      {/* CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "25px",
        padding: "20px"
      }}>
        {trades.map(t => (
          <div
            key={t._id}
            style={{
              background: "white",
              color: "#333",
              padding: "25px",
              borderRadius: "15px",
              textAlign: "center",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              transition: "0.3s",
              cursor: "pointer"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>📋</div>
            <h2>{t.name}</h2>

            <div style={{
              background: "#eee",
              display: "inline-block",
              padding: "5px 12px",
              borderRadius: "20px",
              fontSize: "13px",
              marginBottom: "15px"
            }}>
              سوالات: {t.questionCount || 0}
            </div>

            <button
              onClick={() => navigate("/test/" + t._id)}
              style={{
                background: "linear-gradient(90deg, #5f6fdc, #7b4bb7)",
                border: "none",
                color: "white",
                padding: "10px 20px",
                borderRadius: "25px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              ٹیسٹ شروع کریں
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default MenuPage;