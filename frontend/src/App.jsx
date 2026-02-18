import { useEffect, useState } from "react";
import { getHealth, listJobs, createJob, createProfile, createApplication } from "./api";

function App() {
  const [health, setHealth] = useState("checking...");
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState("");
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    employer_id: ""
  });
  const [profileForm, setProfileForm] = useState({
    user_id: "",
    full_name: "",
    bio: ""
  });
  const [applicationForm, setApplicationForm] = useState({
    user_id: "",
    job_id: "",
    status: "pending"
  });
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    getHealth()
      .then((data) => {
        if (isMounted) setHealth(data.status || "ok");
      })
      .catch(() => {
        if (isMounted) setHealth("offline");
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoadJobs = async () => {
    setLoadingJobs(true);
    setError("");
    try {
      const data = await listJobs();
      setJobs(data || []);
    } catch (err) {
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setFormMessage("");
    try {
      const payload = {
        ...jobForm,
        salary: Number(jobForm.salary),
        employer_id: Number(jobForm.employer_id)
      };
      await createJob(payload);
      setFormMessage("Job created.");
      setJobForm({
        title: "",
        description: "",
        location: "",
        salary: "",
        employer_id: ""
      });
      await handleLoadJobs();
    } catch (err) {
      setFormMessage(err.message || "Failed to create job");
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setFormMessage("");
    try {
      const payload = {
        ...profileForm,
        user_id: Number(profileForm.user_id)
      };
      await createProfile(payload);
      setFormMessage("Profile created.");
      setProfileForm({ user_id: "", full_name: "", bio: "" });
    } catch (err) {
      setFormMessage(err.message || "Failed to create profile");
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setFormMessage("");
    try {
      const payload = {
        ...applicationForm,
        user_id: Number(applicationForm.user_id),
        job_id: Number(applicationForm.job_id)
      };
      await createApplication(payload);
      setFormMessage("Application created.");
      setApplicationForm({ user_id: "", job_id: "", status: "pending" });
    } catch (err) {
      setFormMessage(err.message || "Failed to create application");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
              Somedeed Platform
            </p>
            <h1 className="text-4xl font-semibold text-white">
              Jobs, Profiles, and Applications
            </h1>
            <p className="max-w-2xl text-slate-300">
              This starter UI connects to your Flask API and pulls live data.
              Update the API URL in <code className="text-cyan-300">frontend/.env</code>.
            </p>
          </header>

          <section className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">API Status</p>
                <p className="text-lg font-medium text-white">{health}</p>
              </div>
              <button
                className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-300"
                onClick={handleLoadJobs}
                disabled={loadingJobs}
              >
                {loadingJobs ? "Loading..." : "Load Jobs"}
              </button>
            </div>
            {error && (
              <div className="rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">
                {error}
              </div>
            )}
          </section>

          <section className="grid gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Jobs</h2>
              <span className="text-sm text-slate-400">
                {jobs.length} results
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {jobs.length === 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-slate-400">
                  No jobs loaded yet. Click “Load Jobs” to fetch data.
                </div>
              )}
              {jobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {job.title}
                      </h3>
                      <p className="text-sm text-slate-400">{job.location}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      ${job.salary}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">
                    {job.description}
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    Employer ID: {job.employer_id}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Create Records</h2>
              {formMessage && (
                <span className="text-sm text-cyan-300">{formMessage}</span>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <form onSubmit={handleJobSubmit} className="grid gap-3">
                <h3 className="text-sm font-semibold text-slate-300">New Job</h3>
                <input
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="Title"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  required
                />
                <input
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="Location"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  required
                />
                <input
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="Salary"
                  type="number"
                  value={jobForm.salary}
                  onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                  required
                />
                <input
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="Employer ID"
                  type="number"
                  value={jobForm.employer_id}
                  onChange={(e) => setJobForm({ ...jobForm, employer_id: e.target.value })}
                  required
                />
                <textarea
                  className="min-h-[90px] rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="Description"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  required
                />
                <button className="rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-300">
                  Create Job
                </button>
              </form>

              <form onSubmit={handleProfileSubmit} className="grid gap-3">
                <h3 className="text-sm font-semibold text-slate-300">New Profile</h3>
                <input
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="User ID"
                  type="number"
                  value={profileForm.user_id}
                  onChange={(e) => setProfileForm({ ...profileForm, user_id: e.target.value })}
                  required
                />
                <input
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="Full Name"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                  required
                />
                <textarea
                  className="min-h-[90px] rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="Bio"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                />
                <button className="rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-300">
                  Create Profile
                </button>
              </form>

              <form onSubmit={handleApplicationSubmit} className="grid gap-3">
                <h3 className="text-sm font-semibold text-slate-300">New Application</h3>
                <input
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="User ID"
                  type="number"
                  value={applicationForm.user_id}
                  onChange={(e) => setApplicationForm({ ...applicationForm, user_id: e.target.value })}
                  required
                />
                <input
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="Job ID"
                  type="number"
                  value={applicationForm.job_id}
                  onChange={(e) => setApplicationForm({ ...applicationForm, job_id: e.target.value })}
                  required
                />
                <select
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                  value={applicationForm.status}
                  onChange={(e) => setApplicationForm({ ...applicationForm, status: e.target.value })}
                >
                  <option value="pending">pending</option>
                  <option value="accepted">accepted</option>
                  <option value="rejected">rejected</option>
                </select>
                <button className="rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-300">
                  Create Application
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
