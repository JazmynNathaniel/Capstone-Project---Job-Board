import { useState } from "react";
import { registerUser } from "../api";
import "./Auth.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await registerUser(form);
      setMessage("Account created. You can log in.");
      setForm({ username: "", email: "", password: "", role: "user" });
    } catch (err) {
      setMessage(err.message || "Registration failed");
    }
  };

  return (
    <main className="page page-auth">
      <section className="auth-card">
        <h1>Create account</h1>
        <p>Join the platform as a candidate or employer.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
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
          <select
            className="input"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">Candidate</option>
            <option value="employer">Employer</option>
          </select>
          <button className="btn btn-primary">Create account</button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </section>
    </main>
  );
}
