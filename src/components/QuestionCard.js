function QuestionCard({ q, selected, setSelected, showResult }) { 
  if (!q) return <h3>سوال لوڈ ہو رہا ہے...</h3>;

  const options = ["A", "B", "C", "D"];
  const correctAns = q.correct || q.correctAnswer;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      height: "100%",
      justifyContent: "flex-start",
      padding: "1rem",
      background: "#fff",
      borderRadius: "8px",
      border: "1px solid #999",
      direction: "rtl",
    }}>
      
      {q.image && (
        <img
          src={q.image}
          alt="question"
          style={{
            width: "100%",
            maxHeight: "20vh",
            objectFit: "contain",
            borderRadius: "8px",
            marginBottom: "0.5rem"
          }}
        />
      )}

      <div style={{ fontSize: "1rem", textAlign: "right", marginBottom: "0.5rem" }}>
        {q.question}
      </div>

      {options.map(opt => {
        const isSelected = selected === opt;
        const isCorrect = correctAns === opt;

        let bg = "#fff";
        let border = "#333";

        if (showResult) {
          if (isCorrect) { bg = "#c8e6c9"; border = "#2e7d32"; }
          else if (isSelected) { bg = "#ffcdd2"; border = "#c62828"; }
        } else if (isSelected) { 
          bg = "#ffe082"; 
          border = "#ff9800"; 
        }

        return (
          <div
            key={opt}
            onClick={() => !showResult && setSelected(opt)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: showResult ? "default" : "pointer"
            }}
          >

            {/* OPTION BOX (LEFT SIDE) */}
            <div style={{
              flex: 1,
              background: bg,
              border: "2px solid",
              borderColor: border,
              borderRadius: "6px",
              padding: "0.6rem 1rem",
              textAlign: "right",
              fontSize: "1rem",
              transition: "background 0.2s ease"
            }}>
              {q["option" + opt]}
            </div>

            {/* RIGHT SIDE (A/B/C/D outside box) */}
            <div style={{
              minWidth: "25px",
              textAlign: "center",
              fontWeight: "bold",
              color: "#333"
            }}>
              {opt}
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default QuestionCard;