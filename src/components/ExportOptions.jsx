export default function ExportOptions() {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">File Format</label>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-primary bg-primary/5 dark:bg-primary/10 text-primary font-bold">
            <span className="material-symbols-outlined">csv</span>
            CSV
          </button>
          <button className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:border-primary/50 transition-colors">
            <span className="material-symbols-outlined">table_chart</span>
            Excel (XLSX)
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Include in Report</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer">
            <input defaultChecked type="checkbox" className="size-5 rounded border-slate-300 text-primary focus:ring-primary" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Student Registration Numbers</span>
          </label>
          <label className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer">
            <input defaultChecked type="checkbox" className="size-5 rounded border-slate-300 text-primary focus:ring-primary" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Timestamp of Entry</span>
          </label>
          <label className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer">
            <input type="checkbox" className="size-5 rounded border-slate-300 text-primary focus:ring-primary" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Location Metadata</span>
          </label>
        </div>
      </div>
    </div>
  );
}
