export async function adminLogin(username, password) {
  const res = await fetch("http://localhost:8080/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    throw new Error("Login fejlede");
  }
}
