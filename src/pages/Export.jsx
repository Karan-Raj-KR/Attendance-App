import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import ExportOptions from '../components/ExportOptions';

export default function Export() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-card-dark/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4 flex items-center justify-between w-full">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors -ml-2 active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-slate-100" strokeWidth={2} />
        </button>
        <h1 className="text-xl font-bold tracking-tight">Export Attendance</h1>
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
          <div className="flex flex-col gap-1 rounded-2xl p-6 bg-white dark:bg-card-dark shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-widest">Total Students</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">45</p>
              <span className="text-slate-400 text-sm font-semibold tracking-wide">100%</span>
            </div>
            <div className="mt-5 w-full bg-slate-100 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-full rounded-full"></div>
            </div>
          </div>

          {/* Present */}
          <div className="flex flex-col gap-1 rounded-2xl p-6 bg-white dark:bg-card-dark shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-widest">Present</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">42</p>
              <span className="text-emerald-600/70 dark:text-emerald-400/70 text-sm font-semibold tracking-wide">93.3%</span>
            </div>
            <div className="mt-5 w-full bg-slate-100 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[93%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
            </div>
          </div>

          {/* Absent */}
          <div className="flex flex-col gap-1 rounded-2xl p-6 bg-white dark:bg-card-dark shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-widest">Absent</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-4xl font-bold text-rose-600 dark:text-rose-400 tracking-tight">03</p>
              <span className="text-rose-600/70 dark:text-rose-400/70 text-sm font-semibold tracking-wide">6.7%</span>
            </div>
            <div className="mt-5 w-full bg-slate-100 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-[7%] rounded-full shadow-[0_0_10px_rgba(244,63,94,0.3)]"></div>
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
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_8px_25px_rgba(37,99,235,0.35)] flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <Download className="w-5 h-5" strokeWidth={2.5} />
            <span className="text-[17px]">Export Report (.csv)</span>
          </button>
          <p className="text-center text-slate-500 dark:text-slate-400 text-xs mt-4">
            The report will be saved to your device's default download folder.
          </p>
        </div>
      </main>
    </div>
  );
}
