import { statusBg, formatConfidence } from '../../utils/helpers';

export default function StudentMatchCard({ face, onToggle }) {
  const isPresent = face.status === 'present';
  const isUncertain = face.status === 'uncertain';
  const isUnmatched = face.status === 'unmatched';

  return (
    <div
      className={`
        flex items-center gap-3 p-3.5 rounded-xl border
        transition-all duration-200
        ${isPresent
          ? 'bg-emerald-500/8 border-emerald-500/20'
          : isUncertain
            ? 'bg-amber-500/8 border-amber-500/20'
            : 'bg-white/5 border-white/10'}
      `}
    >
      {/* Avatar placeholder */}
      <div
        className={`
          w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0
          ${isPresent
            ? 'bg-emerald-500/20 text-emerald-400'
            : isUncertain
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-slate-500/20 text-slate-400'}
        `}
      >
        {face.name ? face.name.charAt(0).toUpperCase() : '?'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">
          {face.name || 'Unknown Face'}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {face.student_id_number && (
            <span className="text-slate-500 text-xs">{face.student_id_number}</span>
          )}
          <span className={`text-xs font-medium ${statusBg(face.status)} px-1.5 py-0.5 rounded-md border`}>
            {face.status}
          </span>
        </div>
      </div>

      {/* Confidence */}
      <div className="text-right flex-shrink-0">
        <p className="text-white text-sm font-mono">
          {formatConfidence(face.confidence)}
        </p>
      </div>

      {/* Toggle */}
      {onToggle && !isUnmatched && (
        <button
          onClick={() => onToggle(face)}
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
            transition-all duration-200
            ${isPresent
              ? 'bg-emerald-500 text-white'
              : 'bg-white/10 text-slate-400 hover:bg-white/20'}
          `}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
