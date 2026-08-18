import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon } from "../ui/Icons";

export default function Calendar({ events = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);

  const navigate = useNavigate();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const getEventForDay = (day) => {
    return events.find((event) => {
      if (!event.eventDate) return false;

      const date = new Date(event.eventDate);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      );
    });
  };

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const goPrev = () => {
    setSelectedEvent(null);
    setHoveredEvent(null);
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goNext = () => {
    setSelectedEvent(null);
    setHoveredEvent(null);
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const cells = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(
      <div key={`empty-${i}`} className="h-10" />
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const event = getEventForDay(day);
    const hasEvent = !!event;
    const todayDate = isToday(day);
    const isHovered = hoveredEvent === event?.id;

    cells.push(
      <div
        key={day}
        className="relative flex items-center justify-center h-10"
        onMouseEnter={() => {
          if (hasEvent) {
            setHoveredEvent(event.id);
          }
        }}
        onMouseLeave={() => {
          setHoveredEvent(null);
        }}
      >
        <button
          onClick={() => {
            if (event) {
              setSelectedEvent(event);
            }
          }}
          className={`
            relative w-9 h-9 rounded-full
            flex items-center justify-center
            text-sm transition-all duration-200
            ${
              todayDate
                ? "bg-blue-800 text-white font-semibold shadow-md"
                : hasEvent
                ? "text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:scale-110"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }
          `}
        >
          {day}

          {hasEvent && !todayDate && (
            <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
          )}
        </button>

        {isHovered && event && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-52 bg-slate-950 dark:bg-slate-800 text-white rounded-xl px-3 py-2.5 shadow-2xl pointer-events-none">
            <p className="text-[10px] uppercase tracking-wide text-blue-300 font-semibold">
              {event.category || "Event"}
            </p>

            <p className="text-sm font-semibold truncate mt-1">
              {event.title}
            </p>

            <p className="text-[11px] text-slate-400 mt-1">
              Click to view details
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">
              {monthNames[month]} {year}
            </p>

            <p className="text-[11px] text-slate-400 mt-0.5">
              Events are marked on the calendar
            </p>
          </div>

          <div className="flex gap-1">
            <button
              onClick={goPrev}
              className="w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
            >
              ‹
            </button>

            <button
              onClick={goNext}
              className="w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-2 mb-2">
          {dayNames.map((day, index) => (
            <div
              key={index}
              className="text-center text-[11px] font-semibold text-slate-400 dark:text-slate-600"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {cells}
        </div>

        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-[11px] text-slate-400">
              Event
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span className="text-[11px] text-slate-400">
              Today
            </span>
          </div>
        </div>

        {selectedEvent && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-blue-700 dark:text-blue-300">
                    <CalendarIcon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                      {selectedEvent.category || "Event"}
                    </span>

                    <h3 className="font-bold text-slate-900 dark:text-white mt-1 truncate">
                      {selectedEvent.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {formatDate(selectedEvent.eventDate)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-7 h-7 shrink-0 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition"
                >
                  ×
                </button>
              </div>

              {selectedEvent.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                  {selectedEvent.description}
                </p>
              )}

              <button
                onClick={() =>
                  navigate(`/dashboard/events/${selectedEvent.id}`)
                }
                className="mt-3 w-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-700/20"
              >
                View Event →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}