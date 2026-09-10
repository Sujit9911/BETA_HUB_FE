import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import betaLogo from "../../assets/logo.png";
import collegeLogo from "../../assets/college-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    if (error) {
      setError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Enter both email and password");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Account not found. Please register first.");
      } else if (err.response?.status === 401) {
        setError("Incorrect password. Please try again.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-8 relative transition-colors">

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-blue-500 to-amber-500" />

      <div className="absolute top-5 right-5">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-md hover:shadow-blue-500/10 transition-all"
          aria-label="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      <div className="w-full max-w-md">

        {/* Logos */}
        <div className="flex items-center justify-center mb-7">

          <div className="flex items-center gap-5">

            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />

              <img
                src={collegeLogo}
                alt="MMCOE"
                className="relative h-16 w-16 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-lg"
              />
            </div>

            <div className="h-10 w-px bg-slate-300 dark:bg-slate-700" />

            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />

              <img
                src={betaLogo}
                alt="BETA"
                className="relative h-16 w-16 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-lg"
              />
            </div>

          </div>

        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-900/5 dark:shadow-black/20 overflow-hidden">

          <div className="h-1 bg-gradient-to-r from-blue-700 to-blue-500" />

          <div className="px-7 sm:px-9 py-9">

            {/* Heading */}
            <div className="text-center mb-8">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-bold tracking-wide mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                BETA DIGITAL HUB
              </div>

              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Welcome back
              </h1>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                Sign in to continue to your account
              </p>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@mmcoe.edu.in"
                  className={inputClass}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">

                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>

                </div>

                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  className={inputClass}
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl px-3.5 py-3"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-700/20 hover:shadow-blue-700/30 transition-all duration-200"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

            </form>

            {/* Register Divider */}
            <div className="flex items-center gap-3 my-6">

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

              <span className="text-xs text-slate-400">
                New to BETA?
              </span>

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

            </div>

            {/* Register */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-500 transition"
              >
                Create one →
              </Link>

            </p>

          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-5">
          Bench for Electronics and Telecommunication Association
        </p>

      </div>
    </div>
  );
}