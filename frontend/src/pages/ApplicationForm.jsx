import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationForm, submitApplication, listApplications, formatApiError } from "../api";
import "./Applications.css";

export default function ApplicationForm() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [formInfo, setFormInfo] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    resume_url: "",
    cover_letter: ""
  });
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getApplicationForm(jobId)
      .then((data) => setFormInfo(data))
      .catch((err) => setError(formatApiError(err, "Failed to load application form")));
    listApplications()
      .then((data) => {
        const applied = (data || []).some((app) => Number(app.job_id) === Number(jobId));
        setAlreadyApplied(applied);
      })
      .catch(() => {});
  }, [jobId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await submitApplication({
        job_id: Number(jobId),
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        resume_url: form.resume_url || undefined,
        cover_letter: form.cover_letter || undefined
      });
      setMessage("Application submitted.");
      setAlreadyApplied(true);
      setTimeout(() => navigate("/applications"), 800);
    } catch (err) {
      setError(formatApiError(err, "Failed to submit application"));
    }
  };

  return (
    <main className="page page-applications">
      <header className="page-header">
        <div>
          <p className="eyebrow">Application</p>
          <h1 className="title">Apply for {formInfo?.job_title || "this role"}</h1>
          <p className="subtitle">
            {formInfo ? `${formInfo.job_location} · Employer #${formInfo.employer_id}` : ""}
          </p>
          <p className="helper-text">
            Candidate access: complete and submit your application once.
          </p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}
      {alreadyApplied && (
        <div className="success-banner">You already applied to this job.</div>
      )}

      <section className="form-grid">
        <form className="form-card" onSubmit={handleSubmit}>
          <h3>Applicant information</h3>
          <input
            className="input"
            placeholder="Full name"
            value={form.full_name}
            onChange={(event) => setForm({ ...form, full_name: event.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Phone"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Resume URL (optional)"
            value={form.resume_url}
            onChange={(event) => setForm({ ...form, resume_url: event.target.value })}
          />
          <textarea
            className="input textarea"
            placeholder="Cover letter (optional)"
            value={form.cover_letter}
            onChange={(event) => setForm({ ...form, cover_letter: event.target.value })}
          />
          <button className="btn btn-primary" disabled={alreadyApplied}>
            Submit application
          </button>
        </form>
      </section>
    </main>
  );
}
