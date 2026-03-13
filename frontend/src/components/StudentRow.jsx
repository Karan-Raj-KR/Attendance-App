import { UserSearch, Edit } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function StudentRow({ student, onEdit }) {
  const isUncertain = student.status === 'uncertain';
  
  if (isUncertain) {
    return (
      <div className="px-4 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors bg-amber-50 dark:bg-amber-900/10 border-b border-amber-200 dark:border-amber-900/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-200/50 dark:bg-slate-700/50 flex items-center justify-center text-amber-600">
            <UserSearch className="w-6 h-6" strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <p className="text-[15px] font-bold text-amber-900 dark:text-amber-500 tracking-tight">{student.name}</p>
            <p className="text-xs font-semibold text-amber-700/70">Requires Manual Review</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-amber-500">
           <button onClick={() => onEdit?.(student)} className="hover:bg-amber-500/10 p-2.5 rounded-full transition-colors flex active:scale-95">
             <Edit className="w-5 h-5 text-amber-600" strokeWidth={2} />
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
            className={`h-12 w-12 rounded-full object-cover border-[2.5px] ${borderColors[student.status] || ''}`} 
          />
          <div className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 ${dotColors[student.status] || ''}`}></div>
        </div>
        <div className="flex flex-col">
          <p className="text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">{student.name}</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">ID: {student.id}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={student.status} />
        <button onClick={() => onEdit?.(student)} className="text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95">
          <Edit className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
