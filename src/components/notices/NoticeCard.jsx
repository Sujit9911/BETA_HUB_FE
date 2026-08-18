import { useState } from "react";
import Modal from "../ui/Modal";
import { CalendarIcon, PinIcon } from "../ui/Icons";

export default function NoticeCard({
  notice,
  isAdmin,
  onDelete,
  onTogglePin,
}) {
  const [open, setOpen] = useState(false);

  const typeColors = {
    Meeting: "bg-blue-600 text-white",
    Urgent: "bg-red-600 text-white",
    Event: "bg-amber-500 text-white",
  };

  const badgeClass =
    typeColors[notice.type] || "bg-slate-700 text-white";

  const noticeDate = new Date(notice.createdAt);

  const formattedDate = noticeDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
        <div
          className={`h-1 w-full ${
            notice.type === "Urgent"
              ? "bg-red-500"
              : notice.type === "Event"
              ? "bg-amber-500"
              : "bg-blue-600"
          }`}
        />

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-full ${badgeClass}`}
              >
                {notice.type}
              </span>

              {notice.pinned && (
                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1.5 rounded-full">
                  <PinIcon className="w-3.5 h-3.5" />
                  <span>Pinned</span>
                </span>
              )}
            </div>

            {isAdmin && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onTogglePin(notice)}
                  className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 px-2 py-1 rounded-md transition"
                >
                  {notice.pinned ? "Unpin" : "Pin"}
                </button>

                <button
                  onClick={() => onDelete(notice.id)}
                  className="text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 px-2 py-1 rounded-md transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
              {notice.title}
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
              {notice.content}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <CalendarIcon className="w-4 h-4" />

              <span className="text-xs font-medium">
                {formattedDate}
              </span>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all hover:text-blue-800 dark:hover:text-blue-300"
            >
              Read notice →
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={notice.title}
      >
        <div className="space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-full ${badgeClass}`}
            >
              {notice.type}
            </span>

            {notice.pinned && (
              <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1.5 rounded-full">
                <PinIcon className="w-3.5 h-3.5" />
                Pinned notice
              </span>
            )}
          </div>

          <div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-7 whitespace-pre-wrap">
              {notice.content}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Posted on
            </p>

            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
              {formattedDate}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}