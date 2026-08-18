import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import Calendar from "../../components/dashboard/Calendar";
import axiosInstance from "../../api/axiosInstance";
import {
  CalendarIcon,
  UsersIcon,
  GraduationIcon,
  FileIcon,
  PinIcon,
} from "../../components/ui/Icons";

export default function Dashboard() {
  const [stats, setStats] = useState({
    events: 0,
    team: 0,
    alumni: 0,
    templates: 0,
  });

  const [pinnedNotices, setPinnedNotices] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [events, alumni, templates, notices, years] =
          await Promise.all([
            axiosInstance.get("/events"),
            axiosInstance.get("/alumni"),
            axiosInstance.get("/templates"),
            axiosInstance.get("/notices/pinned"),
            axiosInstance.get("/team/years"),
          ]);

        let teamCount = 0;

        if (years.data.length > 0) {
          const teamRes = await axiosInstance.get(
            `/team/year/${years.data[0]}`
          );

          teamCount = teamRes.data.length;
        }

        setStats({
          events: events.data.length,
          team: teamCount,
          alumni: alumni.data.length,
          templates: templates.data.length,
        });

        setPinnedNotices(notices.data);

        const today = new Date().toISOString().split("T")[0];

        const upcoming = events.data
          .filter((event) => event.eventDate >= today)
          .sort(
            (a, b) =>
              new Date(a.eventDate) - new Date(b.eventDate)
          )
          .slice(0, 4);

        setUpcomingEvents(upcoming);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-400 mb-2">
              BETA Digital Hub
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dashboard
            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-1.5">
              Here's what's happening in BETA
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link
          to="/dashboard/events"
          className="group rounded-2xl"
        >
          <div className="h-full rounded-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_35px_rgba(37,99,235,0.12)]">
            <StatCard
              label="Events"
              value={loading ? "…" : stats.events}
              icon={<CalendarIcon className="w-5 h-5" />}
            />
          </div>
        </Link>

        <Link
          to="/dashboard/team"
          className="group rounded-2xl"
        >
          <div className="h-full rounded-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_35px_rgba(124,58,237,0.12)]">
            <StatCard
              label="Team"
              value={loading ? "…" : stats.team}
              icon={<UsersIcon className="w-5 h-5" />}
            />
          </div>
        </Link>

        <Link
          to="/dashboard/alumni"
          className="group rounded-2xl"
        >
          <div className="h-full rounded-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_35px_rgba(14,165,233,0.12)]">
            <StatCard
              label="Alumni"
              value={loading ? "…" : stats.alumni}
              icon={<GraduationIcon className="w-5 h-5" />}
            />
          </div>
        </Link>

        <Link
          to="/dashboard/templates"
          className="group rounded-2xl"
        >
          <div className="h-full rounded-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_35px_rgba(245,158,11,0.12)]">
            <StatCard
              label="Templates"
              value={loading ? "…" : stats.templates}
              icon={<FileIcon className="w-5 h-5" />}
            />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                Upcoming events
              </p>

              <p className="text-xs text-slate-400 mt-1">
                What's coming up in BETA
              </p>
            </div>

            <Link
              to="/dashboard/events"
              className="text-sm font-medium text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-sm text-slate-400">
              Loading events...
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5" />
              </div>

              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                No upcoming events
              </p>

              <p className="text-xs text-slate-400 mt-1">
                New events will appear here.
              </p>
            </div>
          ) : (
            <div className="p-4">
              <div className="space-y-2">
                {upcomingEvents.map((event) => {
                  const date = new Date(event.eventDate);

                  return (
                    <Link
                      key={event.id}
                      to={`/dashboard/events/${event.id}`}
                      className="group flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-blue-200 dark:hover:border-blue-900 hover:bg-blue-50/60 dark:hover:bg-blue-950/20 transition-all duration-200"
                    >
                      <div className="w-14 h-14 shrink-0 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 flex flex-col items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 transition">
                        <span className="text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400">
                          {date.toLocaleDateString("en-IN", {
                            month: "short",
                          })}
                        </span>

                        <span className="text-xl font-bold text-blue-800 dark:text-blue-300 leading-none mt-0.5">
                          {date.getDate()}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {event.category}
                          </span>
                        </div>

                        <p className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition">
                          {event.title}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {date.toLocaleDateString("en-IN", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-white dark:group-hover:bg-slate-800 transition">
                        →
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                Notice board
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Important updates
              </p>
            </div>

            <Link
              to="/dashboard/notices"
              className="text-sm font-medium text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-sm text-slate-400">
              Loading notices...
            </div>
          ) : pinnedNotices.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <PinIcon className="w-5 h-5" />
              </div>

              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                No pinned notices
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Important announcements will appear here.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {pinnedNotices.map((notice) => (
                <Link
                  key={notice.id}
                  to="/dashboard/notices"
                  className="block p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 hover:border-amber-300 dark:hover:border-amber-700 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-amber-600">
                      <PinIcon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {notice.title}
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {notice.content}
                      </p>

                      <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium mt-2">
                        Pinned notice
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-4">
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            BETA Calendar
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Keep track of upcoming activities and events
          </p>
        </div>

        <Calendar events={upcomingEvents} />
      </div>
    </DashboardLayout>
  );
}