import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Modal from "../../components/ui/Modal";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import {
  MeetingIcon,
} from "../../components/ui/Icons";

export default function Alerts() {
  const { isAdmin } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "General",
    eventDateTime: "",
    googleMeetLink: "",
    sendEmail: false,
  });

  const fetchAlerts = async () => {
    try {
      const response = await axiosInstance.get(
        isAdmin ? "/alerts/admin" : "/alerts"
      );

      setAlerts(response.data);
    } catch (error) {
      setAlerts([]);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [isAdmin]);

  const inputClass =
    "w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      await axiosInstance.post("/alerts", form);

      setModalOpen(false);

      setForm({
        title: "",
        description: "",
        type: "General",
        eventDateTime: "",
        googleMeetLink: "",
        sendEmail: false,
      });

      fetchAlerts();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this alert?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/alerts/${id}`);
      fetchAlerts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Alerts
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Time-sensitive notifications
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            + New alert
          </button>
        )}
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No alerts available.
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-medium text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full">
                    {alert.type}
                  </span>

                  <p className="font-semibold text-slate-900 dark:text-white mt-2">
                    {alert.title}
                  </p>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {alert.description}
                  </p>

                  {alert.eventDateTime && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                      {new Date(alert.eventDateTime).toLocaleString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  )}

                  {alert.googleMeetLink && (
                    <a
                      href={alert.googleMeetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400"
                    >
                      <MeetingIcon className="w-3.5 h-3.5" />
                      Join Google Meet
                    </a>
                  )}
                </div>

                {isAdmin && (
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="text-sm text-red-600 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isAdmin && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Create alert"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              className={inputClass}
            />

            <textarea
              required
              placeholder="Description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className={`${inputClass} resize-none`}
            />

            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value,
                })
              }
              className={inputClass}
            >
              <option>General</option>
              <option>Meeting</option>
              <option>Urgent</option>
              <option>Event</option>
            </select>

            <input
              type="datetime-local"
              value={form.eventDateTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  eventDateTime: e.target.value,
                })
              }
              className={inputClass}
            />

            <input
              placeholder="Google Meet link (optional)"
              value={form.googleMeetLink}
              onChange={(e) =>
                setForm({
                  ...form,
                  googleMeetLink: e.target.value,
                })
              }
              className={inputClass}
            />

            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={form.sendEmail}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sendEmail: e.target.checked,
                  })
                }
              />

              Send email to team
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
            >
              {submitting ? "Creating..." : "Create Alert"}
            </button>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}