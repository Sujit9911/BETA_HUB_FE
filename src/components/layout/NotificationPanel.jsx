import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import {
  BellIcon,
  MeetingIcon,
  ExternalLinkIcon,
} from "../ui/Icons";

export default function NotificationPanel() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [unread, setUnread] = useState(0);

  const ref = useRef(null);

  const fetchUnread = async () => {
    try {
      const response = await axiosInstance.get(
        "/alerts/unread-count"
      );

      setUnread(response.data.count);
    } catch (error) {
      setUnread(0);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await axiosInstance.get("/alerts");
      setAlerts(response.data);
    } catch (error) {
      setAlerts([]);
    }
  };

  useEffect(() => {
    fetchUnread();

    const interval = setInterval(fetchUnread, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const openPanel = async () => {
    const nextState = !open;

    setOpen(nextState);

    if (nextState) {
      await fetchAlerts();
    }
  };

  const markRead = async (id) => {
    try {
      await axiosInstance.post(
        `/alerts/${id}/read`
      );

      setAlerts((current) =>
        current.map((alert) =>
          alert.id === id
            ? { ...alert, read: true }
            : alert
        )
      );

      setUnread((current) =>
        current > 0 ? current - 1 : 0
      );
    } catch (error) {}
  };

  const handleAlertClick = async (alert) => {
    if (!alert.read) {
      await markRead(alert.id);
    }

    setOpen(false);
    navigate("/dashboard/alerts");
  };

  const markAllRead = async () => {
    try {
      await axiosInstance.post("/alerts/read-all");

      setAlerts((current) =>
        current.map((alert) => ({
          ...alert,
          read: true,
        }))
      );

      setUnread(0);
    } catch (error) {}
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={openPanel}
        aria-label="Notifications"
        className={`relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
          unread > 0
            ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
            : "border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        } hover:border-blue-400 hover:text-blue-700 dark:hover:text-blue-400`}
      >
        <BellIcon className="w-4 h-4" />

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold border-2 border-white dark:border-slate-900">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Alerts
              </p>

              {unread > 0 && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {unread} unread alert
                  {unread !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <BellIcon className="w-7 h-7 mx-auto text-slate-300 dark:text-slate-600" />

                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-3">
                  No alerts
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  You're all caught up.
                </p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => handleAlertClick(alert)}
                  className={`px-4 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 cursor-pointer transition-colors ${
                    !alert.read
                      ? "bg-blue-50/60 dark:bg-blue-950/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${
                        !alert.read
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      <BellIcon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {alert.title}
                        </p>

                        {!alert.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                        )}
                      </div>

                      {alert.type && (
                        <span className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded-md">
                          {alert.type}
                        </span>
                      )}

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
                        {alert.description}
                      </p>

                      {alert.eventDateTime && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                          {new Date(
                            alert.eventDateTime
                          ).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}

                      {alert.googleMeetLink && (
                        <a
                          href={alert.googleMeetLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition"
                        >
                          <MeetingIcon className="w-3.5 h-3.5" />
                          Join Google Meet
                          <ExternalLinkIcon className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}