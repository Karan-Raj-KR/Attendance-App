import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, Filter } from 'lucide-react';
import { useSections } from '../hooks/useSections';
import { useAttendance } from '../hooks/useAttendance';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/helpers';

export default function AttendanceHistory() {
  const navigate = useNavigate();
  const { sections } = useSections();
  const { sessions, loadSessions, loading, error, clearError } = useAttendance();
  const [filterSection, setFilterSection] = useState('');

  useEffect(() => {
    loadSessions(filterSection ? Number(filterSection) : null);
  }, [loadSessions, filterSection]);

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-xl font-bold text-white">Attendance History</h1>
        <p className="text-slate-400 text-sm mt-1">{sessions.length} sessions recorded</p>
      </div>

      {/* Filter */}
      <div className="relative">
        <Filter className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <select
          value={filterSection}
          onChange={(e) => setFilterSection(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
        >
          <option value="" className="bg-slate-900">All sections</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id} className="bg-slate-900">
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {error && <ErrorAlert message={error} onDismiss={clearError} />}

      {loading ? (
        <Loader text="Loading sessions..." />
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No sessions yet"
          message="Capture your first attendance to see it here."
          actionLabel="Capture Now"
          onAction={() => navigate('/capture')}
        />
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <button
              key={session.session_id}
              onClick={() => navigate(`/session/${session.session_id}`)}
              className="w-full text-left bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl p-4 transition-all duration-200 active:scale-[0.98] group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{session.section}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{formatDate(session.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-emerald-400 text-sm font-semibold">{session.present}</p>
                    <p className="text-slate-500 text-xs">present</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
