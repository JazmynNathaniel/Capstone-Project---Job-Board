import { useEffect, useState } from "react";
import { listUsers, deleteUser } from "../api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const refresh = () => {
    listUsers()
      .then((data) => setUsers(data || []))
      .catch((err) => setError(err.message || "Failed to load users"));
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = async (id) => {
    setError("");
    setMessage("");
    try {
      await deleteUser(id);
      setMessage("User deleted.");
      refresh();
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  return (
    <main className="page page-admin">
      <header className="page-header">
        <div>
          <p className="eyebrow">Admin Console</p>
          <h1 className="title">System management</h1>
          <p className="subtitle">Review jobs, employers, and user accounts.</p>
          <p className="helper-text">Admin access: manage platform-wide records.</p>
        </div>
        <div className="admin-links">
          <a className="btn btn-ghost" href="/jobs">Manage jobs</a>
          <a className="btn btn-ghost" href="/employers">Manage employers</a>
          <a className="btn btn-ghost" href="/profiles">Manage profiles</a>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      <section className="admin-card">
        <h3>Users</h3>
        <div className="table">
          <div className="table-row table-head">
            <span>ID</span>
            <span>Username</span>
            <span>Email</span>
            <span>Role</span>
            <span>Actions</span>
          </div>
          {users.map((user) => (
            <div key={user.id} className="table-row">
              <span>{user.id}</span>
              <span>{user.username}</span>
              <span>{user.email}</span>
              <span>{user.role}</span>
              <span>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </span>
            </div>
          ))}
          {users.length === 0 && (
            <div className="table-empty">No users found.</div>
          )}
        </div>
      </section>
    </main>
  );
}
