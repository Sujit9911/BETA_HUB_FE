import { Link } from "react-router-dom";
import { CalendarIcon } from "../ui/Icons";

export default function EventCard({ event }) {
  const categoryColors = {
    Technical: "bg-blue-600 text-white",
    "Non-Technical": "bg-purple-600 text-white",
    Cultural: "bg-pink-600 text-white",
    Workshop: "bg-amber-500 text-white",
  };

  const badgeClass =
    categoryColors[event.category] || "bg-slate-700 text-white";

  const eventId = event.id ?? event.eventId;
  const coverPhoto = event.photos?.[0]?.photoUrl;

  const eventDate = new Date(event.eventDate);

  const day = eventDate.toLocaleDateString("en-IN", {
    day: "numeric",
  });

  const month = eventDate.toLocaleDateString("en-IN", {
    month: "short",
  });

  const year = eventDate.toLocaleDateString("en-IN", {
    year: "numeric",
  });

  if (!eventId) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="relative h-52 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-slate-800 flex items-center justify-center mb-3 shadow-sm text-blue-700 dark:text-blue-300">
            <CalendarIcon className="w-7 h-7" />
          </div>

          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 tracking-wide uppercase">
            BETA Event
          </span>
        </div>

        <div className="p-5">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {event.title}
          </p>

          <p className="text-sm text-red-500 mt-2">
            Event ID unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/dashboard/events/${eventId}`}
      className="group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
    >
      <div className="relative h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {coverPhoto ? (
          <>
            <img
              src={coverPhoto}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70 group-hover:opacity-80 transition-opacity" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-slate-800 flex items-center justify-center mb-3 shadow-sm text-blue-700 dark:text-blue-300">
              <CalendarIcon className="w-7 h-7" />
            </div>

            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 tracking-wide uppercase">
              BETA Event
            </span>
          </div>
        )}

        <span
          className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md ${badgeClass}`}
        >
          {event.category}
        </span>

        <div className="absolute top-4 right-4 bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden text-center min-w-[52px]">
          <div className="bg-blue-800 text-white text-[10px] font-bold uppercase px-2 py-1">
            {month}
          </div>

          <div className="px-2 py-1">
            <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">
              {day}
            </p>

            <p className="text-[9px] text-slate-400 mt-1">
              {year}
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="text-white">
            <p className="text-lg font-bold drop-shadow-md">
              {event.title}
            </p>
          </div>

          <span className="bg-white/95 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            View event →
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Event date
            </p>

            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
              {eventDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-colors">
            →
          </div>
        </div>

        {event.coordinatorName && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Coordinator
            </p>

            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
              {event.coordinatorName}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}