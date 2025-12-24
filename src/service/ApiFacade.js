const BASE_URL = "http://localhost:8080/api/gdpr";

export async function fetchGdprQuestions() {
  const response = await fetch(`${BASE_URL}/questions`);

  if (!response.ok) {
    throw new Error("Kunne ikke hente GDPR-spørgsmål");
  }

  return response.json();
}
