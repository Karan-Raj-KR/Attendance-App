import { Users, Clock, CheckCircle2, Terminal, Database, Code } from 'lucide-react';

export default function SectionCard({ color, icon, name, title, enrolled, time, onAction }) {
  // Map icon names to Lucide components
  const getIconComponent = (iconName) => {
    switch(iconName) {
      case 'terminal': return Terminal;
      case 'database': return Database;
      case 'developer_mode': return Code;
      default: return Terminal;
    }
  };
  const Icon = getIconComponent(icon.name);
  return (
    <div className="relative group overflow-hidden rounded-2xl bg-white dark:bg-card-dark shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-300">
      <div className={`absolute top-0 left-0 w-1.5 h-full ${color}`}></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-5">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${icon.bgClass}`}>
            <Icon className="w-7 h-7" strokeWidth={2} />
          </div>
          <span className="text-[10px] font-bold tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full uppercase">
            {name}
          </span>
        </div>
        <div>
          <h4 className="text-xl font-bold mb-2 tracking-tight">{title}</h4>
          <div className="space-y-2.5 mb-6">
            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              <Users className="w-4 h-4 mr-2.5" strokeWidth={2} />
              {enrolled} Students Enrolled
            </div>
            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              <Clock className="w-4 h-4 mr-2.5" strokeWidth={2} />
              {time}
            </div>
          </div>
          <button 
            onClick={onAction}
            className="w-full bg-slate-50 hover:bg-primary hover:text-white dark:bg-slate-800 dark:hover:bg-primary text-primary font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
          >
            <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
            Take Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
