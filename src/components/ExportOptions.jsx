import { FileSpreadsheet, TableProperties } from 'lucide-react';

export default function ExportOptions() {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">File Format</label>
        <div className="grid grid-cols-2 gap-3.5">
          <button className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl border-2 border-primary bg-primary/5 dark:bg-primary/10 text-primary font-bold shadow-sm transition-all active:scale-95">
            <TableProperties className="w-5 h-5" strokeWidth={2.5} />
            CSV
          </button>
          <button className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-card-dark shadow-sm text-slate-600 dark:text-slate-400 font-bold hover:border-primary/50 transition-all active:scale-95">
            <FileSpreadsheet className="w-5 h-5" strokeWidth={2} />
            Excel (XLSX)
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Include in Report</label>
        <div className="space-y-2.5">
          <label className="flex items-center gap-3.5 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-card-dark shadow-sm cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <input defaultChecked type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all cursor-pointer" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold text-[15px]">Student Registration Numbers</span>
          </label>
          <label className="flex items-center gap-3.5 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-card-dark shadow-sm cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <input defaultChecked type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all cursor-pointer" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold text-[15px]">Timestamp of Entry</span>
          </label>
          <label className="flex items-center gap-3.5 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-card-dark shadow-sm cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all cursor-pointer" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold text-[15px]">Location Metadata</span>
          </label>
        </div>
      </div>
    </div>
  );
}
