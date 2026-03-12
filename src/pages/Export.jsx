import { useNavigate } from 'react-router-dom';
import ExportOptions from '../components/ExportOptions';

export default function Export() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between w-full">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors -ml-2"
        >
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight">Export Attendance</h1>
        <div className="size-10"></div> {/* Spacer for symmetry */}
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Summary Title */}
        <div className="px-4 pt-6 pb-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Attendance Summary</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Class: Computer Science 101 • Oct 24, 2023</p>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {/* Total Students */}
          <div className="flex flex-col gap-1 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Total Students</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">45</p>
              <span className="text-slate-400 text-sm font-medium">100%</span>
            </div>
            <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-full"></div>
            </div>
          </div>

          {/* Present */}
          <div className="flex flex-col gap-1 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Present</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">42</p>
              <span className="text-emerald-600/70 dark:text-emerald-400/70 text-sm font-medium">93.3%</span>
            </div>
            <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[93%]"></div>
            </div>
          </div>

          {/* Absent */}
          <div className="flex flex-col gap-1 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Absent</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">03</p>
              <span className="text-rose-600/70 dark:text-rose-400/70 text-sm font-medium">6.7%</span>
            </div>
            <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-[7%]"></div>
            </div>
          </div>
        </div>

        {/* Export Options Section */}
        <div className="px-4 pt-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4">Export Options</h3>
          <ExportOptions />
        </div>

        {/* Primary Action */}
        <div className="p-4 mt-6">
          <button 
            onClick={() => {
              alert("Report exported successfully!");
              navigate('/dashboard');
            }}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">download</span>
            Export Report (.csv)
          </button>
          <p className="text-center text-slate-500 dark:text-slate-400 text-xs mt-4">
            The report will be saved to your device's default download folder.
          </p>
        </div>
      </main>
    </div>
  );
}
