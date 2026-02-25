import { useEffect, useState } from "react";
import { listJobs, createJob, updateJob, deleteJob, getAuthRole } from "../api";
import "./Jobs.css";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const role = getAuthRole();
  const canManageJobs = role === "employer" || role === "admin";
  const [filters, setFilters] = useState({
    query: "",
    location: "",
    salaryRange: "",
    sort: ""
  });
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    employer_id: ""
  });
  const [updateForm, setUpdateForm] = useState({
    id: "",
    title: "",
    description: "",
    location: "",
    salary: "",
    employer_id: ""
  });
  const [deleteId, setDeleteId] = useState("");

  const buildParams = (nextFilters) => {
    const params = {};
    if (nextFilters.query.trim()) params.query = nextFilters.query.trim();
    if (nextFilters.location.trim()) params.location = nextFilters.location.trim();
    if (nextFilters.salaryRange === "40-60") {
      params.min_salary = 40000;
      params.max_salary = 60000;
    } else if (nextFilters.salaryRange === "60-90") {
      params.min_salary = 60000;
      params.max_salary = 90000;
    } else if (nextFilters.salaryRange === "90+") {
      params.min_salary = 90000;
    }
    if (nextFilters.sort) params.sort = nextFilters.sort;
    return params;
  };

  const refresh = (nextFilters = filters) => {
    listJobs(buildParams(nextFilters))
      .then((data) => setJobs(data || []))
      .catch((err) => setError(err.message || "Failed to load jobs"));
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleFilter = () => {
    setError("");
    setMessage("");
    refresh(filters);
  };

  const handleClearFilters = () => {
    const cleared = { query: "", location: "", salaryRange: "", sort: "" };
    setFilters(cleared);
    setError("");
    setMessage("");
    refresh(cleared);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await createJob({
        ...createForm,
        salary: Number(createForm.salary),
        employer_id: Number(createForm.employer_id)
      });
      setMessage("Job created.");
      setCreateForm({
        title: "",
        description: "",
        location: "",
        salary: "",
        employer_id: ""
      });
      refresh(filters);
    } catch (err) {
      setError(err.message || "Failed to create job");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const payload = {};
      if (updateForm.title) payload.title = updateForm.title;
      if (updateForm.description) payload.description = updateForm.description;
      if (updateForm.location) payload.location = updateForm.location;
      if (updateForm.salary) payload.salary = Number(updateForm.salary);
      if (updateForm.employer_id) payload.employer_id = Number(updateForm.employer_id);
      await updateJob(updateForm.id, payload);
      setMessage("Job updated.");
      setUpdateForm({
        id: "",
        title: "",
        description: "",
        location: "",
        salary: "",
        employer_id: ""
      });
      refresh(filters);
    } catch (err) {
      setError(err.message || "Failed to update job");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await deleteJob(deleteId);
      setMessage("Job deleted.");
      setDeleteId("");
      refresh(filters);
    } catch (err) {
      setError(err.message || "Failed to delete job");
    }
  };

  return (
    <main className="page page-jobs">
      <header className="page-header">
        <div>
          <p className="eyebrow">Jobs</p>
          <h1 className="title">Open roles</h1>
          <p className="subtitle">Search, filter, and create roles.</p>
        </div>
        {canManageJobs && <button className="btn btn-primary">Post a Job</button>}
      </header>

      <section className="filter-bar">
        <input
          className="input"
          placeholder="Search titles or keywords"
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
        />
        <input
          className="input"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <select
          className="input"
          value={filters.salaryRange}
          onChange={(e) => setFilters({ ...filters, salaryRange: e.target.value })}
        >
          <option value="">Salary range</option>
          <option value="40-60">$40k - $60k</option>
          <option value="60-90">$60k - $90k</option>
          <option value="90+">$90k+</option>
        </select>
        <select
          className="input"
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="">Sort</option>
          <option value="alpha">Alphabetical</option>
          <option value="relevance">Relevance</option>
        </select>
        <div className="filter-actions">
          <button type="button" className="btn btn-ghost" onClick={handleFilter}>
            Filter
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleClearFilters}>
            Clear
          </button>
        </div>
      </section>
      {filters.sort === "relevance" && !filters.query.trim() && (
        <p className="helper-text">
          Relevance sorting is based on your search terms. Add a keyword to refine results.
        </p>
      )}

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      {canManageJobs && (
        <section className="form-grid">
          <form className="form-card" onSubmit={handleCreate}>
            <h3>Create Job</h3>
            <input
              className="input"
              placeholder="Title"
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Location"
              value={createForm.location}
              onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Salary"
              type="number"
              value={createForm.salary}
              onChange={(e) => setCreateForm({ ...createForm, salary: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Employer ID"
              type="number"
              value={createForm.employer_id}
              onChange={(e) => setCreateForm({ ...createForm, employer_id: e.target.value })}
              required
            />
            <textarea
              className="input textarea"
              placeholder="Description"
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              required
            />
            <button className="btn btn-primary">Create</button>
          </form>

          <form className="form-card" onSubmit={handleUpdate}>
            <h3>Update Job</h3>
            <input
              className="input"
              placeholder="Job ID"
              type="number"
              value={updateForm.id}
              onChange={(e) => setUpdateForm({ ...updateForm, id: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Title"
              value={updateForm.title}
              onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
            />
            <input
              className="input"
              placeholder="Location"
              value={updateForm.location}
              onChange={(e) => setUpdateForm({ ...updateForm, location: e.target.value })}
            />
            <input
              className="input"
              placeholder="Salary"
              type="number"
              value={updateForm.salary}
              onChange={(e) => setUpdateForm({ ...updateForm, salary: e.target.value })}
            />
            <input
              className="input"
              placeholder="Employer ID"
              type="number"
              value={updateForm.employer_id}
              onChange={(e) => setUpdateForm({ ...updateForm, employer_id: e.target.value })}
            />
            <textarea
              className="input textarea"
              placeholder="Description"
              value={updateForm.description}
              onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
            />
            <button className="btn btn-ghost">Update</button>
          </form>

          <form className="form-card" onSubmit={handleDelete}>
            <h3>Delete Job</h3>
            <input
              className="input"
              placeholder="Job ID"
              type="number"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
              required
            />
            <button className="btn btn-danger">Delete</button>
          </form>
        </section>
      )}

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
            <p className="job-desc">
              {job.description}
            </p>
            <div className="job-meta">
              <span>Employer #{job.employer_id}</span>
              <span>Job ID {job.id}</span>
            </div>
          </article>
        ))}
        {jobs.length === 0 && !error && (
          <div className="empty-card">No jobs available yet.</div>
        )}
      </section>
    </main>
  );
}
