import { useEffect, useState } from "react";
import { getMyEmployer, createMyEmployer, updateMyEmployer } from "../api";
import "./MyEmployer.css";

export default function MyEmployer() {
  const [employer, setEmployer] = useState(null);
  const [form, setForm] = useState({
    company_name: "",
    location: "",
    phone: "",
    contact_person: "",
    email: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    setError("");
    getMyEmployer()
      .then((data) => {
        setEmployer(data);
        setForm({
          company_name: data.company_name || "",
          location: data.location || "",
          phone: data.phone || "",
          contact_person: data.contact_person || "",
          email: data.email || ""
        });
      })
      .catch((err) => setError(err.message || "Failed to load employer profile"));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const data = await createMyEmployer(form);
      setEmployer(data);
      setMessage("Employer profile created.");
    } catch (err) {
      setError(err.message || "Failed to create employer profile");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const data = await updateMyEmployer(form);
      setEmployer(data);
      setMessage("Employer profile updated.");
    } catch (err) {
      setError(err.message || "Failed to update employer profile");
    }
  };

  return (
    <main className="page page-my-employer">
      <header className="page-header">
        <div>
          <p className="eyebrow">My Employer Profile</p>
          <h1 className="title">Manage company details</h1>
          <p className="subtitle">Keep your company profile current.</p>
          <p className="helper-text">Employer access: update your organization details.</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      {employer ? (
        <section className="profile-panel">
          <div className="profile-summary">
            <h3>{employer.company_name}</h3>
            <p>{employer.location || "Location not set."}</p>
            <p className="meta">Contact: {employer.contact_person}</p>
            <p className="meta">{employer.email}</p>
          </div>

          <form className="form-card" onSubmit={handleUpdate}>
            <h3>Edit Employer Profile</h3>
            <input
              className="input"
              placeholder="Company name"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Contact person"
              value={form.contact_person}
              onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
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
            <button className="btn btn-primary">Save changes</button>
          </form>
        </section>
      ) : (
        <div className="empty-card">
          <p>No employer profile found. Create one below.</p>
          <form className="form-card" onSubmit={handleCreate}>
            <h3>Create Employer Profile</h3>
            <input
              className="input"
              placeholder="Company name"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Contact person"
              value={form.contact_person}
              onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
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
            <button className="btn btn-primary">Create profile</button>
          </form>
        </div>
      )}
    </main>
  );
}
