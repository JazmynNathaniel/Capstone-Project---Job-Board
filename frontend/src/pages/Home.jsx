import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <main className="page page-home">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Somedeed Job Board</p>
          <h1 className="title">Find your next role, or Hire your next team!</h1>
          <p className="subtitle">
            A small scale platform for jobseekers, profiles, applications, and
            employers. 
          </p>
          <div className="actions">
            <Link className="btn btn-primary" to="/login">Login To Browse Jobs</Link>
            <Link className="btn btn-ghost" to="/register">Create An Account</Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="stat-card">
            <p className="stat-label">Open Roles</p>
            <p className="stat-value">128</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Applicants</p>
            <p className="stat-value">3,402</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Companies</p>
            <p className="stat-value">54</p>
          </div>
        </div>
      </section>

      <section className="section-grid">
        <article className="feature-card">
          <h3>Jobs</h3>
          <p>Post and manage roles with salary, location, and descriptions.</p>
        </article>
        <article className="feature-card">
          <h3>Job Seekers</h3>
          <p>Build candidate profiles with bios and role history.</p>
        </article>
        <article className="feature-card">
          <h3>Applications</h3>
          <p>Track applications with status updates and timestamps.</p>
        </article>
        <article className="feature-card">
          <h3>Employers</h3>
          <p>Organize companies and contact points for recruiting candidates.</p>
        </article>
      </section>
    </main>
  );
}
