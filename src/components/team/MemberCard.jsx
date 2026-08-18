export default function MemberCard({ member, isAdmin, onDelete }) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">

      <div className="h-1 bg-blue-700 group-hover:bg-blue-500 transition-colors duration-300" />

      <div className="p-6 text-center">

        <div className="relative inline-block">
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-50 dark:border-blue-950/50 shadow-sm group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 flex items-center justify-center text-xl font-bold mx-auto border-4 border-blue-100 dark:border-blue-900 group-hover:scale-105 transition-transform duration-300">
              {initials}
            </div>
          )}

          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900" />
        </div>

        <div className="mt-4">
          <p className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
            {member.name}
          </p>

          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mt-1">
            {member.designation}
          </p>
        </div>

        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="inline-block text-xs text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mt-2 transition-colors"
          >
            {member.email}
          </a>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">

          {member.branch && (
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              {member.branch}
            </span>
          )}

          {member.year && (
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              {member.year}
            </span>
          )}

          {member.passingYear && (
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              Passing {member.passingYear}
            </span>
          )}

        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
            BETA Core Committee
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => onDelete(member.id)}
            className="absolute top-4 right-4 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            Remove
          </button>
        )}

      </div>
    </div>
  );
}