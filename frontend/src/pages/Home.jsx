import { Link } from "react-router-dom";
import { getAuthRole, getAuthToken } from "../api";
import "./Home.css";

export default function Home() {
  const role = getAuthRole();
  const authed = !!getAuthToken();
  const effectiveRole = role || "user";
  const heroCopy = authed
    ? effectiveRole === "admin"
      ? {
          title: "Oversee Somedeed operations with clarity.",
          subtitle: "Review employers, profiles, and application activity in one place."
        }
      : effectiveRole === "employer"
        ? {
            title: "Hire your next team with Somedeed.",
            subtitle: "Post roles, review applicants, and keep your company profile current."
          }
        : {
            title: "Find roles that fit your goals.",
            subtitle: "Browse jobs, save favorites, and review your application history."
          }
    : {
        title: "Find your next role, or Hire your next team!",
        subtitle:
          "A small scale platform for jobseekers, profiles, applications, and employers."
      };

  const features = authed
    ? effectiveRole === "admin"
      ? [
          { title: "Employers", body: "Monitor employer profiles and onboarding progress." },
          { title: "Profiles", body: "Review candidate profiles and account activity." },
          { title: "Applications", body: "Audit pipeline health and outcomes." },
          { title: "Jobs", body: "Track listings and flag outdated roles." }
        ]
      : effectiveRole === "employer"
        ? [
            { title: "Jobs", body: "Post and manage roles with salary, location, and descriptions." },
            { title: "Applications", body: "Create and update application statuses for candidates." },
            { title: "Company Profile", body: "Keep your employer profile accurate and discoverable." },
            { title: "Candidates", body: "Browse candidate profiles and reach out fast." }
          ]
        : [
            { title: "Jobs", body: "Browse openings that match your skills and interests." },
            { title: "My Profile", body: "Showcase your experience, skills, and availability." },
            { title: "Applications", body: "Review your application history and statuses." },
            { title: "Employers", body: "Learn about companies and hiring teams." }
          ]
    : [
        { title: "Jobs", body: "Post and manage roles with salary, location, and descriptions." },
        { title: "Job Seekers", body: "Build candidate profiles with bios and role history." },
        { title: "Applications", body: "Track applications with status updates and timestamps." },
        { title: "Employers", body: "Organize companies and contact points for recruiting candidates." }
      ];

  return (
    <main className="page page-home">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Somedeed Job Board</p>
          <h1 className="title">{heroCopy.title}</h1>
          <p className="subtitle">{heroCopy.subtitle}</p>
          <div className="actions">
            {authed ? (
              <>
                {effectiveRole === "admin" && (
                  <Link className="btn btn-primary" to="/admin">Go to Admin</Link>
                )}
                {effectiveRole === "employer" && (
                  <Link className="btn btn-primary" to="/jobs">Manage Jobs</Link>
                )}
                {effectiveRole === "user" && (
                  <Link className="btn btn-primary" to="/jobs">Browse Jobs</Link>
                )}
                {effectiveRole === "user" && (
                  <Link className="btn btn-ghost" to="/applications">Application History</Link>
                )}
                {effectiveRole === "employer" && (
                  <Link className="btn btn-ghost" to="/my-employer">Company Profile</Link>
                )}
                {effectiveRole === "admin" && (
                  <Link className="btn btn-ghost" to="/employers">Review Employers</Link>
                )}
              </>
            ) : (
              <>
                <Link className="btn btn-primary" to="/login">Log In to Browse Jobs</Link>
                <Link className="btn btn-ghost" to="/register">Create An Account</Link>
              </>
            )}
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
        {features.map((feature) => (
          <article key={feature.title} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </article>
        ))}
      </section>

      <footer className="page-footer">
        <p>Copyright © 2026 Jazmyn Nathaniel. All rights reserved.</p>
      </footer>
    </main>
  );
}
