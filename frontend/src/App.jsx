import { useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import { getAuthToken, getAuthRole, clearAuthToken } from "./api";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Employers from "./pages/Employers";
import Profiles from "./pages/Profiles";
import Applications from "./pages/Applications";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyProfile from "./pages/MyProfile";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MyEmployer from "./pages/MyEmployer";

function App() {
  const [authed, setAuthed] = useState(!!getAuthToken());
  const [role, setRole] = useState(getAuthRole());

  useEffect(() => {
    return () => {};
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setAuthed(false);
    setRole(null);
  };

  return (
    <div className="min-h-screen bg-black text-purple-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-4 rounded-2xl border border-cyan-300/40 bg-purple-950/70 p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
          
              </p>
              <h1 className="text-2xl font-semibold text-white">Welcome to Somedeed!</h1>
            </div>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm">
            <NavLink className="nav-link" to="/">Home</NavLink>
            {authed && <NavLink className="nav-link" to="/jobs">Jobs</NavLink>}
            {authed && role === "admin" && (
              <NavLink className="nav-link" to="/employers">Employers</NavLink>
            )}
            {authed && role === "admin" && (
              <NavLink className="nav-link" to="/profiles">Profiles</NavLink>
            )}
            {authed && <NavLink className="nav-link" to="/applications">Applications</NavLink>}
            {authed && role === "user" && (
              <NavLink className="nav-link" to="/my-profile">My Profile</NavLink>
            )}
            {authed && role === "employer" && (
              <NavLink className="nav-link" to="/my-employer">My Employer</NavLink>
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
          {authed && role === "admin" && (
            <Route path="/employers" element={<Employers />} />
          )}
          {authed && role === "admin" && (
            <Route path="/profiles" element={<Profiles />} />
          )}
          {authed && <Route path="/applications" element={<Applications />} />}
          {authed && role === "user" && (
            <Route path="/my-profile" element={<MyProfile />} />
          )}
          {authed && role === "employer" && (
            <Route path="/my-employer" element={<MyEmployer />} />
          )}
          <Route path="/admin-login" element={<AdminLogin />} />
          {authed && role === "admin" && (
            <Route path="/admin" element={<AdminDashboard />} />
          )}
          {!authed && <Route path="/login" element={<Login />} />}
          {!authed && <Route path="/register" element={<Register />} />}
        </Routes>

        <footer className="mt-6 border-t border-cyan-300/20 pt-4 text-xs text-purple-300">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>Somedeed · Admin access is monitored.</span>
            <NavLink className="nav-link" to="/admin-login">Admin Login</NavLink>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
