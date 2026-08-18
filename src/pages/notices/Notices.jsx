import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Modal from "../../components/ui/Modal";
import NoticeCard from "../../components/notices/NoticeCard";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", type: "", pinned: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { isAdmin } = useAuth();

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/notices");
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.content || !form.type) {
      setError("Title, content, and type are required");
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post("/notices", form);
      setModalOpen(false);
      setForm({ title: "", content: "", type: "", pinned: false });
      fetchNotices();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create notice");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this notice?")) return;
    try {
      await axiosInstance.delete(`/notices/${id}`);
      fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };
const handleTogglePin = async (notice) => {
  try {
    await axiosInstance.put(`/notices/${notice.id}`, {
      title: notice.title,
      content: notice.content,
      type: notice.type,
      pinned: !notice.pinned,
    });
    fetchNotices();
  } catch (err) {
    console.error(err);
  }
};
  const inputClass =
    "w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition";

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Notices</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Announcements and updates for BETA
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            + New notice
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : notices.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center text-slate-400">
          No notices yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notices.map((n) => (
<NoticeCard key={n.id} notice={n} isAdmin={isAdmin} onDelete={handleDelete} onTogglePin={handleTogglePin} />          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New notice">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">Type</label>
            <input
              type="text"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              placeholder="Meeting, Urgent, Event, General..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-800 focus:ring-blue-500"
            />
            Pin to dashboard notice board
          </label>

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
            {submitting ? "Posting..." : "Post notice"}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}