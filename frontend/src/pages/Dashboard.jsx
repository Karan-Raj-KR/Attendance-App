import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, UserPlus, History, GraduationCap, Users, CalendarCheck } from 'lucide-react';
import { useSections } from '../hooks/useSections';
import { useStudents } from '../hooks/useStudents';
import { useAttendance } from '../hooks/useAttendance';
import { useAppContext } from '../context/AppContext';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import ErrorAlert from '../components/common/ErrorAlert';
import { formatDate } from '../utils/helpers';

export default function Dashboard() {
  const navigate = useNavigate();
  const { sections, loading: secLoading } = useSections();
  const { selectedSectionId, setSelectedSectionId } = useAppContext();
  const { students, loading: stuLoading } = useStudents(selectedSectionId);
  const { sessions, loadSessions, loading: sesLoading } = useAttendance();

  useEffect(() => {
    if (sections.length > 0 && !selectedSectionId) {
      setSelectedSectionId(sections[0].id);
    }
  }, [sections, selectedSectionId, setSelectedSectionId]);

  useEffect(() => {
    loadSessions(selectedSectionId);
  }, [loadSessions, selectedSectionId]);

  const latestSession = sessions.length > 0 ? sessions[0] : null;
  const isLoading = secLoading || stuLoading || sesLoading;

  if (isLoading && sections.length === 0) {
    return <Loader fullPage text="Loading dashboard..." />;
  }

  const quickActions = [
    {
      icon: Camera,
      label: 'Capture\nAttendance',
      color: 'from-indigo-600 to-indigo-500',
      shadow: 'shadow-indigo-500/30',
      to: '/capture',
    },
    {
      icon: UserPlus,
      label: 'Register\nStudent',
      color: 'from-emerald-600 to-emerald-500',
      shadow: 'shadow-emerald-500/30',
      to: '/register',
    },
    {
      icon: History,
      label: 'View\nHistory',
      color: 'from-amber-600 to-amber-500',
      shadow: 'shadow-amber-500/30',
      to: '/history',
    },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Smart Attendance System</p>
      </div>

      {/* Section Selector */}
      {sections.length > 0 && (
        <select
          value={selectedSectionId || ''}
          onChange={(e) => setSelectedSectionId(Number(e.target.value))}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id} className="bg-slate-900">
              {s.name} — {s.course_name}
            </option>
          ))}
        </select>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {quickActions.map(({ icon: Icon, label, color, shadow, to }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`
              bg-gradient-to-br ${color} ${shadow}
              rounded-2xl p-4 flex flex-col items-center gap-2.5
              shadow-lg active:scale-[0.96] transition-all duration-200
            `}
          >
            <Icon className="w-6 h-6 text-white" />
            <span className="text-white text-xs font-medium text-center whitespace-pre-line leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{sections.length}</p>
              <p className="text-slate-400 text-xs">Sections</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{students.length}</p>
              <p className="text-slate-400 text-xs">Students</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Latest Session */}
      {latestSession && (
        <Card title="Latest Session" subtitle={formatDate(latestSession.date)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarCheck className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-white text-sm font-medium">{latestSession.section}</p>
                <p className="text-slate-400 text-xs">
                  {latestSession.present} present · {latestSession.absent} absent
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/session/${latestSession.session_id}`)}
              className="text-indigo-400 text-xs font-medium hover:text-indigo-300 transition-colors"
            >
              View →
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
