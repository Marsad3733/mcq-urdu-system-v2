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
    return `${min}:${sec.toString().padStart(2, "0")}`;
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

  const progress = ((index + 1) / questions.length) * 100;

  // ================= RESULT PAGE =================
  if (showResult || timeLeft === 0) {
    const score = calculateResult();

    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
        color: "#fff",
        padding: "20px"
      }}>
        
        {/* Top */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>📊 نتیجہ</h2>
          <button onClick={() => navigate("/")} style={backBtn}>←</button>
        </div>

        {/* Score Card */}
        <div style={{
          textAlign: "center",
          margin: "20px 0",
          padding: "20px",
          borderRadius: "12px",
          background: "#ffffff10",
          backdropFilter: "blur(8px)"
        }}>
          <h1 style={{ fontSize: "3rem" }}>{score}/{questions.length}</h1>
          <p>آپ کا اسکور</p>
        </div>

        {/* Questions Review */}
        <div style={{ maxHeight: "65vh", overflowY: "auto", paddingRight: "5px" }}>
          {questions.map((q, i) => {
            const userAns = answers[i];
            const correct = q.correct;

            return (
              <div key={i} style={{
                background: "#ffffff15",
                marginBottom: "15px",
                padding: "15px",
                borderRadius: "10px"
              }}>
                <h3 style={{ textAlign: "right" }}>
                  {i + 1}. {q.question}
                </h3>

                {["A", "B", "C", "D"].map(opt => {
                  let bg = "#333";
                  if (opt === correct) bg = "#2e7d32";
                  else if (opt === userAns && opt !== correct) bg = "#c62828";

                  return (
                    <div key={opt} style={{
                      background: bg,
                      padding: "8px",
                      marginTop: "6px",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                      <span>{opt}</span>
                      <span>{q["option" + opt]}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ================= TEST PAGE =================
  return (
    <div style={{
      fontFamily: "sans-serif",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>

      {/* TOP BAR */}
      <div style={{
        background: "#044d40",
        color: "#fff",
        padding: "10px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}>

        {/* Row 1 */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <button onClick={() => setShowResult(true)} style={topBtn}>
            سیکشن مکمل کریں
          </button>

          <div>⏱ {formatTime()}</div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div>سوال {index + 1}</div>
            <button onClick={() => navigate("/")} style={topBtn}>←</button>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div style={{
          width: "100%",
          height: "6px",
          background: "#ffffff40",
          borderRadius: "10px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "#00e676",
            transition: "0.3s"
          }} />
        </div>
      </div>

      {/* MAIN */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* QUESTION AREA */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "10px",
          overflow: "hidden"
        }}>
          
          {/* QUESTION */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <QuestionCard
              q={q}
              selected={answers[index]}
              setSelected={selectOption}
              showResult={false}
            />
          </div>

          {/* BUTTONS (ALWAYS VISIBLE) */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "8px"
          }}>
            <button
              onClick={() => setIndex(index - 1)}
              disabled={index === 0}
              style={navBtn}
            >
              واپس
            </button>

            <button
              onClick={() => setIndex(index + 1)}
              disabled={index === questions.length - 1}
              style={navBtn}
            >
              اگلا
            </button>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{
          width: "55px",
          background: "#065a46",
          padding: "5px",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          overflowY: "auto"
        }}>
          {questions.map((_, i) => {
            let bg = "#007a5e";
            if (i === index) bg = "#004d33";
            else if (answers[i]) bg = "#2e7d32";

            return (
              <div key={i}
                onClick={() => setIndex(i)}
                style={{
                  background: bg,
                  color: "#fff",
                  textAlign: "center",
                  borderRadius: "6px",
                  cursor: "pointer",
                  padding: "5px 0"
                }}>
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* STYLES */
const navBtn = {
  background: "#0f7a5e",
  color: "#fff",
  padding: "10px 18px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const topBtn = {
  background: "#0f7a5e",
  color: "#fff",
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const backBtn = {
  background: "#0f7a5e",
  color: "#fff",
  padding: "8px 14px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default TestPage;