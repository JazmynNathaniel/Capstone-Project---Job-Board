import { useState } from "react";
import { loginUser, setAuthToken, setAuthRole } from "../api";
import "./Auth.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const data = await loginUser(form);
      if (data.token) {
        setAuthToken(data.token);
      }
      if (data.role) {
        setAuthRole(data.role);
      }
      setMessage(`Logged in. User ${data.user_id} (${data.role}).`);
      window.location.assign("/");
    } catch (err) {
      setMessage(err.message || "Login failed");
    }
  };

  return (
    <main className="page page-auth">
      <section className="auth-card">
        <h1>Welcome back</h1>
        <p>Sign in to manage jobs and applicants.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Password"
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
