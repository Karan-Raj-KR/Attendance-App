import { useState } from 'react';
import { CheckCircle2, XCircle, Loader2, Save, UserCheck, UserX } from 'lucide-react';
import { saveAttendance } from '../services/api';

export default function ConfirmAttendance({ presentStudents = [], absentStudents = [], section = '' }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    setSaving(true);
    setError(null);

    try {
      const payload = {
        date: new Date().toISOString().split('T')[0],
        section,
        presentStudents,
      };

      await saveAttendance(payload);
      setSaved(true);
    } catch (err) {
      setError('Failed to save attendance. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-5">

      {/* ── Present Students ──────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-1">
          <UserCheck className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Present — {presentStudents.length}
          </h2>
        </div>

        <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800/60 shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
          {presentStudents.length === 0 ? (
            <p className="px-4 py-5 text-sm text-slate-400 text-center">No students detected</p>
          ) : (
            presentStudents.map((student, i) => (
              <div
                key={student.name || i}
                className={`flex items-center gap-3.5 px-4 py-3.5 ${
                  i < presentStudents.length - 1 ? 'border-b border-slate-100 dark:border-slate-700/50' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {student.name}
                  </p>
                </div>
                {student.confidence !== undefined && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
                    {(student.confidence * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Absent Students ───────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-1">
          <UserX className="w-4 h-4 text-rose-500" strokeWidth={2.5} />
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            Absent — {absentStudents.length}
          </h2>
        </div>

        <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800/60 shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
          {absentStudents.length === 0 ? (
            <p className="px-4 py-5 text-sm text-slate-400 text-center">All students present</p>
          ) : (
            absentStudents.map((student, i) => (
              <div
                key={student.name || i}
                className={`flex items-center gap-3.5 px-4 py-3.5 ${
                  i < absentStudents.length - 1 ? 'border-b border-slate-100 dark:border-slate-700/50' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-500/15 flex items-center justify-center shrink-0">
                  <XCircle className="w-[18px] h-[18px] text-rose-600 dark:text-rose-400" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {student.name}
                  </p>
                </div>
                <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-full shrink-0">
                  Absent
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Error ─────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/50 dark:border-rose-500/20">
          <XCircle className="w-5 h-5 text-rose-500 shrink-0" strokeWidth={2} />
          <p className="text-sm font-medium text-rose-700 dark:text-rose-400">{error}</p>
        </div>
      )}

      {/* ── Confirm Button ────────────────────────────────── */}
      {!saved ? (
        <button
          onClick={handleConfirm}
          disabled={saving || presentStudents.length === 0}
          className="w-full h-[3.75rem] bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-[17px] flex items-center justify-center gap-2.5 transition-all shadow-[0_8px_25px_rgba(16,185,129,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" strokeWidth={2.5} />
              Confirm Attendance
            </>
          )}
        </button>
      ) : (
        <div className="w-full h-[3.75rem] bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl font-bold text-[17px] flex items-center justify-center gap-2.5">
          <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
          Attendance Saved Successfully
        </div>
      )}
    </div>
  );
}
