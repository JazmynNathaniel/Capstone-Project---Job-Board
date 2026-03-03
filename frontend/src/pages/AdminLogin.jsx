import { useEffect, useState } from "react";
import { loginAdmin, setAuthRole, setAuthToken, clearAuthToken, getAuthToken, getAuthRole } from "../api";
import "./Auth.css";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [role, setRole] = useState(getAuthRole());
  const [authed, setAuthed] = useState(!!getAuthToken());
  const formatAuthError = (err) => {
    const text = String(err?.message || "");
    if (text.includes("Request failed (401)") && text.includes("Invalid credentials")) {
      return "Invalid admin email or password.";
    }
    if (text.includes("Request failed (401)")) {
      return "Admin access denied. Please try again.";
    }
    return text || "Login failed";
  };

  useEffect(() => {
    if (authed && role === "admin") {
      window.location.assign("/admin");
    }
  }, [authed, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const data = await loginAdmin(form);
      if (!data || data.role !== "admin") {
        clearAuthToken();
        setMessage("Admin access only.");
        return;
      }
      if (data.token) setAuthToken(data.token);
      if (data.role) setAuthRole(data.role);
      setAuthed(true);
      setRole(data.role);
      window.location.assign("/admin");
    } catch (err) {
      setMessage(formatAuthError(err));
    }
  };

  if (authed && role && role !== "admin") {
    return (
      <main className="page page-auth">
        <section className="auth-card">
          <h1>Access denied</h1>
          <p>This area is restricted to administrators.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page page-auth">
      <section className="auth-card">
        <h1>Admin sign in</h1>
        <p>Use your admin credentials to access the management console.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Admin email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Admin password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="btn btn-primary">Sign in</button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </section>
    </main>
  );
}
