import { Loader2 } from 'lucide-react';

export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <Loader2
      className={`animate-spin text-indigo-400 ${sizes[size]} ${className}`}
    />
  );
}

export default function Loader({ text = 'Loading...', fullPage = false }) {
  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spinner size="lg" />
        <p className="text-slate-400 text-sm animate-pulse">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Spinner />
      <p className="text-slate-400 text-sm">{text}</p>
    </div>
  );
}
