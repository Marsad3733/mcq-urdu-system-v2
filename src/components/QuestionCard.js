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
          src={`https://mcq-urdu-system-v2.onrender.com/uploads/${q.image}`}
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

        // Set background and border colors
        if (showResult) {
          if (isCorrect) { bg = "#c8e6c9"; border = "#2e7d32"; }  // correct answer green
          else if (isSelected) { bg = "#ffcdd2"; border = "#c62828"; }  // wrong selection red
        } else if (isSelected) { bg = "#ffe082"; border = "#ff9800"; }  // selection yellow
        else { bg = "#fff"; border = "#333"; }

        return (
          <div
            key={opt}
            onClick={() => !showResult && setSelected(opt)}
            style={{
              background: bg, // <-- fix: set the background here
              border: "2px solid",
              borderColor: border,
              borderRadius: "6px",
              padding: "0.6rem 1rem",
              cursor: showResult ? "default" : "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "1rem",
              transition: "background 0.2s ease" // smooth color change
            }}
          >
            <span>{opt}</span>
            <span>{q["option" + opt]}</span>
          </div>
        );
      })}
    </div>
  );
}

export default QuestionCard;