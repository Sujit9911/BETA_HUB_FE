import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Modal from "../../components/ui/Modal";
import AlumniCard from "../../components/alumni/AlumniCard";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function Alumni() {
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    batch: "",
    domain: "",
    contactNumber: "",
    email: "",
    company: "",
  });

  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { isAdmin } = useAuth();

  const fetchAlumni = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get("/alumni");
      setAlumniList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.batch) {
      setError("Name and batch are required");
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

      if (photo) {
        formData.append("photo", photo);
      }

      await axiosInstance.post("/alumni", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setModalOpen(false);

      setForm({
        name: "",
        batch: "",
        domain: "",
        contactNumber: "",
        email: "",
        company: "",
      });

      setPhoto(null);

      fetchAlumni();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add alumni"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this alumni entry?")) return;

    try {
      await axiosInstance.delete(`/alumni/${id}`);
      fetchAlumni();
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass =
    "w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition";

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Alumni
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            BETA alumni network across batches
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="self-start sm:self-auto bg-blue-800 hover:bg-blue-700 hover:-translate-y-0.5 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            + Add alumni
          </button>
        )}
      </div>

      {!loading && alumniList.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Alumni Directory
            </p>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {alumniList.length} alumni
            </p>
          </div>

          <div className="text-xs text-slate-400 dark:text-slate-500">
            Search using the global search above
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : alumniList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-14 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-3xl mb-4">
            🎓
          </div>

          <h3 className="font-semibold text-slate-900 dark:text-white">
            No alumni yet
          </h3>

          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Add the first BETA alumni to the directory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {alumniList.map((alumni) => (
            <AlumniCard
              key={alumni.id}
              alumni={alumni}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add alumni"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
              Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                Batch
              </label>

              <input
                type="text"
                value={form.batch}
                onChange={(e) =>
                  setForm({
                    ...form,
                    batch: e.target.value,
                  })
                }
                placeholder="2022"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                Domain
              </label>

              <input
                type="text"
                value={form.domain}
                onChange={(e) =>
                  setForm({
                    ...form,
                    domain: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
              Company
            </label>

            <input
              type="text"
              value={form.company}
              onChange={(e) =>
                setForm({
                  ...form,
                  company: e.target.value,
                })
              }
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
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
                value={form.contactNumber}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contactNumber: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
              Photo (optional)
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
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
            {submitting ? "Adding..." : "Add alumni"}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}