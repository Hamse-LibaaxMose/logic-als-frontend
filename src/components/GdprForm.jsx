import { useEffect, useState } from "react";
import { fetchGdprQuestions } from "../service/ApiFacade";
const RISK_LEVELS = [
  { value: "low", label: "Lav", color: "text-green-600" },
  { value: "middle", label: "Middel", color: "text-yellow-600" },
  { value: "high", label: "Høj", color: "text-red-600" }
];

export default function GdprForm() {
  const customerId = 1; // POC
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGdprQuestions()
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Kunne ikke hente GDPR-spørgsmål");
        setLoading(false);
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
    setSaving(true);

    const payload = {
      customerId,
      answers: Object.values(answers)
    };

    await fetch("http://localhost:8080/api/gdpr/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setSaving(false);
    alert("GDPR-vurdering gemt ✅");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Indlæser spørgsmål...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          GDPR-vurdering
        </h1>

        {questions.map(q => (
          <div
            key={q.id}
            className="border rounded-lg p-6 bg-gray-50 space-y-4"
          >
            <p className="font-semibold text-lg text-gray-800">
              {q.question}
            </p>

            {/* Risiko-vurdering */}
            <div className="grid md:grid-cols-2 gap-6">
              {["likelihood", "consequence"].map(type => (
                <div key={type}>
                  <p className="font-medium text-gray-700 mb-2">
                    {type === "likelihood" ? "Sandsynlighed" : "Konsekvens"}
                  </p>

                  <div className="flex gap-4">
                    {RISK_LEVELS.map(risk => (
                      <label
                        key={risk.value}
                        className={`flex items-center gap-2 cursor-pointer ${risk.color}`}
                      >
                        <input
                          type="radio"
                          name={`${q.id}-${type}`}
                          value={risk.value}
                          required
                          onChange={() =>
                            handleChange(q.id, type, risk.value)
                          }
                        />
                        {risk.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Kommentar */}
            <div>
              <textarea
                rows="3"
                placeholder="Kommentar (valgfrit)"
                className="w-full mt-2 p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                onChange={e =>
                  handleChange(q.id, "comment", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <div className="text-center">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-50"
          >
            {saving ? "Gemmer..." : "Gem GDPR-vurdering"}
          </button>
        </div>
      </form>
    </div>
  );
}
