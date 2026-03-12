export default function DetectionSummary({ found, total, uncertain }) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase mb-1">Students Found</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">{found}</span>
          <span className="text-slate-400 text-sm">/ {total}</span>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase mb-1">Uncertain</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-yellow-500">{uncertain}</span>
          <span className="text-slate-400 text-sm">Alerts</span>
        </div>
      </div>
    </div>
  );
}
