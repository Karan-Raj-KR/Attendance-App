export default function CameraFrame() {
  return (
    <div className="relative flex-1 min-h-[400px] w-full bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-inner border-2 border-slate-300 dark:border-slate-700">
      <img 
        alt="Classroom view" 
        className="w-full h-full object-cover" 
        src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2670&auto=format&fit=crop"
      />
      <div className="absolute inset-0 camera-overlay pointer-events-none"></div>
      
      {/* Frame Corners */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-lg opacity-80"></div>
      <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-lg opacity-80"></div>
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-lg opacity-80"></div>
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-lg opacity-80"></div>
      
      {/* Center Focus */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
        <span className="material-symbols-outlined text-white text-6xl font-thin">filter_center_focus</span>
      </div>
      
      {/* Scanning Line */}
      <div className="scan-line opacity-50"></div>
    </div>
  );
}
