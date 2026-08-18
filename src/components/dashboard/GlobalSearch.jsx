import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const ROUTES = {
  EVENT: "/dashboard/events",
  TEAM: "/dashboard/team",
  ALUMNI: "/dashboard/alumni",
  TEMPLATE: "/dashboard/templates",
  NOTICE: "/dashboard/notices",
};

const GROUP_INFO = {
  events: {
    label: "Events",
    icon: "📅",
  },
  team: {
    label: "Team",
    icon: "👥",
  },
  alumni: {
    label: "Alumni",
    icon: "🎓",
  },
  templates: {
    label: "Templates",
    icon: "📄",
  },
  notices: {
    label: "Notices",
    icon: "📢",
  },
};

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const boxRef = useRef(null);
  const inputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const onClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    const t = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await axiosInstance.get("/search", {
          params: { query },
        });

        setResults(res.data);
        setOpen(true);
      } catch {
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [query]);

  const groups = results
    ? [
        {
          key: "events",
          label: "Events",
          items: results.events,
        },
        {
          key: "team",
          label: "Team",
          items: results.team,
        },
        {
          key: "alumni",
          label: "Alumni",
          items: results.alumni,
        },
        {
          key: "templates",
          label: "Templates",
          items: results.templates,
        },
        {
          key: "notices",
          label: "Notices",
          items: results.notices,
        },
      ].filter((g) => g.items?.length)
    : [];

  const totalResults = groups.reduce(
    (total, group) => total + group.items.length,
    0
  );

  const clearSearch = () => {
    setQuery("");
    setResults(null);
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleResultClick = (item) => {
    navigate(ROUTES[item.type]);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={boxRef} className="relative w-full max-w-xl">
      <div
        className={`group relative flex items-center rounded-xl border transition-all duration-300 ${
          open
            ? "bg-white dark:bg-slate-900 border-blue-400 dark:border-blue-500 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/10"
            : "bg-slate-100/80 dark:bg-slate-800/80 border-transparent hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5"
        }`}
      >
        <div className="absolute left-3.5 flex items-center justify-center">
          <svg
            className={`w-5 h-5 transition-all duration-300 ${
              open
                ? "text-blue-600 dark:text-blue-400 scale-110"
                : "text-slate-400 group-hover:text-blue-500 group-hover:scale-110"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query) {
              setOpen(true);
            }
          }}
          placeholder="Search BETA..."
          className="w-full bg-transparent pl-11 pr-16 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
        />

        {query && !loading && (
          <button
            onClick={clearSearch}
            className="absolute right-4 w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            aria-label="Clear search"
          >
            ×
          </button>
        )}

        {loading && (
          <div className="absolute right-4">
            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && query && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/30 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Search results
              </p>

              {!loading && results && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {totalResults} result
                  {totalResults !== 1 ? "s" : ""} found
                </p>
              )}
            </div>

            <span className="text-[10px] text-slate-400">
              Click outside to close
            </span>
          </div>

          {loading ? (
            <div className="px-4 py-8 text-center">
              <div className="w-7 h-7 mx-auto border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                Searching BETA...
              </p>
            </div>
          ) : groups.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
                🔎
              </div>

              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-3">
                No results found
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Try searching for an event, team member, alumni or document.
              </p>
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto">
              {groups.map((group) => {
                const info = GROUP_INFO[group.key];

                return (
                  <div
                    key={group.key}
                    className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                      <span className="text-sm">{info.icon}</span>

                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {info.label}
                      </p>

                      <span className="text-[10px] text-slate-300 dark:text-slate-600">
                        {group.items.length}
                      </span>
                    </div>

                    <div className="px-2 pb-2">
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleResultClick(item)}
                          className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 group/item transition-all duration-150"
                        >
                          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover/item:bg-white dark:group-hover/item:bg-slate-700 flex items-center justify-center text-sm shrink-0 transition-all duration-200 group-hover/item:scale-105">
                            {info.icon}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate group-hover/item:text-blue-700 dark:group-hover/item:text-blue-400 transition-colors">
                              {item.title}
                            </p>

                            {item.subtitle && (
                              <p className="text-xs text-slate-400 truncate mt-0.5">
                                {item.subtitle}
                              </p>
                            )}
                          </div>

                          <span className="text-slate-300 dark:text-slate-600 group-hover/item:text-blue-500 group-hover/item:translate-x-1 transition-all">
                            →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && groups.length > 0 && (
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] text-slate-400">
                Search across Events · Team · Alumni · Templates · Notices
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}