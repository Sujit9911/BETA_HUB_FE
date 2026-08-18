import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [photoFile, setPhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [docLabel, setDocLabel] = useState("");
  const [docFile, setDocFile] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const { isAdmin } = useAuth();

  const fetchEvent = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!photoFile) return;

    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("file", photoFile);

      await axiosInstance.post(`/events/${id}/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPhotoFile(null);
      fetchEvent();
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDocUpload = async (e) => {
    e.preventDefault();
    if (!docFile || !docLabel) return;

    setUploadingDoc(true);

    try {
      const formData = new FormData();
      formData.append("label", docLabel);
      formData.append("file", docFile);

      await axiosInstance.post(`/events/${id}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDocLabel("");
      setDocFile(null);
      fetchEvent();
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!confirm("Delete this photo?")) return;

    try {
      await axiosInstance.delete(`/events/photos/${photoId}`);
      fetchEvent();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDoc = async (docId) => {
    if (!confirm("Delete this document?")) return;

    try {
      await axiosInstance.delete(`/events/documents/${docId}`);
      fetchEvent();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async () => {
    if (!confirm("Delete this entire event? This cannot be undone.")) return;

    try {
      await axiosInstance.delete(`/events/${id}`);
      window.location.href = "/dashboard/events";
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-slate-400">Loading...</p>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <p className="text-slate-400">Event not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Link
        to="/dashboard/events"
        className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 mb-4 inline-block"
      >
        ← Back to events
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <span className="inline-block text-xs font-medium text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full mb-2">
            {event.category}
          </span>

          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {event.title}
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {new Date(event.eventDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleDeleteEvent}
            className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
          >
            Delete event
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <p className="font-semibold text-slate-900 dark:text-white mb-2">
              Description
            </p>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              {event.description || "No description provided."}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <p className="font-semibold text-slate-900 dark:text-white mb-4">
              Photos ({event.photos?.length || 0})
            </p>

            {event.photos?.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {event.photos.map((p) => (
                  <div
                    key={p.id}
                    className="relative group aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={p.photoUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />

                    {isAdmin && (
                      <button
                        onClick={() => handleDeletePhoto(p.id)}
                        className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <form
              onSubmit={handlePhotoUpload}
              className="flex items-center gap-3"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0])}
                className="flex-1 text-sm text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 dark:file:bg-blue-950/50 file:text-blue-800 dark:file:text-blue-300 file:text-sm file:font-medium file:cursor-pointer file:transition-all file:duration-200 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 hover:file:scale-[1.02]"
              />

              <button
                type="submit"
                disabled={!photoFile || uploadingPhoto}
                className="bg-blue-800 hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap"
              >
                {uploadingPhoto ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <p className="font-semibold text-slate-900 dark:text-white mb-4">
              Documents ({event.documents?.length || 0})
            </p>

            {event.documents?.length > 0 && (
              <div className="space-y-2 mb-4">
                {event.documents.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-2.5"
                  >
                    <a
                      href={d.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-blue-700 dark:text-blue-400 hover:underline"
                    >
                      📄 {d.label}
                    </a>

                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteDoc(d.id)}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleDocUpload} className="space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={docLabel}
                  onChange={(e) => setDocLabel(e.target.value)}
                  placeholder="Label (e.g. Proposal)"
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition"
                />

                <input
                  type="file"
                  onChange={(e) => setDocFile(e.target.files[0])}
                  className="flex-1 text-sm text-slate-600 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 dark:file:bg-blue-950/50 file:text-blue-800 dark:file:text-blue-300 file:text-xs file:cursor-pointer file:transition-all file:duration-200 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 hover:file:scale-[1.02]"
                />
              </div>

              <button
                type="submit"
                disabled={!docFile || !docLabel || uploadingDoc}
                className="bg-blue-800 hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
              >
                {uploadingDoc ? "Uploading..." : "Upload document"}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 h-fit">
          <p className="font-semibold text-slate-900 dark:text-white mb-4">
            Coordinator
          </p>

          {event.coordinatorName ? (
            <>
              <p className="text-sm text-slate-900 dark:text-white font-medium">
                {event.coordinatorName}
              </p>

              {event.coordinatorContact && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {event.coordinatorContact}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-400">Not assigned</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}