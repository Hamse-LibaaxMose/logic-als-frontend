import { useEffect, useState } from "react";
import { fetchGdprQuestions } from "../service/ApiFacade";

const RISK_LEVELS = ["low", "middle", "high"];

export default function GdprForm() {
  const customerId = 1; // POC
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGdprQuestions()
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Kunne ikke hente spørgsmål");
      });
  }, []);

  const handleChange = (questionId, field, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      customerId,
      answers: Object.values(answers)
    };

    await fetch("http://localhost:8080/api/gdpr/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    alert("GDPR-vurdering gemt");
  };

  if (loading) return <p>Indlæser spørgsmål...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>GDPR Vurdering</h1>

      {questions.map(q => (
        <div key={q.id} style={{ marginBottom: "1rem" }}>
          <p><strong>{q.question}</strong></p>

          <select required onChange={e => handleChange(q.id, "likelihood", e.target.value)}>
            <option value="">Sandsynlighed</option>
            {RISK_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <select required onChange={e => handleChange(q.id, "consequence", e.target.value)}>
            <option value="">Konsekvens</option>
            {RISK_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <br />

          <textarea
            placeholder="Kommentar"
            onChange={e => handleChange(q.id, "comment", e.target.value)}
          />
        </div>
      ))}

      <button type="submit">Gem</button>
    </form>
  );
}
