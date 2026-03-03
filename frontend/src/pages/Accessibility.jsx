import PropTypes from "prop-types";
import "./Applications.css";

export default function Accessibility({ prefs, onUpdate, onAdjustFont, onReset }) {
  return (
    <main className="page page-applications">
      <header className="page-header">
        <div>
          <p className="eyebrow">Accessibility</p>
          <h1 className="title">Adjust your experience</h1>
          <p className="subtitle">Choose display options that work best for you.</p>
        </div>
      </header>

      <section className="form-grid">
        <div className="form-card">
          <h3>Display Options</h3>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span>Text size</span>
              <div className="flex items-center gap-2">
                <button
                  className="h-7 w-7 rounded-full border border-cyan-200/40 text-cyan-100 transition hover:border-cyan-200"
                  onClick={() => onAdjustFont(-1)}
                  aria-label="Decrease text size"
                  disabled={prefs.fontScale === 1}
                >
                  -
                </button>
                <span className="text-xs text-cyan-100">
                  {Math.round(prefs.fontScale * 100)}%
                </span>
                <button
                  className="h-7 w-7 rounded-full border border-cyan-200/40 text-cyan-100 transition hover:border-cyan-200"
                  onClick={() => onAdjustFont(1)}
                  aria-label="Increase text size"
                  disabled={prefs.fontScale === 1.5}
                >
                  +
                </button>
              </div>
            </div>

            <label className="flex items-center justify-between gap-3">
              <span>Light mode</span>
              <input
                type="checkbox"
                checked={prefs.theme === "light"}
                onChange={(event) =>
                  onUpdate("theme", event.target.checked ? "light" : "dark")
                }
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>High contrast</span>
              <input
                type="checkbox"
                checked={prefs.highContrast}
                onChange={(event) => onUpdate("highContrast", event.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Color-blind filter</span>
              <select
                className="rounded-lg border border-cyan-200/30 bg-black/40 px-2 py-1 text-xs text-cyan-100"
                value={prefs.colorFilter}
                onChange={(event) => onUpdate("colorFilter", event.target.value)}
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
                checked={prefs.dyslexiaFont}
                onChange={(event) => onUpdate("dyslexiaFont", event.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Underline links</span>
              <input
                type="checkbox"
                checked={prefs.underlineLinks}
                onChange={(event) => onUpdate("underlineLinks", event.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Reduce motion</span>
              <input
                type="checkbox"
                checked={prefs.reduceMotion}
                onChange={(event) => onUpdate("reduceMotion", event.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Extra focus outlines</span>
              <input
                type="checkbox"
                checked={prefs.focusRing}
                onChange={(event) => onUpdate("focusRing", event.target.checked)}
              />
            </label>
          </div>

          <button
            className="mt-4 w-full rounded-full border border-cyan-200/50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 transition hover:border-cyan-200 hover:text-cyan-50"
            onClick={onReset}
          >
            Reset to default
          </button>
        </div>
      </section>
    </main>
  );
}

Accessibility.propTypes = {
  prefs: PropTypes.shape({
    fontScale: PropTypes.number.isRequired,
    highContrast: PropTypes.bool.isRequired,
    dyslexiaFont: PropTypes.bool.isRequired,
    underlineLinks: PropTypes.bool.isRequired,
    reduceMotion: PropTypes.bool.isRequired,
    focusRing: PropTypes.bool.isRequired,
    colorFilter: PropTypes.string.isRequired,
    theme: PropTypes.string.isRequired
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onAdjustFont: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
};
