import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Modal from "../../components/ui/Modal";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { FileIcon } from "../../components/ui/Icons";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { isAdmin } = useAuth();

  const fetchTemplates = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get("/templates");
      setTemplates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        templates
          .map((template) => template.category)
          .filter(Boolean)
      ),
    ];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    if (categoryFilter === "All") {
      return templates;
    }

    return templates.filter(
      (template) => template.category === categoryFilter
    );
  }, [templates, categoryFilter]);

  const getFileType = (url) => {
    if (!url) return "FILE";

    const cleanUrl = url.split("?")[0];
    const extension = cleanUrl.split(".").pop()?.toUpperCase();

    if (extension === "PDF") return "PDF";
    if (["DOC", "DOCX"].includes(extension)) return "DOC";
    if (["XLS", "XLSX"].includes(extension)) return "XLS";
    if (["PPT", "PPTX"].includes(extension)) return "PPT";

    return extension || "FILE";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.category) {
      setError("Title and category are required");
      return;
    }

    if (!file) {
      setError("Please attach a file");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append(
        "data",
        new Blob([JSON.stringify(form)], {
          type: "application/json",
        })
      );

      formData.append("file", file);

      await axiosInstance.post("/templates", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setModalOpen(false);

      setForm({
        title: "",
        description: "",
        category: "",
      });

      setFile(null);

      fetchTemplates();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create template"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this template?")) return;

    try {
      await axiosInstance.delete(`/templates/${id}`);
      fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass =
    "w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition";

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Templates
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Standard documents and formats for BETA events
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="self-start lg:self-auto bg-blue-800 hover:bg-blue-700 hover:-translate-y-0.5 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            + Add template
          </button>
        )}
      </div>

      {!loading && templates.length > 0 && (
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Document Library
            </p>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {filteredTemplates.length} of {templates.length} templates
            </p>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "All" ? "All categories" : category}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-14 text-center">
          <div className="w-14 h-14 mx-auto rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            <FileIcon className="w-6 h-6" />
          </div>

          <h3 className="font-semibold text-slate-900 dark:text-white">
            No templates yet
          </h3>

          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Add your first BETA document template.
          </p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
            <FileIcon className="w-5 h-5" />
          </div>

          <h3 className="font-semibold text-slate-900 dark:text-white">
            No templates in this category
          </h3>

          <button
            onClick={() => setCategoryFilter("All")}
            className="text-sm font-medium text-blue-700 dark:text-blue-400 hover:underline mt-2"
          >
            Show all templates
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
            >
              <div className="h-1 bg-blue-700 group-hover:bg-blue-500 transition-colors" />

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30 group-hover:border-blue-200 dark:group-hover:border-blue-800 group-hover:scale-105 transition-all duration-300">
                    <FileIcon className="w-5 h-5" />
                  </div>

                  <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg">
                    {getFileType(template.fileUrl)}
                  </span>
                </div>

                <div className="mt-5">
                  <span className="inline-block text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full mb-3">
                    {template.category}
                  </span>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {template.title}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {template.description || "BETA document template"}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <a
                    href={template.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                  >
                    View / Download

                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </a>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add template"
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

          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>

            <input
              type="text"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              placeholder="Event Proposal, Permission Letter..."
              className={inputClass}
            />
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

          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
              File
            </label>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 dark:file:bg-blue-950/50 file:text-blue-800 dark:file:text-blue-300 file:text-sm file:font-medium"
            />
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
            {submitting ? "Uploading..." : "Add template"}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}