export default function SectionCard({ color, icon, name, title, enrolled, time, onAction }) {
  return (
    <div className="relative group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
      <div className={`absolute top-0 left-0 w-1 h-full ${color}`}></div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-white shrink-0 ${icon.bgClass}`}>
            <span className="material-symbols-outlined text-3xl">{icon.name}</span>
          </div>
          <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            {name}
          </span>
        </div>
        <div>
          <h4 className="text-xl font-bold mb-1">{title}</h4>
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
              <span className="material-symbols-outlined text-lg mr-2">group</span>
              {enrolled} Students Enrolled
            </div>
            <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
              <span className="material-symbols-outlined text-lg mr-2">schedule</span>
              {time}
            </div>
          </div>
          <button 
            onClick={onAction}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined">how_to_reg</span>
            Take Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
