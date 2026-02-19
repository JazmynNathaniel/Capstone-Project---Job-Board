import { useEffect, useMemo, useState } from "react";
import { listApplications, createApplication, updateApplication, deleteApplication } from "../api";
import "./Applications.css";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [createForm, setCreateForm] = useState({
    user_id: "",
    job_id: "",
    status: "pending"
  });
  const [updateForm, setUpdateForm] = useState({
    id: "",
    user_id: "",
    job_id: "",
    status: ""
  });
  const [deleteId, setDeleteId] = useState("");

  const refresh = () => {
    listApplications()
      .then((data) => setApplications(data || []))
      .catch((err) => setError(err.message || "Failed to load applications"));
  };

  useEffect(() => {
    refresh();
  }, []);

  const grouped = useMemo(() => {
    return {
      pending: applications.filter((a) => a.status === "pending"),
      accepted: applications.filter((a) => a.status === "accepted"),
      rejected: applications.filter((a) => a.status === "rejected")
    };
  }, [applications]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await createApplication({
        ...createForm,
        user_id: Number(createForm.user_id),
        job_id: Number(createForm.job_id)
      });
      setMessage("Application created.");
      setCreateForm({ user_id: "", job_id: "", status: "pending" });
      refresh();
    } catch (err) {
      setError(err.message || "Failed to create application");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const payload = {};
      if (updateForm.user_id) payload.user_id = Number(updateForm.user_id);
      if (updateForm.job_id) payload.job_id = Number(updateForm.job_id);
      if (updateForm.status) payload.status = updateForm.status;
      await updateApplication(updateForm.id, payload);
      setMessage("Application updated.");
      setUpdateForm({ id: "", user_id: "", job_id: "", status: "" });
      refresh();
    } catch (err) {
      setError(err.message || "Failed to update application");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await deleteApplication(deleteId);
      setMessage("Application deleted.");
      setDeleteId("");
      refresh();
    } catch (err) {
      setError(err.message || "Failed to delete application");
    }
  };

  return (
    <main className="page page-applications">
      <header className="page-header">
        <div>
          <p className="eyebrow">Applications</p>
          <h1 className="title">Track candidate flow</h1>
          <p className="subtitle">Monitor pipeline status and progress.</p>
        </div>
        <button className="btn btn-primary">New Application</button>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      <section className="form-grid">
        <form className="form-card" onSubmit={handleCreate}>
          <h3>Create Application</h3>
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
            placeholder="Job ID"
            type="number"
            value={createForm.job_id}
            onChange={(e) => setCreateForm({ ...createForm, job_id: e.target.value })}
            required
          />
          <select
            className="input"
            value={createForm.status}
            onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
          >
            <option value="pending">pending</option>
            <option value="accepted">accepted</option>
            <option value="rejected">rejected</option>
          </select>
          <button className="btn btn-primary">Create</button>
        </form>

        <form className="form-card" onSubmit={handleUpdate}>
          <h3>Update Application</h3>
          <input
            className="input"
            placeholder="Application ID"
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
            placeholder="Job ID"
            type="number"
            value={updateForm.job_id}
            onChange={(e) => setUpdateForm({ ...updateForm, job_id: e.target.value })}
          />
          <select
            className="input"
            value={updateForm.status}
            onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
          >
            <option value="">Select status</option>
            <option value="pending">pending</option>
            <option value="accepted">accepted</option>
            <option value="rejected">rejected</option>
          </select>
          <button className="btn btn-ghost">Update</button>
        </form>

        <form className="form-card" onSubmit={handleDelete}>
          <h3>Delete Application</h3>
          <input
            className="input"
            placeholder="Application ID"
            type="number"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
            required
          />
          <button className="btn btn-danger">Delete</button>
        </form>
      </section>

      <section className="pipeline-grid">
        {["pending", "accepted", "rejected"].map((status) => (
          <div key={status} className="pipeline-column">
            <h3>{status}</h3>
            {grouped[status].map((app) => (
              <div key={app.id} className="pipeline-card">
                <p className="name">User #{app.user_id}</p>
                <p className="role">Job #{app.job_id}</p>
                <p className="meta">Applied {app.created_at?.slice(0, 10)}</p>
              </div>
            ))}
            {grouped[status].length === 0 && (
              <div className="empty-card">No {status} applications.</div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
