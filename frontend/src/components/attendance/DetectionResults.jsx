import { Users, UserX, ScanFace } from 'lucide-react';
import StudentMatchCard from './StudentMatchCard';
import Card from '../common/Card';

export default function DetectionResults({ result, onToggleFace }) {
  if (!result) return null;

  const { total_faces_detected, results, absent_students } = result;
  const presentCount = results.filter((f) => f.status === 'present').length;

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-center">
          <ScanFace className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{total_faces_detected}</p>
          <p className="text-indigo-300 text-xs">Detected</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
          <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{presentCount}</p>
          <p className="text-emerald-300 text-xs">Matched</p>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-center">
          <UserX className="w-5 h-5 text-rose-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{absent_students.length}</p>
          <p className="text-rose-300 text-xs">Absent</p>
        </div>
      </div>

      {/* Matched faces */}
      {results.length > 0 && (
        <Card title="Detected Students" subtitle="Toggle to adjust attendance">
          <div className="space-y-2">
            {results.map((face, idx) => (
              <StudentMatchCard key={face.student_id || idx} face={face} onToggle={onToggleFace} />
            ))}
          </div>
        </Card>
      )}

      {/* Absent students */}
      {absent_students.length > 0 && (
        <Card title="Absent Students">
          <div className="space-y-2">
            {absent_students.map((s) => (
              <div
                key={s.student_id}
                className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/15"
              >
                <div className="w-9 h-9 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-400 text-sm font-bold">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{s.name}</p>
                  <p className="text-slate-500 text-xs">{s.student_id_number}</p>
                </div>
                <span className="text-rose-400 text-xs font-medium">Absent</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
