import {
  BuildingIcon,
  MailIcon,
  PhoneIcon,
} from "../ui/Icons";

export default function AlumniCard({
  alumni,
  isAdmin,
  onDelete,
}) {
  const initials = alumni.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
      <div className="h-1 bg-blue-700 group-hover:bg-blue-500 transition-colors duration-300" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {alumni.photoUrl ? (
              <img
                src={alumni.photoUrl}
                alt={alumni.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-transform duration-300">
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <p className="font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                {alumni.name}
              </p>

              <span className="inline-block mt-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                Batch {alumni.batch}
              </span>
            </div>
          </div>

          {alumni.domain && (
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1.5 rounded-lg max-w-24 truncate">
              {alumni.domain}
            </span>
          )}
        </div>

        <div className="mt-5 space-y-3">
          {alumni.company && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
                <BuildingIcon className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                  Company
                </p>

                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                  {alumni.company}
                </p>
              </div>
            </div>
          )}

          {alumni.email && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
                <MailIcon className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                  {alumni.email}
                </p>
              </div>
            </div>
          )}

          {alumni.contactNumber && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
                <PhoneIcon className="w-4 h-4" />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                  Contact
                </p>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {alumni.contactNumber}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            BETA Alumni
          </span>

          {isAdmin && (
            <button
              onClick={() => onDelete(alumni.id)}
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}