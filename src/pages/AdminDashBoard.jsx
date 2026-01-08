import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/admin-login");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

        <p className="mb-6">
          Her kan admin se GDPR-vurderinger, kunder osv.
        </p>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-6 py-2 rounded"
        >
          Log ud
        </button>
      </div>
    </div>
  );
}
