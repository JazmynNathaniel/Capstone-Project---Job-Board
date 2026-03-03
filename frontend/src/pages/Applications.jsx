import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listApplications,
  updateApplication,
  deleteApplication,
  getAuthRole,
  formatApiError
} from "../api";
import "./Applications.css";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const role = getAuthRole();
  const canUpdate = role === "employer" || role === "admin";
  const canDelete = role === "admin";
  const headerCopy =
    role === "admin"
      ? {
          title: "Oversee application flow",
          subtitle: "Review submissions across employers and roles.",
          note: "Admin access: review, update, or delete any application."
        }
      : role === "employer"
        ? {
            title: "Track candidate flow",
            subtitle: "Monitor pipeline status and progress.",
            note: "Employer access: review and update application statuses."
          }
        : {
            title: "Track your applications",
            subtitle: "Review statuses and next steps.",
            note: "Candidate access: submit and track your applications."
          };
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
      .catch((err) => setError(formatApiError(err, "Failed to load applications")));
  };

  useEffect(() => {
    refresh();
  }, []);

  const grouped = useMemo(() => {
    return {
      pending: applications.filter((a) => a.status === "pending"),
      reviewed: applications.filter((a) => a.status === "reviewed"),
      accepted: applications.filter((a) => a.status === "accepted"),
      rejected: applications.filter((a) => a.status === "rejected")
    };
  }, [applications]);

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
      setError(formatApiError(err, "Failed to update application"));
    }
  };

  const handleQuickStatus = async (applicationId, status) => {
    setError("");
    setMessage("");
    try {
      await updateApplication(applicationId, { status });
      setMessage(`Application marked ${status}.`);
      refresh();
    } catch (err) {
      setError(formatApiError(err, "Failed to update application"));
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
      setError(formatApiError(err, "Failed to delete application"));
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
        {role === "user" && (
          <button className="btn btn-primary" onClick={() => navigate("/jobs")}>
            Browse Jobs
          </button>
        )}
      </header>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      {(canUpdate || canDelete) && (
        <section className="form-grid">
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
                <option value="reviewed">reviewed</option>
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
        {["pending", "reviewed", "accepted", "rejected"].map((status) => (
          <div key={status} className={`pipeline-column status-${status}`}>
            <h3>{status}</h3>
            {grouped[status].map((app) => (
              <div key={app.id} className="pipeline-card">
                {role === "user" ? (
                  <>
                    <p className="name">{app.full_name || `Job #${app.job_id}`}</p>
                    <p className="role">Application #{app.id}</p>
                  </>
                ) : (
                  <>
                    <p className="name">{app.full_name || `Candidate #${app.user_id}`}</p>
                    <p className="role">Job #{app.job_id}</p>
                  </>
                )}
                <p className="meta">Applied {app.created_at?.slice(0, 10)}</p>
                {role !== "user" && app.email && (
                  <p className="meta">{app.email}</p>
                )}
                {role !== "user" && app.phone && (
                  <p className="meta">{app.phone}</p>
                )}
                {role !== "user" && app.resume_url && (
                  <p className="meta">Resume: {app.resume_url}</p>
                )}
                {role !== "user" && app.cover_letter && (
                  <p className="meta">Cover letter: {app.cover_letter}</p>
                )}
                {role !== "user" && (
                  <div className="status-actions">
                    {["pending", "reviewed", "accepted", "rejected"].map((statusOption) => (
                      <button
                        key={statusOption}
                        type="button"
                        className={`status-pill status-${statusOption} ${
                          app.status === statusOption ? "is-active" : ""
                        }`}
                        onClick={() => handleQuickStatus(app.id, statusOption)}
                      >
                        {statusOption}
                      </button>
                    ))}
                  </div>
                )}
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
