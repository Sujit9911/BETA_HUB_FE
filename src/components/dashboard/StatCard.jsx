export default function StatCard({ label, value, icon }) {
  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {value}
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:scale-105">
          {icon}
        </div>
      </div>
    </div>
  );
}