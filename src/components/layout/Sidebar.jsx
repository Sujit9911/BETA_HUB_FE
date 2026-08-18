import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import betaLogo from "../../assets/logo.png";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M3 10.5L12 3l9 7.5" />
        <path d="M5.5 9.5V21h13V9.5" />
        <path d="M9.5 21v-6h5v6" />
      </svg>
    ),
  },
  {
    to: "/dashboard/events",
    label: "Events",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3.5" y="5" width="17" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3.5 9h17" />
        <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
      </svg>
    ),
  },
  {
    to: "/dashboard/team",
    label: "Team",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3.5 20c.5-3.5 2.4-5.5 5.5-5.5s5 2 5.5 5.5" />
        <path d="M14 14.5c2.8-.2 5 1.6 5.5 4.5" />
      </svg>
    ),
  },
  {
    to: "/dashboard/alumni",
    label: "Alumni",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M3 9l9-5 9 5-9 5-9-5Z" />
        <path d="M6 11v5c2 1.8 4 2.5 6 2.5s4-.7 6-2.5v-5" />
        <path d="M21 9v6" />
      </svg>
    ),
  },
  {
    to: "/dashboard/templates",
    label: "Templates",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M6 3.5h9l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
        <path d="M14.5 3.5V8H19" />
        <path d="M8 12h8M8 16h6" />
      </svg>
    ),
  },
  {
    to: "/dashboard/alerts",
    label: "Alerts",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
        <path d="M15 17v1a3 3 0 1 1-6 0v-1" />
      </svg>
    ),
  },
  {
    to: "/dashboard/notices",
    label: "Notices",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 14V10a2 2 0 0 1 2-2h5l6-3v14l-6-3H6a2 2 0 0 1-2-2Z" />
        <path d="M17 9.5c1.3.7 2 1.7 2 2.5s-.7 1.8-2 2.5" />
        <path d="M8 17l1.5 4" />
      </svg>
    ),
  },
  {
    to: "/dashboard/admin",
    label: "Admin Management",
    adminOnly: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { isAdmin } = useAuth();

  const [collapsed, setCollapsed] = useState(() => {
    return sessionStorage.getItem("beta-sidebar-open") !== "true";
  });

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      sessionStorage.setItem("beta-sidebar-open", String(!next));
      return next;
    });
  };

  const visibleNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <>
      <aside
        className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 z-30 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${
          collapsed ? "w-20" : "w-60"
        }`}
      >
        <div
          className={`relative flex items-center h-[89px] border-b border-slate-200 dark:border-slate-800 ${
            collapsed ? "justify-center px-3" : "gap-3 px-5"
          }`}
        >
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full" />

            <img
              src={betaLogo}
              alt="BETA"
              className="relative h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
          </div>

          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight whitespace-nowrap">
                BETA Hub
              </p>

              {isAdmin && (
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold tracking-wide text-amber-600 dark:text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  ADMIN
                </span>
              )}
            </div>
          )}

          <button
            onClick={toggleSidebar}
            title={collapsed ? "Open sidebar" : "Close sidebar"}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-all duration-200"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`w-4 h-4 transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
                  collapsed
                    ? "justify-center px-2.5 py-3"
                    : "gap-3 px-3.5 py-3"
                } ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-sm shadow-blue-500/10"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400" />
                  )}

                  <span
                    className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive
                        ? "bg-white dark:bg-slate-900 shadow-sm"
                        : "group-hover:bg-white dark:group-hover:bg-slate-800"
                    }`}
                  >
                    <span className="w-[18px] h-[18px]">
                      {item.icon}
                    </span>
                  </span>

                  {!collapsed && (
                    <span className="whitespace-nowrap overflow-hidden">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800">
          {collapsed ? (
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 text-center">
              BETA
            </p>
          ) : (
            <>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-600">
                BETA Digital Hub
              </p>

              <p className="text-[10px] text-slate-300 dark:text-slate-700 mt-0.5">
                Version 1.0
              </p>
            </>
          )}
        </div>
      </aside>

      <div
        className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          onClick={onMobileClose}
        />

        <aside
          className={`absolute left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-slate-950 shadow-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-[76px] px-5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full" />

                <img
                  src={betaLogo}
                  alt="BETA"
                  className="relative h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  BETA Hub
                </p>

                {isAdmin && (
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold tracking-wide text-amber-600 dark:text-amber-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    ADMIN
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onMobileClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              aria-label="Close sidebar"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400" />
                    )}

                    <span
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isActive
                          ? "bg-white dark:bg-slate-900 shadow-sm"
                          : "group-hover:bg-white dark:group-hover:bg-slate-800"
                      }`}
                    >
                      <span className="w-[18px] h-[18px]">
                        {item.icon}
                      </span>
                    </span>

                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-600">
              BETA Digital Hub
            </p>

            <p className="text-[10px] text-slate-300 dark:text-slate-700 mt-0.5">
              Version 1.0
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}