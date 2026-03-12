export default function FaceBoundingBox({ top, left, width, height, status, name }) {
  const isConfirmed = status === 'present';
  
  return (
    <div 
      className={`absolute border-2 rounded-sm ${isConfirmed ? 'border-primary bg-primary/10' : 'border-yellow-500 bg-yellow-500/10'}`}
      style={{ top, left, width, height }}
    >
      <div className={`absolute -top-6 left-0 text-white text-[10px] px-2 py-0.5 rounded-t-sm flex items-center gap-1 ${isConfirmed ? 'bg-primary' : 'bg-yellow-500'}`}>
        <span className="material-symbols-outlined text-[12px]">
          {isConfirmed ? 'verified' : 'help_outline'}
        </span>
        {name}
      </div>
    </div>
  );
}
