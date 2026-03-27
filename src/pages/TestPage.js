import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";

function TestPage() {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    axios.get("https://mcq-urdu-system-v2.onrender.com/api/questions/" + tradeId)
      .then(res => setQuestions(res.data));
    axios.get("https://mcq-urdu-system-v2.onrender.com/api/settings")
      .then(res => setTimeLeft(res.data.timer * 60));
  }, [tradeId]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec.toString().padStart(2,"0")}`;
  };

  if (questions.length === 0) return <h2 style={{ padding: "20px" }}>سوال لوڈ ہو رہے ہیں...</h2>;

  const q = questions[index];
  const selectOption = (opt) => setAnswers({ ...answers, [index]: opt });
  const calculateResult = () => {
    let score = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct) score++; });
    return score;
  };

  if (showResult || timeLeft === 0) {
    const score = calculateResult();
    return (
      <div style={{ minHeight: "100vh", background: "#111", color: "#fff", padding: "20px" }}>
        {/* Result Top bar */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "20px" }}>
          <button onClick={() => navigate("/")} style={{
            background: "#0f7a5e",
            color: "#fff",
            padding: "10px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1.4rem"
          }}>←</button>
        </div>

        <h1 style={{ textAlign: "center", marginBottom: "15px" }}>نتیجہ</h1>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>{score} / {questions.length}</h2>

        {questions.map((q, i) => {
          const userAns = answers[i];
          const correct = q.correct;
          return (
            <div key={i} style={{ background: "#222", padding: "15px", marginBottom: "15px", borderRadius: "10px" }}>
              <h3 style={{ textAlign: "right" }}>{i + 1}. {q.question}</h3>
              {q.image && <img src={`https://mcq-urdu-system-v2.onrender.com/uploads/${q.image}`} alt="" style={{ maxWidth: "100%", margin: "10px 0" }}/>}
              {["A","B","C","D"].map(opt => {
                let bg = "#333";
                if (opt === correct) bg = "#2e7d32";
                else if (opt === userAns && opt !== correct) bg = "#c62828";
                return (
                  <div key={opt} style={{
                    background: bg,
                    padding: "10px",
                    marginTop: "8px",
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "space-between"
                  }}>
                    <span>{opt}</span>
                    <span>{q["option"+opt]}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "sans-serif", height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Top Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        background: "#044d40",
        color: "#fff",
        padding: "12px 25px",
        flexShrink: 0,
        justifyContent: "space-between",
        gap: "20px"
      }}>
        {/* Left: Section Complete */}
        <button onClick={() => setShowResult(true)} style={{
          background: "#0f7a5e",
          color: "#fff",
          padding: "8px 16px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "1rem"
        }}>سیکشن مکمل کریں</button>

        {/* Center: Timer */}
        <div style={{ textAlign: "center", flex: 1, fontSize: "1.1rem" }}>
          ⏱ {formatTime()}
        </div>

        {/* Right: Question info + Back */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "1rem" }}>
          <div>سوال: {index + 1} سیکشن: 1</div>
          <button onClick={() => navigate("/")} style={{
            background: "#0f7a5e",
            color: "#fff",
            padding: "6px 14px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1.3rem"
          }}>←</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Question Area */}
        <div style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: "12px", overflow: "hidden" }}>
          <QuestionCard q={q} selected={answers[index]} setSelected={selectOption} showResult={false} />

          {/* Navigation Buttons (Swapped) */}
          <div style={{ display: "flex", justifyContent: "flex-start", gap: "12px", flexShrink: 0 }}>
            {/* Agla button */}
            <button onClick={() => setIndex(index+1)} disabled={index===questions.length-1} style={{
              background: "#0f7a5e",
              color:"#fff",
              padding:"10px 18px",
              border:"none",
              borderRadius:"6px",
              cursor: "pointer",
              fontSize: "1rem"
            }}>اگلا</button>

            {/* Wapis Pechae button */}
            <button onClick={() => setIndex(index-1)} disabled={index===0} style={{
              background: "#0f7a5e",
              color:"#fff",
              padding:"10px 18px",
              border:"none",
              borderRadius:"6px",
              cursor: "pointer",
              fontSize: "1rem"
            }}>واپس پیچھے</button>
          </div>
        </div>

        {/* Sidebar (Right side) */}
        <div style={{ width: "55px", background: "#065a46", padding: "6px", display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto" }}>
          {questions.map((_, i) => {
            let bg = "#007a5e";
            if (i === index) bg = "#004d33";
            else if (answers[i]) bg = "#2e7d32";
            return (
              <div key={i} onClick={() => setIndex(i)} style={{
                background: bg,
                color: "#fff",
                textAlign: "center",
                borderRadius: "6px",
                cursor: "pointer",
                padding: "6px 0",
                fontSize: "0.95rem"
              }}>{i + 1}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TestPage;