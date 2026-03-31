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

  if (questions.length === 0)
    return <h2 style={{ padding: "20px" }}>سوال لوڈ ہو رہے ہیں...</h2>;

  const q = questions[index];

  const selectOption = (opt) => {
    setAnswers({ ...answers, [index]: opt });
  };

  const calculateResult = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });
    return score;
  };

  /* ================= RESULT PAGE ================= */
  if (showResult || timeLeft === 0) {
    const score = calculateResult();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
        padding: "25px",
        color: "#fff"
      }}>

        {/* TOP BAR */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px"
        }}>
          <button onClick={() => navigate("/")} style={{
            background: "#0f7a5e",
            color: "#fff",
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}>
            🏠 ہوم
          </button>

          <button onClick={() => window.location.reload()} style={{
            background: "#2196f3",
            color: "#fff",
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}>
            🔄 دوبارہ کوشش
          </button>
        </div>

        {/* SCORE CARD */}
        <div style={{
          background: "#ffffff",
          color: "#333",
          padding: "25px",
          borderRadius: "15px",
          textAlign: "center",
          marginBottom: "25px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
        }}>
          <h1 style={{ marginBottom: "10px" }}>🎯 نتیجہ</h1>

          <h2>{score} / {questions.length}</h2>

          <h3 style={{
            color: percentage >= 50 ? "#2e7d32" : "#c62828",
            marginTop: "10px"
          }}>
            {percentage}% اسکور
          </h3>

          {/* PROGRESS BAR */}
          <div style={{
            marginTop: "20px",
            width: "100%",
            height: "18px",
            background: "#eee",
            borderRadius: "10px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${percentage}%`,
              height: "100%",
              background: percentage >= 50 ? "#4caf50" : "#f44336",
              transition: "width 0.5s ease"
            }} />
          </div>
        </div>

        {/* QUESTIONS REVIEW */}
        {questions.map((q, i) => {
          const userAns = answers[i];
          const correct = q.correct;

          return (
            <div key={i} style={{
              background: "#fff",
              color: "#333",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "12px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
              direction: "rtl"
            }}>
              <h3 style={{ marginBottom: "10px" }}>
                {i + 1}. {q.question}
              </h3>

              {q.image && (
                <img
                  src={q.image}
                  alt=""
                  style={{
                    maxWidth: "100%",
                    margin: "10px 0",
                    borderRadius: "8px"
                  }}
                />
              )}

              {["A","B","C","D"].map(opt => {
                let bg = "#f5f5f5";
                let border = "#ccc";

                if (opt === correct) {
                  bg = "#c8e6c9";
                  border = "#2e7d32";
                } else if (opt === userAns && opt !== correct) {
                  bg = "#ffcdd2";
                  border = "#c62828";
                }

                return (
                  <div key={opt} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "8px"
                  }}>
                    {/* Option letter */}
                    <div style={{
                      width: "30px",
                      textAlign: "center",
                      fontWeight: "bold"
                    }}>
                      {opt}
                    </div>

                    {/* Option text */}
                    <div style={{
                      flex: 1,
                      background: bg,
                      border: "2px solid",
                      borderColor: border,
                      padding: "10px",
                      borderRadius: "6px"
                    }}>
                      {q["option" + opt]}
                    </div>
                  </div>
                );
              })}

              {/* STATUS */}
              <div style={{
                marginTop: "10px",
                fontWeight: "bold",
                color: userAns === correct ? "#2e7d32" : "#c62828"
              }}>
                {userAns === correct ? "✔ درست" : "✘ غلط"}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ================= TEST PAGE ================= */

  return (
    <div style={{
      fontFamily: "sans-serif",
      height: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>

      {/* Top Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        background: "#044d40",
        color: "#fff",
        padding: "12px 25px",
        justifyContent: "space-between"
      }}>
        <button onClick={() => setShowResult(true)} style={{
          background: "#0f7a5e",
          color: "#fff",
          padding: "8px 16px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}>
          سیکشن مکمل کریں
        </button>

        <div>⏱ {formatTime()}</div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div>سوال: {index + 1}</div>
          <button onClick={() => navigate("/")} style={{
            background: "#0f7a5e",
            color: "#fff",
            padding: "6px 12px",
            border: "none",
            borderRadius: "6px"
          }}>←</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ flex: 1, padding: "12px" }}>
          <QuestionCard
            q={q}
            selected={answers[index]}
            setSelected={selectOption}
            showResult={false}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button onClick={() => setIndex(index+1)} disabled={index===questions.length-1}>
              اگلا
            </button>

            <button onClick={() => setIndex(index-1)} disabled={index===0}>
              واپس
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{
          width: "55px",
          background: "#065a46",
          display: "flex",
          flexDirection: "column"
        }}>
          {questions.map((_, i) => {
            let bg = "#007a5e";
            if (i === index) bg = "#004d33";
            else if (answers[i]) bg = "#2e7d32";

            return (
              <div
                key={i}
                onClick={() => setIndex(i)}
                style={{
                  background: bg,
                  color: "#fff",
                  textAlign: "center",
                  padding: "6px",
                  cursor: "pointer"
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TestPage;