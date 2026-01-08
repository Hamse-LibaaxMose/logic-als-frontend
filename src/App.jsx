import { BrowserRouter, Routes, Route } from "react-router-dom";
import GdprForm from "./components/GdprForm";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashBoard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GdprForm />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
