import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import GlobalSearch from "../dashboard/GlobalSearch";
import NotificationPanel from "./NotificationPanel";
import betaLogo from "../../assets/logo.png";

export default function Navbar({ onMobileMenu }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [profileOpen, setProfileOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);

    return () => {
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const handleLogout = () => {
    // Clear authentication
    logout();

    // Close profile menu
    setProfileOpen(false);

    // Hard redirect to landing page
    window.location.replace("/");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80">

      {/* Mobile menu */}
      <button
        onClick={onMobileMenu}
        aria-label="Open BETA menu"
        className="md:hidden shrink-0 w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
      >
        <img
          src={betaLogo}
          alt="BETA"
          className="w-7 h-7 rounded-full object-cover"
        />
      </button>

      {/* Search */}
      <div className="flex-1 min-w-0 max-w-2xl">
        <GlobalSearch />
      </div>

      <div className="flex-1 hidden lg:block" />

      <div className="flex items-center gap-2">

        {/* Notifications */}
        <NotificationPanel />

        {/* Theme */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="
            w-10 h-10 rounded-xl
            border border-slate-200 dark:border-slate-800
            bg-white dark:bg-slate-900
            text-slate-500 dark:text-slate-300
            flex items-center justify-center
            transition-all duration-200
            hover:border-blue-300 dark:hover:border-blue-800
            hover:bg-blue-50 dark:hover:bg-blue-950/30
            hover:shadow-md hover:shadow-blue-500/10
          "
        >
          <span className="text-sm transition-transform duration-300 hover:rotate-12">
            {theme === "light" ? "🌙" : "☀️"}
          </span>
        </button>

        {/* Profile */}
        <div ref={ref} className="relative ml-1">

          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="
              flex items-center gap-2
              pl-1 pr-2 py-1
              rounded-xl
              hover:bg-slate-100 dark:hover:bg-slate-900
              transition-all duration-200
            "
          >
            <div
              className="
                w-9 h-9 rounded-xl
                bg-blue-700 dark:bg-blue-600
                text-white
                flex items-center justify-center
                text-xs font-bold
                shadow-sm
                shadow-blue-700/20
              "
            >
              {initials}
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {user?.name?.split(" ")[0]}
              </p>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                {user?.role}
              </p>
            </div>

            <svg
              className={`hidden sm:block w-3.5 h-3.5 text-slate-400 transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {profileOpen && (
            <div
              className="
                absolute right-0 mt-3 w-64
                bg-white dark:bg-slate-900
                border border-slate-200 dark:border-slate-800
                rounded-2xl
                shadow-2xl shadow-slate-900/10 dark:shadow-black/30
                overflow-hidden
                z-50
              "
            >

              {/* User Info */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center text-xs font-bold">
                    {initials}
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {user?.name}
                    </p>

                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {user?.email}
                    </p>

                  </div>

                </div>

                <span
                  className="
                    inline-flex mt-3
                    text-[10px] font-bold
                    text-amber-700 dark:text-amber-400
                    bg-amber-50 dark:bg-amber-950/40
                    border border-amber-100 dark:border-amber-900/40
                    px-2.5 py-1 rounded-full
                  "
                >
                  {user?.role}
                </span>

              </div>

              {/* Logout */}
              <div className="p-1.5">

                <button
                  onClick={handleLogout}
                  className="
                    w-full flex items-center gap-2
                    text-left text-sm font-medium
                    text-red-600 dark:text-red-400
                    hover:bg-red-50 dark:hover:bg-red-950/30
                    px-3 py-2.5 rounded-xl
                    transition
                  "
                >
                  <span>↪</span>
                  Log out
                </button>

              </div>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}