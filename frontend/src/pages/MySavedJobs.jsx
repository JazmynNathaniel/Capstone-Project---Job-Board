import { useEffect, useState } from "react";
import { listSavedJobs, listJobs, unsaveJob } from "../api";
import "./MySavedJobs.css";

export default function MySavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setError("");
    try {
      const saved = await listSavedJobs();
      const ids = new Set((saved || []).map((s) => s.job_id));
      const allJobs = await listJobs();
      const filtered = (allJobs || []).filter((j) => ids.has(j.id));
      setJobs(filtered);
    } catch (err) {
      setError(err.message || "Failed to load saved jobs");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (jobId) => {
    setMessage("");
    setError("");
    try {
      await unsaveJob(jobId);
      setMessage("Removed from saved jobs.");
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      setError(err.message || "Failed to remove job");
    }
  };

  return (
    <main className="page page-saved-jobs">
      <header className="page-header">
        <div>
          <p className="eyebrow">Saved Jobs</p>
          <h1 className="title">My saved jobs</h1>
          <p className="subtitle">Keep track of roles you want to revisit.</p>
          <p className="helper-text">Candidate access: remove jobs when you're no longer interested.</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      <section className="card-grid">
        {jobs.map((job) => (
          <article key={job.id} className="job-card">
            <div className="job-head">
              <div>
                <h3>{job.title}</h3>
                <p>{job.location}</p>
              </div>
              <span className="pill">${job.salary}</span>
            </div>
            <p className="job-desc">{job.description}</p>
            <div className="job-meta">
              <span>Employer #{job.employer_id}</span>
              <span>Job ID {job.id}</span>
            </div>
            <button className="btn btn-ghost" onClick={() => handleRemove(job.id)}>
              Remove
            </button>
          </article>
        ))}
        {jobs.length === 0 && !error && (
          <div className="empty-card">No saved jobs yet.</div>
        )}
      </section>
    </main>
  );
}
