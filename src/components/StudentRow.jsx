import StatusBadge from './StatusBadge';

export default function StudentRow({ student, onEdit }) {
  const isUncertain = student.status === 'uncertain';
  
  if (isUncertain) {
    return (
      <div className="px-4 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors bg-amber-50 dark:bg-amber-900/10 border-b border-amber-200 dark:border-amber-900/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined">person_search</span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-500">{student.name}</p>
            <p className="text-xs text-amber-700/70">Requires Manual Review</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-amber-500">
           <button onClick={() => onEdit?.(student)} className="hover:bg-amber-500/10 p-2 rounded-full transition-colors flex">
             <span className="material-symbols-outlined text-sm">edit_square</span>
           </button>
        </div>
      </div>
    );
  }

  const borderColors = {
    present: 'border-emerald-100 dark:border-emerald-900/30',
    absent: 'border-rose-100 dark:border-rose-900/30'
  };
  
  const dotColors = {
    present: 'bg-emerald-500',
    absent: 'bg-rose-500'
  };

  return (
    <div className="px-4 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-50 dark:border-slate-800/50">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img 
            src={student.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${student.id}`} 
            alt={student.name}
            className={`h-12 w-12 rounded-full object-cover border-2 ${borderColors[student.status] || ''}`} 
          />
          <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 ${dotColors[student.status] || ''}`}></div>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{student.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">ID: {student.id}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={student.status} />
        <button onClick={() => onEdit?.(student)} className="text-slate-400 hover:text-primary transition-colors p-1">
          <span className="material-symbols-outlined text-xl">edit_square</span>
        </button>
      </div>
    </div>
  );
}
