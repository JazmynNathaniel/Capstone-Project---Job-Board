import { useEffect, useState } from "react";
import { getMyProfile, createMyProfile, updateMyProfile, deleteMyProfile } from "../api";
import "./MyProfile.css";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ full_name: "", bio: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    setError("");
    getMyProfile()
      .then((data) => {
        setProfile(data);
        setForm({
          full_name: data.full_name || "",
          bio: data.bio || ""
        });
      })
      .catch((err) => setError(err.message || "Failed to load profile"));
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
      setError(err.message || "Failed to create profile");
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
      setError(err.message || "Failed to update profile");
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
      setError(err.message || "Failed to delete profile");
    }
  };

  return (
    <main className="page page-my-profile">
      <header className="page-header">
        <div>
          <p className="eyebrow">My Profile</p>
          <h1 className="title">Manage your profile</h1>
          <p className="subtitle">Update your information or delete your profile.</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      {profile ? (
        <section className="profile-panel">
          <div className="profile-summary">
            <h3>{profile.full_name}</h3>
            <p>{profile.bio || "No bio provided."}</p>
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
            <button className="btn btn-primary">Create profile</button>
          </form>
        </div>
      )}
    </main>
  );
}
