import { useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import { getAuthToken, getAuthRole, clearAuthToken } from "./api";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Employers from "./pages/Employers";
import Profiles from "./pages/Profiles";
import Applications from "./pages/Applications";
import ApplicationForm from "./pages/ApplicationForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyProfile from "./pages/MyProfile";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MyEmployer from "./pages/MyEmployer";
import MySavedJobs from "./pages/MySavedJobs";

function App() {
  const [authed, setAuthed] = useState(!!getAuthToken());
  const [role, setRole] = useState(getAuthRole());
  const [a11yOpen, setA11yOpen] = useState(false);
  const [a11yPrefs, setA11yPrefs] = useState(() => {
    const defaults = {
      fontScale: 1,
      highContrast: false,
      dyslexiaFont: false,
      underlineLinks: false,
      reduceMotion: false,
      focusRing: false,
      colorFilter: "none",
      theme: "dark",
    };
    try {
      const stored = localStorage.getItem("a11yPrefs");
      if (stored) return { ...defaults, ...JSON.parse(stored) };
    } catch {
      // Ignore storage errors and fall back to defaults.
    }
    return defaults;
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        setA11yOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--a11y-font-scale", String(a11yPrefs.fontScale));

    const filterMap = {
      none: "none",
      protanopia: "url('#a11y-protanopia')",
      deuteranopia: "url('#a11y-deuteranopia')",
      tritanopia: "url('#a11y-tritanopia')",
      achromatopsia: "grayscale(100%)",
    };
    root.style.setProperty(
      "--a11y-filter",
      filterMap[a11yPrefs.colorFilter] || "none"
    );

    const classToggles = [
      ["a11y-high-contrast", a11yPrefs.highContrast],
      ["a11y-dyslexia-font", a11yPrefs.dyslexiaFont],
      ["a11y-underline-links", a11yPrefs.underlineLinks],
      ["a11y-reduce-motion", a11yPrefs.reduceMotion],
      ["a11y-focus-ring", a11yPrefs.focusRing],
      ["theme-light", a11yPrefs.theme === "light"],
    ];

    classToggles.forEach(([className, enabled]) => {
      if (enabled) {
        root.classList.add(className);
      } else {
        root.classList.remove(className);
      }
    });

    try {
      localStorage.setItem("a11yPrefs", JSON.stringify(a11yPrefs));
    } catch {
      // Ignore storage errors.
    }
  }, [a11yPrefs]);

  const handleLogout = () => {
    clearAuthToken();
    setAuthed(false);
    setRole(null);
  };

  const updateA11yPref = (key, value) => {
    setA11yPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const adjustFontScale = (delta) => {
    const steps = [1, 1.1, 1.2, 1.35, 1.5];
    const currentIndex = steps.findIndex((step) => step === a11yPrefs.fontScale);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = Math.min(
      steps.length - 1,
      Math.max(0, safeIndex + delta)
    );
    updateA11yPref("fontScale", steps[nextIndex]);
  };

  const resetA11y = () => {
    setA11yPrefs({
      fontScale: 1,
      highContrast: false,
      dyslexiaFont: false,
      underlineLinks: false,
      reduceMotion: false,
      focusRing: false,
      colorFilter: "none",
      theme: "dark",
    });
  };

  return (
    <div className="app-root min-h-screen bg-black text-purple-100">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <svg className="a11y-svg" aria-hidden="true" focusable="false">
        <defs>
          <filter id="a11y-protanopia">
            <feColorMatrix
              type="matrix"
              values="0.56667 0.43333 0 0 0 0.55833 0.44167 0 0 0 0 0.24167 0.75833 0 0 0 0 0 1 0"
            />
          </filter>
          <filter id="a11y-deuteranopia">
            <feColorMatrix
              type="matrix"
              values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"
            />
          </filter>
          <filter id="a11y-tritanopia">
            <feColorMatrix
              type="matrix"
              values="0.95 0.05 0 0 0 0 0.43333 0.56667 0 0 0 0.475 0.525 0 0 0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-4 rounded-2xl border border-cyan-300/40 bg-purple-950/70 p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
          
              </p>
              <h1 className="text-2xl font-semibold text-white">Welcome to Somedeed!</h1>
            </div>
            <div className="relative">
              <button
                className="rounded-full border border-cyan-200/60 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-400/20"
                aria-expanded={a11yOpen}
                aria-controls="accessibility-menu"
                aria-haspopup="dialog"
                aria-keyshortcuts="Alt+A"
                title="Accessibility menu (Alt + A)"
                onClick={() => setA11yOpen((prev) => !prev)}
              >
                Accessibility
              </button>
              {a11yOpen && (
                <div
                  id="accessibility-menu"
                  role="dialog"
                  aria-label="Accessibility preferences"
                  className="a11y-menu absolute right-0 top-12 z-20 w-72 rounded-2xl border border-cyan-200/30 bg-black/90 p-4 text-sm text-purple-100 shadow-2xl shadow-cyan-500/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                      Display Options
                    </span>
                    <button
                      className="text-xs text-cyan-200 hover:text-cyan-50"
                      onClick={() => setA11yOpen(false)}
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span>Text size</span>
                      <div className="flex items-center gap-2">
                        <button
                          className="h-7 w-7 rounded-full border border-cyan-200/40 text-cyan-100 transition hover:border-cyan-200"
                          onClick={() => adjustFontScale(-1)}
                          aria-label="Decrease text size"
                          disabled={a11yPrefs.fontScale === 1}
                        >
                          -
                        </button>
                        <span className="text-xs text-cyan-100">
                          {Math.round(a11yPrefs.fontScale * 100)}%
                        </span>
                        <button
                          className="h-7 w-7 rounded-full border border-cyan-200/40 text-cyan-100 transition hover:border-cyan-200"
                          onClick={() => adjustFontScale(1)}
                          aria-label="Increase text size"
                          disabled={a11yPrefs.fontScale === 1.5}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <label className="flex items-center justify-between gap-3">
                      <span>Light mode</span>
                      <input
                        type="checkbox"
                        checked={a11yPrefs.theme === "light"}
                        onChange={(event) =>
                          updateA11yPref(
                            "theme",
                            event.target.checked ? "light" : "dark"
                          )
                        }
                      />
                    </label>
                    <label className="flex items-center justify-between gap-3">
                      <span>High contrast</span>
                      <input
                        type="checkbox"
                        checked={a11yPrefs.highContrast}
                        onChange={(event) =>
                          updateA11yPref("highContrast", event.target.checked)
                        }
                      />
                    </label>
                    <label className="flex items-center justify-between gap-3">
                      <span>Color-blind filter</span>
                      <select
                        className="rounded-lg border border-cyan-200/30 bg-black/40 px-2 py-1 text-xs text-cyan-100"
                        value={a11yPrefs.colorFilter}
                        onChange={(event) =>
                          updateA11yPref("colorFilter", event.target.value)
                        }
                      >
                        <option value="none">None</option>
                        <option value="protanopia">Protanopia assist</option>
                        <option value="deuteranopia">Deuteranopia assist</option>
                        <option value="tritanopia">Tritanopia assist</option>
                        <option value="achromatopsia">Low color</option>
                      </select>
                    </label>
                    <label className="flex items-center justify-between gap-3">
                      <span>Dyslexia-friendly font</span>
                      <input
                        type="checkbox"
                        checked={a11yPrefs.dyslexiaFont}
                        onChange={(event) =>
                          updateA11yPref("dyslexiaFont", event.target.checked)
                        }
                      />
                    </label>
                    <label className="flex items-center justify-between gap-3">
                      <span>Underline links</span>
                      <input
                        type="checkbox"
                        checked={a11yPrefs.underlineLinks}
                        onChange={(event) =>
                          updateA11yPref("underlineLinks", event.target.checked)
                        }
                      />
                    </label>
                    <label className="flex items-center justify-between gap-3">
                      <span>Reduce motion</span>
                      <input
                        type="checkbox"
                        checked={a11yPrefs.reduceMotion}
                        onChange={(event) =>
                          updateA11yPref("reduceMotion", event.target.checked)
                        }
                      />
                    </label>
                    <label className="flex items-center justify-between gap-3">
                      <span>Extra focus outlines</span>
                      <input
                        type="checkbox"
                        checked={a11yPrefs.focusRing}
                        onChange={(event) =>
                          updateA11yPref("focusRing", event.target.checked)
                        }
                      />
                    </label>
                  </div>

                  <button
                    className="mt-4 w-full rounded-full border border-cyan-200/50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 transition hover:border-cyan-200 hover:text-cyan-50"
                    onClick={resetA11y}
                  >
                    Reset to default
                  </button>
                </div>
              )}
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
            {authed && role === "user" && (
              <NavLink className="nav-link" to="/my-saved-jobs">My Saved Jobs</NavLink>
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
        <main id="main-content">
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
            <Route path="/applications/form/:jobId" element={<ApplicationForm />} />
          )}
            {authed && role === "user" && (
              <Route path="/my-profile" element={<MyProfile />} />
            )}
            {authed && role === "user" && (
              <Route path="/my-saved-jobs" element={<MySavedJobs />} />
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
        </main>

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
