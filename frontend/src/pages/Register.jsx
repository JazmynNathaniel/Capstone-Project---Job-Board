import { useState } from "react";
import { registerUser } from "../api";
import "./Auth.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    company_name: "",
    phone: ""
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const payload = { ...form };
      if (form.role !== "employer") {
        delete payload.company_name;
        delete payload.phone;
      }
      await registerUser(payload);
      setMessage("Account created. You can log in.");
      setForm({
        username: "",
        email: "",
        password: "",
        role: "user",
        company_name: "",
        phone: ""
      });
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
          {form.role === "employer" && (
            <>
              <input
                className="input"
                placeholder="Company name"
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                required
              />
              <input
                className="input"
                placeholder="Company phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </>
          )}
          <button className="btn btn-primary">Create account</button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </section>
    </main>
  );
}
