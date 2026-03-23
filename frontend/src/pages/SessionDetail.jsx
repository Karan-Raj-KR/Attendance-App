import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, CalendarCheck } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorAlert from '../components/common/ErrorAlert';
import { statusBg, formatConfidence, formatDate } from '../utils/helpers';

export default function SessionDetail() {
  const { sessionId } = useParams();
  const { records, loadRecords, exportCSV, loading, error, clearError } = useAttendance();

  useEffect(() => {
    if (sessionId) loadRecords(Number(sessionId));
  }, [sessionId, loadRecords]);

  const presentCount = records.filter((r) => r.status === 'present').length;
  const absentCount = records.filter((r) => r.status === 'absent').length;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Session #{sessionId}</h1>
          <p className="text-slate-400 text-sm mt-1">
            {presentCount} present · {absentCount} absent
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={Download}
          onClick={() => exportCSV(Number(sessionId))}
        >
          CSV
        </Button>
      </div>

      {error && <ErrorAlert message={error} onDismiss={clearError} />}

      {loading ? (
        <Loader text="Loading records..." />
      ) : (
        <Card>
          <div className="space-y-2">
            {records.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5"
              >
                <div
                  className={`
                    w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0
                    ${r.status === 'present' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}
                  `}
                >
                  {(r.student_name || '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{r.student_name}</p>
                  <p className="text-slate-500 text-xs">{r.student_id_number}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs font-mono">
                    {formatConfidence(r.confidence)}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${statusBg(r.status)}`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
