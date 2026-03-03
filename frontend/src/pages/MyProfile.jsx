import { useEffect, useState } from "react";
import { getMyProfile, createMyProfile, updateMyProfile, deleteMyProfile, clearAuthToken } from "../api";
import "./MyProfile.css";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    bio: "",
    job_experience: "",
    current_position: "",
    current_position_start: "",
    last_position: "",
    last_position_start: "",
    last_position_end: "",
    skills: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUnauthorized = (err) => {
    if (err && String(err.message || "").includes("401")) {
      clearAuthToken();
      setMessage("");
      setError("Please log in to manage your profile.");
      window.location.assign("/login");
      return true;
    }
    return false;
  };

  const load = () => {
    setError("");
    getMyProfile()
      .then((data) => {
        setProfile(data);
        setForm({
          full_name: data.full_name || "",
          bio: data.bio || "",
          job_experience: data.job_experience || "",
          current_position: data.current_position || "",
          current_position_start: data.current_position_start || "",
          last_position: data.last_position || "",
          last_position_start: data.last_position_start || "",
          last_position_end: data.last_position_end || "",
          skills: data.skills || ""
        });
      })
      .catch((err) => {
        if (!handleUnauthorized(err)) {
          setError(err.message || "Failed to load profile");
        }
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const data = await createMyProfile(form);
      setProfile(data);
      setMessage("Profile created.");
    } catch (err) {
      if (!handleUnauthorized(err)) {
        setError(err.message || "Failed to create profile");
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const data = await updateMyProfile(form);
      setProfile(data);
      setMessage("Profile updated.");
    } catch (err) {
      if (!handleUnauthorized(err)) {
        setError(err.message || "Failed to update profile");
      }
    }
  };

  const handleDelete = async () => {
    setMessage("");
    setError("");
    try {
      await deleteMyProfile();
      setProfile(null);
      setMessage("Profile deleted.");
    } catch (err) {
      if (!handleUnauthorized(err)) {
        setError(err.message || "Failed to delete profile");
      }
    }
  };

  return (
    <main className="page page-my-profile">
      <header className="page-header">
        <div>
          <p className="eyebrow">My Profile</p>
          <h1 className="title">Manage your profile</h1>
          <p className="subtitle">Update your information or delete your profile.</p>
          <p className="helper-text">Candidate access: keep your experience and skills current.</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      {profile ? (
        <section className="profile-panel">
          <div className="profile-summary">
            <h3>{profile.full_name}</h3>
            <p>{profile.bio || "No bio provided."}</p>
            {profile.current_position && (
              <p className="meta">Current: {profile.current_position}</p>
            )}
            {profile.last_position && (
              <p className="meta">Last: {profile.last_position}</p>
            )}
            <p className="meta">Profile ID {profile.id}</p>
          </div>

          <form className="form-card" onSubmit={handleUpdate}>
            <h3>Edit Profile</h3>
            <input
              className="input"
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
            />
            <textarea
              className="input textarea"
              placeholder="Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
            <textarea
              className="input textarea"
              placeholder="Job experience"
              value={form.job_experience}
              onChange={(e) => setForm({ ...form, job_experience: e.target.value })}
            />
            <input
              className="input"
              placeholder="Current position"
              value={form.current_position}
              onChange={(e) => setForm({ ...form, current_position: e.target.value })}
            />
            <input
              className="input"
              placeholder="Current position start (e.g., 2024-05)"
              value={form.current_position_start}
              onChange={(e) => setForm({ ...form, current_position_start: e.target.value })}
            />
            <input
              className="input"
              placeholder="Last position"
              value={form.last_position}
              onChange={(e) => setForm({ ...form, last_position: e.target.value })}
            />
            <input
              className="input"
              placeholder="Last position start (e.g., 2022-01)"
              value={form.last_position_start}
              onChange={(e) => setForm({ ...form, last_position_start: e.target.value })}
            />
            <input
              className="input"
              placeholder="Last position end (e.g., 2023-12)"
              value={form.last_position_end}
              onChange={(e) => setForm({ ...form, last_position_end: e.target.value })}
            />
            <input
              className="input"
              placeholder="Skills (comma-separated)"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />
            <button className="btn btn-primary">Save changes</button>
          </form>

          <div className="danger-card">
            <h3>Delete Profile</h3>
            <p>This permanently removes your profile.</p>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete my profile
            </button>
          </div>
        </section>
      ) : (
        <div className="empty-card">
          <p>No profile found. Create one below.</p>
          <form className="form-card" onSubmit={handleCreate}>
            <h3>Create Profile</h3>
            <input
              className="input"
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
            />
            <textarea
              className="input textarea"
              placeholder="Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
            <textarea
              className="input textarea"
              placeholder="Job experience"
              value={form.job_experience}
              onChange={(e) => setForm({ ...form, job_experience: e.target.value })}
            />
            <input
              className="input"
              placeholder="Current position"
              value={form.current_position}
              onChange={(e) => setForm({ ...form, current_position: e.target.value })}
            />
            <input
              className="input"
              placeholder="Current position start (e.g., 2024-05)"
              value={form.current_position_start}
              onChange={(e) => setForm({ ...form, current_position_start: e.target.value })}
            />
            <input
              className="input"
              placeholder="Last position"
              value={form.last_position}
              onChange={(e) => setForm({ ...form, last_position: e.target.value })}
            />
            <input
              className="input"
              placeholder="Last position start (e.g., 2022-01)"
              value={form.last_position_start}
              onChange={(e) => setForm({ ...form, last_position_start: e.target.value })}
            />
            <input
              className="input"
              placeholder="Last position end (e.g., 2023-12)"
              value={form.last_position_end}
              onChange={(e) => setForm({ ...form, last_position_end: e.target.value })}
            />
            <input
              className="input"
              placeholder="Skills (comma-separated)"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />
            <button className="btn btn-primary">Create profile</button>
          </form>
        </div>
      )}
    </main>
  );
}
