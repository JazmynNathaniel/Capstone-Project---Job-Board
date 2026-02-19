import { useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import { getHealth, getAuthToken, getAuthRole, clearAuthToken } from "./api";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Employers from "./pages/Employers";
import Profiles from "./pages/Profiles";
import Applications from "./pages/Applications";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyProfile from "./pages/MyProfile";

function App() {
  const [health, setHealth] = useState("checking...");
  const [authed, setAuthed] = useState(!!getAuthToken());
  const [role, setRole] = useState(getAuthRole());

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

  const handleLogout = () => {
    clearAuthToken();
    setAuthed(false);
    setRole(null);
  };

  return (
    <div className="min-h-screen bg-black text-purple-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-4 rounded-2xl border border-cyan-300/40 bg-purple-950/70 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                Somedeed Platform
              </p>
              <h1 className="text-2xl font-semibold text-white">Capstone Job Board</h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-purple-200">
              <span>Status:</span>
              <span className="rounded-full bg-purple-900 px-3 py-1 text-cyan-200">{health}</span>
            </div>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm">
            <NavLink className="nav-link" to="/">Home</NavLink>
            {authed && <NavLink className="nav-link" to="/jobs">Jobs</NavLink>}
            {authed && (role === "employer" || role === "admin") && (
              <NavLink className="nav-link" to="/employers">Employers</NavLink>
            )}
            {authed && role === "admin" && (
              <NavLink className="nav-link" to="/profiles">Profiles</NavLink>
            )}
            {authed && <NavLink className="nav-link" to="/applications">Applications</NavLink>}
            {authed && role === "user" && (
              <NavLink className="nav-link" to="/my-profile">My Profile</NavLink>
            )}
            {!authed && <NavLink className="nav-link" to="/login">Login</NavLink>}
            {!authed && <NavLink className="nav-link" to="/register">Register</NavLink>}
            {authed && (
              <button className="nav-link" onClick={handleLogout}>Logout</button>
            )}
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          {authed && <Route path="/jobs" element={<Jobs />} />}
          {authed && (role === "employer" || role === "admin") && (
            <Route path="/employers" element={<Employers />} />
          )}
          {authed && role === "admin" && (
            <Route path="/profiles" element={<Profiles />} />
          )}
          {authed && <Route path="/applications" element={<Applications />} />}
          {authed && role === "user" && (
            <Route path="/my-profile" element={<MyProfile />} />
          )}
          {!authed && <Route path="/login" element={<Login />} />}
          {!authed && <Route path="/register" element={<Register />} />}
        </Routes>
      </div>
    </div>
  );
}

export default App;
