import { useState } from "react";

function LoginPage({ onLogin }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 🔐 HARDCODED CREDENTIALS
  const FIXED_USER = "admin";
  const FIXED_PASS = "1234";

  const handleLogin = () => {
    if (username === FIXED_USER && password === FIXED_PASS) {
      localStorage.setItem("isLoggedIn", "true");
      onLogin();
    } else {
      alert("غلط یوزرنیم یا پاسورڈ");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#1f2c3d"
    }}>
      <div style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "10px",
        width: "300px",
        textAlign: "center"
      }}>
        <h2>🔐 Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          style={{ width:"100%", padding:"10px", margin:"10px 0" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          style={{ width:"100%", padding:"10px", margin:"10px 0" }}
        />

        <button onClick={handleLogin} style={{
          width:"100%",
          padding:"10px",
          background:"#0f7a5e",
          color:"#fff",
          border:"none",
          borderRadius:"6px"
        }}>
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;