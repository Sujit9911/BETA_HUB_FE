import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import betaLogo from "../../assets/logo.png";
import collegeLogo from "../../assets/college-logo.png";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    prnNumber: "",
    branch: "",
    year: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, email, and password are required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      const message =
        typeof data === "string"
          ? data
          : data?.message || data?.detail || "";

      if (
        status === 409 ||
        message.toLowerCase().includes("already registered") ||
        message.toLowerCase().includes("already exists")
      ) {
        setError("Account already exists. Please login instead.");
      } else {
        setError(
          message || "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-start justify-center px-4 py-5 sm:py-7 overflow-y-auto relative transition-colors">

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-blue-500 to-amber-500" />

      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-20 w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/10 transition-all"
        aria-label="Toggle theme"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <div className="w-full max-w-lg">

        <div className="flex items-center justify-center gap-4 mb-4">

          <img
            src={collegeLogo}
            alt="MMCOE"
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-md"
          />

          <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />

          <img
            src={betaLogo}
            alt="BETA"
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-md"
          />

        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-900/5 dark:shadow-black/20 overflow-hidden">

          <div className="h-1 bg-gradient-to-r from-blue-700 to-blue-500" />

          <div className="px-6 sm:px-8 py-6">

            <div className="text-center mb-5">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold tracking-wide mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                BETA DIGITAL HUB
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Create your account
              </h1>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Join the BETA community
              </p>

            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@mmcoe.edu.in"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    PRN number
                  </label>

                  <input
                    type="text"
                    name="prnNumber"
                    value={formData.prnNumber}
                    onChange={handleChange}
                    placeholder="Optional"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Branch
                  </label>

                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="ENTC"
                    className={inputClass}
                  />
                </div>

              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Year
                </label>

                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Final Year"
                  className={inputClass}
                />
              </div>

              {error && (
                <div className="text-sm bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl px-3 py-2.5">
                  <p className="text-red-600 dark:text-red-400">
                    {error}
                  </p>

                  {error === "Account already exists. Please login instead." && (
                    <Link
                      to="/login"
                      className="inline-block mt-1 font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-500"
                    >
                      Login to your account →
                    </Link>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-blue-700/20 hover:shadow-blue-700/30 transition-all duration-200 mt-1"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-500 transition"
              >
                Sign in →
              </Link>
            </p>

          </div>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-3">
          Bench for Electronics and Telecommunication Association
        </p>

      </div>
    </div>
  );
}