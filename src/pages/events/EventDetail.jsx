import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function EventDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();

  const photoInputRef = useRef(null);
  const docInputRef = useRef(null);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Photos */
  const [photoFiles, setPhotoFiles] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");

  /* Documents */
  const [docLabel, setDocLabel] = useState("");
  const [docFile, setDocFile] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docError, setDocError] = useState("");

  /* =========================
     ERROR MESSAGE HELPER
  ========================= */

  const getErrorMessage = (err, fallback) => {
    const data = err.response?.data;

    if (typeof data === "string") {
      return data;
    }

    if (data?.message) {
      return data.message;
    }

    if (data?.error) {
      return data.error;
    }

    return fallback;
  };

  /* =========================
     FETCH EVENT
  ========================= */

  const fetchEvent = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error("Failed to fetch event:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  /* =========================
     PHOTO SELECTION
  ========================= */

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || []);

    setPhotoError("");

    if (!files.length) {
      setPhotoFiles([]);
      return;
    }

    const invalidFiles = files.filter(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFiles.length > 0) {
      setPhotoError("Please select image files only.");
      e.target.value = "";
      setPhotoFiles([]);
      return;
    }

    setPhotoFiles(files);
  };

  const removeSelectedPhoto = (index) => {
    setPhotoFiles((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  const clearPhotoSelection = () => {
    setPhotoFiles([]);

    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  /* =========================
     PHOTO UPLOAD
  ========================= */

  const handlePhotoUpload = async (e) => {
    e.preventDefault();

    if (!photoFiles.length) {
      setPhotoError("Please select at least one photo.");
      return;
    }

    setUploadingPhoto(true);
    setPhotoError("");

    try {
      /*
       * Backend accepts one file per request.
       * Upload selected photos one by one.
       */
      for (const photo of photoFiles) {
        const formData = new FormData();

        formData.append("file", photo);

        await axiosInstance.post(
          `/events/${id}/photos`,
          formData
        );
      }

      clearPhotoSelection();

      await fetchEvent();
    } catch (err) {
      console.error("Photo upload failed:", err);

      setPhotoError(
        getErrorMessage(
          err,
          "Failed to upload one or more photos. Please try again."
        )
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  /* =========================
     DOCUMENT SELECTION
  ========================= */

  const handleDocSelect = (e) => {
    const file = e.target.files?.[0];

    setDocError("");

    if (!file) {
      setDocFile(null);
      return;
    }

    setDocFile(file);
  };

  const clearDocSelection = () => {
    setDocFile(null);

    if (docInputRef.current) {
      docInputRef.current.value = "";
    }
  };

  /* =========================
     DOCUMENT UPLOAD
  ========================= */

  const handleDocUpload = async (e) => {
    e.preventDefault();

    setDocError("");

    if (!docLabel.trim()) {
      setDocError("Please enter a document label.");
      return;
    }

    if (!docFile) {
      setDocError("Please select a document.");
      return;
    }

    setUploadingDoc(true);

    try {
      const formData = new FormData();

      formData.append("label", docLabel.trim());
      formData.append("file", docFile);

      /*
       * IMPORTANT:
       *
       * Do NOT manually set Content-Type.
       *
       * axiosInstance detects FormData and removes the
       * global application/json header.
       */
      await axiosInstance.post(
        `/events/${id}/documents`,
        formData
      );

      setDocLabel("");
      clearDocSelection();

      await fetchEvent();
    } catch (err) {
      console.error("Document upload failed:", err);

      setDocError(
        getErrorMessage(
          err,
          "Failed to upload document. Please try again."
        )
      );
    } finally {
      setUploadingDoc(false);
    }
  };

  /* =========================
     DELETE PHOTO
  ========================= */

  const handleDeletePhoto = async (photoId) => {
    if (!confirm("Delete this photo?")) {
      return;
    }

    try {
      await axiosInstance.delete(
        `/events/photos/${photoId}`
      );

      await fetchEvent();
    } catch (err) {
      console.error("Failed to delete photo:", err);
    }
  };

  /* =========================
     DELETE DOCUMENT
  ========================= */

  const handleDeleteDoc = async (documentId) => {
    if (!confirm("Delete this document?")) {
      return;
    }

    try {
      await axiosInstance.delete(
        `/events/documents/${documentId}`
      );

      await fetchEvent();
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  /* =========================
     DELETE EVENT
  ========================= */

  const handleDeleteEvent = async () => {
    if (
      !confirm(
        "Delete this entire event? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axiosInstance.delete(`/events/${id}`);

      window.location.href = "/dashboard/events";
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-slate-400">
          Loading...
        </p>
      </DashboardLayout>
    );
  }

  /* =========================
     NOT FOUND
  ========================= */

  if (!event) {
    return (
      <DashboardLayout>
        <p className="text-slate-400">
          Event not found.
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      {/* Back */}
      <Link
        to="/dashboard/events"
        className="inline-block mb-4 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition"
      >
        ← Back to events
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">

        <div>
          <span className="inline-block text-xs font-medium text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full mb-2">
            {event.category}
          </span>

          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {event.title}
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {new Date(event.eventDate).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleDeleteEvent}
            className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline transition"
          >
            Delete event
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">

          {/* Description */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">

            <p className="font-semibold text-slate-900 dark:text-white mb-2">
              Description
            </p>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-6">
              {event.description ||
                "No description provided."}
            </p>

          </div>

          {/* =========================
              PHOTOS
          ========================= */}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">

            <div className="flex items-center justify-between mb-4">

              <p className="font-semibold text-slate-900 dark:text-white">
                Photos ({event.photos?.length || 0})
              </p>

              {photoFiles.length > 0 && (
                <span className="text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full">
                  {photoFiles.length} selected
                </span>
              )}

            </div>

            {/* Existing photos */}
            {event.photos?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-5">

                {event.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"
                  >

                    <img
                      src={photo.photoUrl}
                      alt=""
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDeletePhoto(photo.id)
                        }
                        className="absolute inset-0 bg-black/50 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                      >
                        Delete
                      </button>
                    )}

                  </div>
                ))}

              </div>
            )}

            {/* Selected preview */}
            {photoFiles.length > 0 && (
              <div className="mb-5">

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Selected photos
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">

                  {photoFiles.map((file, index) => {
                    const previewUrl =
                      URL.createObjectURL(file);

                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="relative aspect-square rounded-xl overflow-hidden border border-blue-200 dark:border-blue-800 bg-slate-100 dark:bg-slate-800"
                      >

                        <img
                          src={previewUrl}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          onLoad={(e) =>
                            URL.revokeObjectURL(
                              e.currentTarget.src
                            )
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeSelectedPhoto(index)
                          }
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center hover:bg-red-600 transition"
                        >
                          ×
                        </button>

                      </div>
                    );
                  })}

                </div>

              </div>
            )}

            {/* Upload form */}
            <form onSubmit={handlePhotoUpload}>

              <div className="flex flex-col sm:flex-row gap-3">

                <label
                  className={`flex-1 flex items-center justify-center gap-2 border border-dashed rounded-xl px-4 py-3 cursor-pointer transition ${
                    photoFiles.length
                      ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30"
                      : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                  }`}
                >

                  <span className="text-lg">
                    📷
                  </span>

                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {photoFiles.length
                      ? `${photoFiles.length} photo${
                          photoFiles.length > 1
                            ? "s"
                            : ""
                        } selected`
                      : "Choose photos"}
                  </span>

                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />

                </label>

                <button
                  type="submit"
                  disabled={
                    !photoFiles.length ||
                    uploadingPhoto
                  }
                  className={`sm:w-32 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    photoFiles.length &&
                    !uploadingPhoto
                      ? "bg-blue-800 hover:bg-blue-700 active:scale-[0.98] text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {uploadingPhoto
                    ? "Uploading..."
                    : "Upload"}
                </button>

              </div>

              {photoFiles.length > 0 &&
                !uploadingPhoto && (
                  <button
                    type="button"
                    onClick={clearPhotoSelection}
                    className="mt-2 text-xs font-medium text-slate-500 hover:text-red-600 transition"
                  >
                    Clear selection
                  </button>
                )}

              {photoError && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
                  {photoError}
                </p>
              )}

            </form>

          </div>

          {/* =========================
              DOCUMENTS
          ========================= */}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">

            <p className="font-semibold text-slate-900 dark:text-white mb-4">
              Documents ({event.documents?.length || 0})
            </p>

            {/* Existing documents */}
            {event.documents?.length > 0 && (
              <div className="space-y-2 mb-5">

                {event.documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700"
                  >

                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 min-w-0 text-sm font-medium text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >

                      <span className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-base shrink-0">
                        📄
                      </span>

                      <span className="truncate">
                        {document.label}
                      </span>

                    </a>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteDoc(document.id)
                        }
                        className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 whitespace-nowrap transition"
                      >
                        Delete
                      </button>
                    )}

                  </div>
                ))}

              </div>
            )}

            {/* Document form */}
            <form
              onSubmit={handleDocUpload}
              className="space-y-3"
            >

              <input
                type="text"
                value={docLabel}
                onChange={(e) => {
                  setDocLabel(e.target.value);
                  setDocError("");
                }}
                placeholder="Document label (e.g. Proposal, Brochure, Schedule)"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
              />

              <div className="flex flex-col sm:flex-row gap-3">

                <label
                  className={`flex-1 flex items-center gap-3 border border-dashed rounded-xl px-4 py-3 cursor-pointer transition ${
                    docFile
                      ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30"
                      : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                  }`}
                >

                  <span className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                    📎
                  </span>

                  <div className="min-w-0">

                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                      {docFile
                        ? docFile.name
                        : "Choose document"}
                    </p>

                    <p className="text-xs text-slate-400 mt-0.5">
                      PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX
                    </p>

                  </div>

                  <input
                    ref={docInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                    onChange={handleDocSelect}
                    className="hidden"
                  />

                </label>

                <button
                  type="submit"
                  disabled={
                    !docFile ||
                    !docLabel.trim() ||
                    uploadingDoc
                  }
                  className={`sm:w-44 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    docFile &&
                    docLabel.trim() &&
                    !uploadingDoc
                      ? "bg-blue-800 hover:bg-blue-700 active:scale-[0.98] text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {uploadingDoc
                    ? "Uploading..."
                    : "Upload document"}
                </button>

              </div>

              {docFile && !uploadingDoc && (
                <button
                  type="button"
                  onClick={clearDocSelection}
                  className="text-xs font-medium text-slate-500 hover:text-red-600 transition"
                >
                  Remove selected file
                </button>
              )}

              {docError && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
                  {docError}
                </p>
              )}

            </form>

          </div>

        </div>

        {/* =========================
            COORDINATOR
        ========================= */}

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
            <p className="text-sm text-slate-400">
              Not assigned
            </p>
          )}

        </div>

      </div>
    </DashboardLayout>
  );
}