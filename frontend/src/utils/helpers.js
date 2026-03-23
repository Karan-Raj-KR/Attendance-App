/**
 * Utility helpers used across the frontend.
 */

/**
 * Format a date string into a human-readable format.
 * @param {string} dateStr
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a confidence float (0–1) to a percentage string.
 * @param {number} confidence
 */
export function formatConfidence(confidence) {
  if (confidence == null) return '—';
  return `${(confidence * 100).toFixed(1)}%`;
}

/**
 * Truncate text to maxLen characters.
 */
export function truncate(text, maxLen = 30) {
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
}

/**
 * Return a status color class based on attendance status.
 */
export function statusColor(status) {
  switch (status) {
    case 'present':
      return 'text-emerald-400';
    case 'absent':
      return 'text-rose-400';
    case 'uncertain':
      return 'text-amber-400';
    default:
      return 'text-slate-400';
  }
}

/**
 * Return a status bg class based on attendance status.
 */
export function statusBg(status) {
  switch (status) {
    case 'present':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'absent':
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    case 'uncertain':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    default:
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
}
