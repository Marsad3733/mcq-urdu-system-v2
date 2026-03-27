import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminPage() {
  const navigate = useNavigate();

  const [trade, setTrade] = useState("");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correct, setCorrect] = useState("");
  const [tradeId, setTradeId] = useState("");
  const [image, setImage] = useState(null);

  const [trades, setTrades] = useState([]);
  const [questionsByTrade, setQuestionsByTrade] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // 🔄 LOAD DATA
  const loadData = async () => {
    try {
      const tradeRes = await axios.get("https://mcq-urdu-system-v2.onrender.com/api/trades");
      setTrades(tradeRes.data);

      const qByTrade = {};
      let total = 0;

      for (let t of tradeRes.data) {
        const qRes = await axios.get(
          "https://mcq-urdu-system-v2.onrender.com/api/questions/" + t._id
        );
        qByTrade[t._id] = qRes.data;
        total += qRes.data.length;
      }

      setQuestionsByTrade(qByTrade);
      setTotalQuestions(total);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ✅ ADD TRADE
  const addTrade = async () => {
    if (!trade.trim()) return alert("ٹریڈ کا نام درج کریں");
    await axios.post("https://mcq-urdu-system-v2.onrender.com/api/trades", { name: trade });
    setTrade("");
    loadData();
  };

  // ❌ DELETE TRADE
  const deleteTrade = async (id) => {
    if (!window.confirm("Delete this trade?")) return;
    await axios.delete("https://mcq-urdu-system-v2.onrender.com/api/trades/" + id);
    loadData();
  };

  // ✅ ADD / UPDATE QUESTION
  const addQuestion = async () => {
    if (!tradeId) return alert("ٹریڈ منتخب کریں");
    if (!correct) return alert("Correct option لازمی ہے");

    const cleanCorrect = correct.toUpperCase().trim();
    if (!["A", "B", "C", "D"].includes(cleanCorrect)) {
      return alert("Correct option A/B/C/D میں دیں");
    }

    try {
      const formData = new FormData();
      formData.append("tradeId", tradeId);
      formData.append("question", question);
      formData.append("optionA", optionA);
      formData.append("optionB", optionB);
      formData.append("optionC", optionC);
      formData.append("optionD", optionD);
      formData.append("correct", cleanCorrect);
      if (image) formData.append("image", image);

      if (editingId) {
        await axios.put("https://mcq-urdu-system-v2.onrender.com/api/questions/" + editingId, formData);
        alert("سوال اپڈیٹ ہو گیا");
      } else {
        await axios.post(
          "https://mcq-urdu-system-v2.onrender.com/api/questions",
          formData
        );
        alert("سوال شامل ہو گیا");
      }

      resetForm();
      loadData();

    } catch (err) {
      console.log(err);
      alert("Error saving question");
    }
  };

  // ✏️ EDIT
  const editQuestion = (q) => {
    setEditingId(q._id);
    setTradeId(q.tradeId);
    setQuestion(q.question);
    setOptionA(q.optionA);
    setOptionB(q.optionB);
    setOptionC(q.optionC);
    setOptionD(q.optionD);
    setCorrect(q.correct || "");
    setImage(null);
  };

  // ❌ DELETE QUESTION
  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    await axios.delete("https://mcq-urdu-system-v2.onrender.com/api/questions/" + id);
    loadData();
  };

  // 🔄 RESET
  const resetForm = () => {
    setEditingId(null);
    setQuestion("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrect("");
    setTradeId("");
    setImage(null);
  };

  return (
    <div style={containerStyle}>
      {/* BACKWARD BUTTON ON OPPOSITE SIDE */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            fontSize: "1.5rem",
            padding: "5px 12px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            background: "#5f6fdc",
            color: "white"
          }}
        >
          ←
        </button>
      </div>

      <h1 style={{ textAlign: "center" }}>🛠 Admin Dashboard</h1>

      {/* STATS */}
      <div style={statsWrapper}>
        <div style={cardStyle}>
          <h3>Total Trades</h3>
          <h1>{trades.length}</h1>
        </div>
        <div style={cardStyle}>
          <h3>Total Questions</h3>
          <h1>{totalQuestions}</h1>
        </div>
      </div>

      {/* GRID */}
      <div style={gridStyle}>

        {/* ADD TRADE */}
        <div style={boxStyle}>
          <h2>➕ نئی ٹریڈ</h2>
          <input value={trade} onChange={(e)=>setTrade(e.target.value)} style={inputStyle}/>
          <button onClick={addTrade} style={btnStyle}>Add</button>
        </div>

        {/* TRADE LIST */}
        <div style={boxStyle}>
          <h2>📋 ٹریڈز</h2>
          {trades.map(t => (
            <div key={t._id} style={listItem}>
              {t.name}
              <button onClick={()=>deleteTrade(t._id)} style={deleteBtn}>Delete</button>
            </div>
          ))}
        </div>

        {/* ADD QUESTION */}
        <div style={{...boxStyle, gridColumn:"span 2"}}>
          <h2>{editingId ? "✏️ Update Question" : "❓ Add Question"}</h2>

          <select value={tradeId} onChange={(e)=>setTradeId(e.target.value)} style={inputStyle}>
            <option value="">Select Trade</option>
            {trades.map(t=>(<option key={t._id} value={t._id}>{t.name}</option>))}
          </select>

          <input placeholder="Question" value={question} onChange={(e)=>setQuestion(e.target.value)} style={inputStyle}/>
          <input placeholder="Option A" value={optionA} onChange={(e)=>setOptionA(e.target.value)} style={inputStyle}/>
          <input placeholder="Option B" value={optionB} onChange={(e)=>setOptionB(e.target.value)} style={inputStyle}/>
          <input placeholder="Option C" value={optionC} onChange={(e)=>setOptionC(e.target.value)} style={inputStyle}/>
          <input placeholder="Option D" value={optionD} onChange={(e)=>setOptionD(e.target.value)} style={inputStyle}/>
          <input placeholder="Correct (A/B/C/D)" value={correct} onChange={(e)=>setCorrect(e.target.value)} style={inputStyle}/>
          <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>

          <button onClick={addQuestion} style={btnStyle}>
            {editingId ? "Update" : "Add"}
          </button>

          {editingId && <button onClick={resetForm} style={cancelBtn}>Cancel</button>}
        </div>

        {/* QUESTIONS BY TRADE */}
        {trades.map(t => (
          <div key={t._id} style={{...boxStyle, gridColumn:"span 2"}}>
            <h2>📚 {t.name} کے سوالات</h2>
            {questionsByTrade[t._id] && questionsByTrade[t._id].map(q => (
              <div key={q._id} style={listItem}>
                {q.question}
                <div>
                  <button onClick={()=>editQuestion(q)} style={editBtn}>Edit</button>
                  <button onClick={()=>deleteQuestion(q._id)} style={deleteBtn}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ))}

      </div>
    </div>
  );
}

/* STYLES SAME AS BEFORE */
const containerStyle = { minHeight:"100vh", background:"linear-gradient(135deg,#1f2c3d,#2f4f4f)", padding:"30px", color:"white" };
const gridStyle = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"25px" };
const statsWrapper = { display:"flex", gap:"20px", marginBottom:"25px" };
const boxStyle = { background:"white", color:"#333", padding:"20px", borderRadius:"12px" };
const cardStyle = { flex:1, background:"white", color:"#333", padding:"20px", borderRadius:"12px", textAlign:"center" };
const inputStyle = { width:"100%", padding:"10px", margin:"8px 0", borderRadius:"6px", border:"1px solid #ccc" };
const btnStyle = { width:"100%", padding:"12px", background:"#5f6fdc", color:"white", border:"none", borderRadius:"8px", marginTop:"10px" };
const listItem = { display:"flex", justifyContent:"space-between", background:"#eee", padding:"10px", borderRadius:"8px", marginBottom:"10px" };
const deleteBtn = { background:"red", color:"white", border:"none", padding:"5px 10px", marginLeft:"5px", borderRadius:"5px" };
const editBtn = { background:"#2196f3", color:"white", border:"none", padding:"5px 10px", borderRadius:"5px" };
const cancelBtn = { marginTop:"10px", width:"100%", padding:"10px", background:"#999", border:"none", color:"white", borderRadius:"6px" };

export default AdminPage;