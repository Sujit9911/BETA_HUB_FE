import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Modal from "../../components/ui/Modal";
import EventCard from "../../components/events/EventCard";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = [
  "Technical",
  "Non-Technical",
  "Cultural",
  "Workshop",
  "Other",
];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Technical",
    eventDate: "",
    coordinatorName: "",
    coordinatorContact: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { isAdmin } = useAuth();

  const fetchEvents = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filtered =
    activeCategory === "All"
      ? events
      : events.filter((e) => e.category === activeCategory);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.category || !form.eventDate) {
      setError("Title, category, and date are required");
      return;
    }

    setSubmitting(true);

    try {
      await axiosInstance.post("/events", form);

      setModalOpen(false);

      setForm({
        title: "",
        description: "",
        category: "Technical",
        eventDate: "",
        coordinatorName: "",
        coordinatorContact: "",
      });

      fetchEvents();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create event"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition";

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Events
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Technical, cultural, and workshop events
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            + Create event
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-blue-800 text-white"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center text-slate-400">
          No events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create event"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
              Title
            </label>

            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                Date
              </label>

              <input
                type="date"
                value={form.eventDate}
                onChange={(e) =>
                  setForm({ ...form, eventDate: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                Coordinator
              </label>

              <input
                type="text"
                value={form.coordinatorName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    coordinatorName: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                Contact
              </label>

              <input
                type="text"
                value={form.coordinatorContact}
                onChange={(e) =>
                  setForm({
                    ...form,
                    coordinatorContact: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
          >
            {submitting ? "Creating..." : "Create event"}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}