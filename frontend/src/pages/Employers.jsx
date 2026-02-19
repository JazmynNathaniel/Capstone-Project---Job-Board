import { useEffect, useState } from "react";
import { listEmployers, createEmployer, updateEmployer, deleteEmployer } from "../api";
import "./Employers.css";

export default function Employers() {
  const [employers, setEmployers] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [createForm, setCreateForm] = useState({
    user_id: "",
    name: "",
    email: "",
    company_name: "",
    contact_person: "",
    password_hash: ""
  });
  const [updateForm, setUpdateForm] = useState({
    id: "",
    user_id: "",
    name: "",
    email: "",
    company_name: "",
    contact_person: "",
    password_hash: ""
  });
  const [deleteId, setDeleteId] = useState("");

  const refresh = () => {
    listEmployers()
      .then((data) => setEmployers(data || []))
      .catch((err) => setError(err.message || "Failed to load employers"));
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await createEmployer({
        ...createForm,
        user_id: Number(createForm.user_id)
      });
      setMessage("Employer created.");
      setCreateForm({
        user_id: "",
        name: "",
        email: "",
        company_name: "",
        contact_person: "",
        password_hash: ""
      });
      refresh();
    } catch (err) {
      setError(err.message || "Failed to create employer");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const payload = {};
      if (updateForm.user_id) payload.user_id = Number(updateForm.user_id);
      if (updateForm.name) payload.name = updateForm.name;
      if (updateForm.email) payload.email = updateForm.email;
      if (updateForm.company_name) payload.company_name = updateForm.company_name;
      if (updateForm.contact_person) payload.contact_person = updateForm.contact_person;
      if (updateForm.password_hash) payload.password_hash = updateForm.password_hash;
      await updateEmployer(updateForm.id, payload);
      setMessage("Employer updated.");
      setUpdateForm({
        id: "",
        user_id: "",
        name: "",
        email: "",
        company_name: "",
        contact_person: "",
        password_hash: ""
      });
      refresh();
    } catch (err) {
      setError(err.message || "Failed to update employer");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await deleteEmployer(deleteId);
      setMessage("Employer deleted.");
      setDeleteId("");
      refresh();
    } catch (err) {
      setError(err.message || "Failed to delete employer");
    }
  };

  return (
    <main className="page page-employers">
      <header className="page-header">
        <div>
          <p className="eyebrow">Employers</p>
          <h1 className="title">Company directory</h1>
          <p className="subtitle">Track employer profiles and contacts.</p>
        </div>
        <button className="btn btn-primary">Add Employer</button>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      <section className="form-grid">
        <form className="form-card" onSubmit={handleCreate}>
          <h3>Create Employer</h3>
          <input
            className="input"
            placeholder="User ID"
            type="number"
            value={createForm.user_id}
            onChange={(e) => setCreateForm({ ...createForm, user_id: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Name"
            value={createForm.name}
            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Email"
            value={createForm.email}
            onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Company Name"
            value={createForm.company_name}
            onChange={(e) => setCreateForm({ ...createForm, company_name: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Contact Person"
            value={createForm.contact_person}
            onChange={(e) => setCreateForm({ ...createForm, contact_person: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Password Hash"
            value={createForm.password_hash}
            onChange={(e) => setCreateForm({ ...createForm, password_hash: e.target.value })}
            required
          />
          <button className="btn btn-primary">Create</button>
        </form>

        <form className="form-card" onSubmit={handleUpdate}>
          <h3>Update Employer</h3>
          <input
            className="input"
            placeholder="Employer ID"
            type="number"
            value={updateForm.id}
            onChange={(e) => setUpdateForm({ ...updateForm, id: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="User ID"
            type="number"
            value={updateForm.user_id}
            onChange={(e) => setUpdateForm({ ...updateForm, user_id: e.target.value })}
          />
          <input
            className="input"
            placeholder="Name"
            value={updateForm.name}
            onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
          />
          <input
            className="input"
            placeholder="Email"
            value={updateForm.email}
            onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
          />
          <input
            className="input"
            placeholder="Company Name"
            value={updateForm.company_name}
            onChange={(e) => setUpdateForm({ ...updateForm, company_name: e.target.value })}
          />
          <input
            className="input"
            placeholder="Contact Person"
            value={updateForm.contact_person}
            onChange={(e) => setUpdateForm({ ...updateForm, contact_person: e.target.value })}
          />
          <input
            className="input"
            placeholder="Password Hash"
            value={updateForm.password_hash}
            onChange={(e) => setUpdateForm({ ...updateForm, password_hash: e.target.value })}
          />
          <button className="btn btn-ghost">Update</button>
        </form>

        <form className="form-card" onSubmit={handleDelete}>
          <h3>Delete Employer</h3>
          <input
            className="input"
            placeholder="Employer ID"
            type="number"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
            required
          />
          <button className="btn btn-danger">Delete</button>
        </form>
      </section>

      <section className="card-grid">
        {employers.map((company) => (
          <article key={company.id} className="employer-card">
            <div className="employer-head">
              <div>
                <h3>{company.company_name}</h3>
                <p>{company.name}</p>
              </div>
              <span className="pill">Active</span>
            </div>
            <div className="employer-meta">
              <p>Contact: {company.contact_person}</p>
              <p>{company.email}</p>
            </div>
            <button className="btn btn-ghost">View Jobs</button>
          </article>
        ))}
        {employers.length === 0 && !error && (
          <div className="empty-card">No employers yet.</div>
        )}
      </section>
    </main>
  );
}
