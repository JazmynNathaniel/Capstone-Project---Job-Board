import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  listApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  getAuthRole
} from "../api";
import "./Applications.css";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = getAuthRole();
  const canCreate = role === "employer" || role === "admin";
  const canUpdate = role === "employer" || role === "admin";
  const canDelete = role === "admin";
  const headerCopy =
    role === "admin"
      ? {
          title: "Oversee application flow",
          subtitle: "Review submissions across employers and roles.",
          note: "Admin access: create, update, or delete any application."
        }
      : role === "employer"
        ? {
            title: "Track candidate flow",
            subtitle: "Monitor pipeline status and progress.",
            note: "Employer access: create and update application statuses."
          }
        : {
            title: "Track your applications",
            subtitle: "Review statuses and next steps.",
            note: "Candidate access: view your application history."
          };
  const [createForm, setCreateForm] = useState({
    job_id: ""
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
    const jobId = searchParams.get("job_id");
    if (jobId) {
      setCreateForm((prev) => ({ ...prev, job_id: jobId }));
    }
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
        job_id: Number(createForm.job_id)
      });
      setMessage("Application created.");
      setCreateForm({ job_id: "" });
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
          <h1 className="title">{headerCopy.title}</h1>
          <p className="subtitle">{headerCopy.subtitle}</p>
          <p className="helper-text">{headerCopy.note}</p>
        </div>
        {canCreate && (
          <button className="btn btn-primary" onClick={() => navigate("/applications")}>
            New Application
          </button>
        )}
      </header>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      {(canCreate || canUpdate || canDelete) && (
        <section className="form-grid">
          {canCreate && (
            <form className="form-card" onSubmit={handleCreate}>
              <h3>Create Application</h3>
              <input
                className="input"
                placeholder="Job ID"
                type="number"
                value={createForm.job_id}
                onChange={(e) => setCreateForm({ ...createForm, job_id: e.target.value })}
                required
              />
              <button className="btn btn-primary">Create</button>
            </form>
          )}

          {canUpdate && (
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
          )}

          {canDelete && (
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
          )}
        </section>
      )}

      <section className="pipeline-grid">
        {["pending", "accepted", "rejected"].map((status) => (
          <div key={status} className={`pipeline-column status-${status}`}>
            <h3>{status}</h3>
            {grouped[status].map((app) => (
              <div key={app.id} className="pipeline-card">
                {role === "user" ? (
                  <>
                    <p className="name">Job #{app.job_id}</p>
                    <p className="role">Application #{app.id}</p>
                  </>
                ) : (
                  <>
                    <p className="name">Candidate #{app.user_id}</p>
                    <p className="role">Job #{app.job_id}</p>
                  </>
                )}
                <p className="meta">Applied {app.created_at?.slice(0, 10)}</p>
                {role === "user" && (
                  <button
                    className="btn btn-ghost"
                    onClick={() => navigate(`/jobs`)}
                  >
                    Browse Jobs
                  </button>
                )}
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
