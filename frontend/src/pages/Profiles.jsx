import { useEffect, useState } from "react";
import { listProfiles, createProfile, updateProfile, deleteProfile } from "../api";
import "./Profiles.css";

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [createForm, setCreateForm] = useState({
    user_id: "",
    full_name: "",
    bio: ""
  });
  const [updateForm, setUpdateForm] = useState({
    id: "",
    user_id: "",
    full_name: "",
    bio: ""
  });
  const [deleteId, setDeleteId] = useState("");

  const refresh = () => {
    listProfiles()
      .then((data) => setProfiles(data || []))
      .catch((err) => setError(err.message || "Failed to load profiles"));
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await createProfile({
        ...createForm,
        user_id: Number(createForm.user_id)
      });
      setMessage("Profile created.");
      setCreateForm({ user_id: "", full_name: "", bio: "" });
      refresh();
    } catch (err) {
      setError(err.message || "Failed to create profile");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const payload = {};
      if (updateForm.user_id) payload.user_id = Number(updateForm.user_id);
      if (updateForm.full_name) payload.full_name = updateForm.full_name;
      if (updateForm.bio) payload.bio = updateForm.bio;
      await updateProfile(updateForm.id, payload);
      setMessage("Profile updated.");
      setUpdateForm({ id: "", user_id: "", full_name: "", bio: "" });
      refresh();
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await deleteProfile(deleteId);
      setMessage("Profile deleted.");
      setDeleteId("");
      refresh();
    } catch (err) {
      setError(err.message || "Failed to delete profile");
    }
  };

  return (
    <main className="page page-profiles">
      <header className="page-header">
        <div>
          <p className="eyebrow">Profiles</p>
          <h1 className="title">Candidate profiles</h1>
          <p className="subtitle">Manage candidate bios and readiness.</p>
        </div>
        <button className="btn btn-primary">Add Profile</button>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      <section className="form-grid">
        <form className="form-card" onSubmit={handleCreate}>
          <h3>Create Profile</h3>
          <input
            className="input"
            placeholder="User ID"
            type="number"
            value={createForm.user_id}
            onChange={(e) => setCreateForm({ ...createForm, user_id: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Full Name"
            value={createForm.full_name}
            onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
            required
          />
          <textarea
            className="input textarea"
            placeholder="Bio"
            value={createForm.bio}
            onChange={(e) => setCreateForm({ ...createForm, bio: e.target.value })}
          />
          <button className="btn btn-primary">Create</button>
        </form>

        <form className="form-card" onSubmit={handleUpdate}>
          <h3>Update Profile</h3>
          <input
            className="input"
            placeholder="Profile ID"
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
            placeholder="Full Name"
            value={updateForm.full_name}
            onChange={(e) => setUpdateForm({ ...updateForm, full_name: e.target.value })}
          />
          <textarea
            className="input textarea"
            placeholder="Bio"
            value={updateForm.bio}
            onChange={(e) => setUpdateForm({ ...updateForm, bio: e.target.value })}
          />
          <button className="btn btn-ghost">Update</button>
        </form>

        <form className="form-card" onSubmit={handleDelete}>
          <h3>Delete Profile</h3>
          <input
            className="input"
            placeholder="Profile ID"
            type="number"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
            required
          />
          <button className="btn btn-danger">Delete</button>
        </form>
      </section>

      <section className="card-grid">
        {profiles.map((profile) => (
          <article key={profile.id} className="profile-card">
            <div>
              <h3>{profile.full_name}</h3>
              <p>User #{profile.user_id}</p>
            </div>
            <p className="profile-bio">
              {profile.bio || "No bio provided."}
            </p>
            <div className="profile-meta">
              <span>Profile ID {profile.id}</span>
              <span>Created {profile.created_at?.slice(0, 10)}</span>
            </div>
          </article>
        ))}
        {profiles.length === 0 && !error && (
          <div className="empty-card">No profiles yet.</div>
        )}
      </section>
    </main>
  );
}
