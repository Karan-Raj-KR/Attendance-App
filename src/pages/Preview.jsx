import { useNavigate } from 'react-router-dom';
import FaceBoundingBox from '../components/FaceBoundingBox';
import DetectionSummary from '../components/DetectionSummary';

export default function Preview() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 justify-between sticky top-0 z-10 w-full">
        <button 
          onClick={() => navigate(-1)}
          className="text-slate-900 dark:text-slate-100 flex h-10 w-10 items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center justify-center flex-1">
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">Attendance Preview</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Class 10-A • Physics Lab</p>
        </div>
        <div className="flex w-10 items-center justify-end">
          <button 
            onClick={() => navigate('/review')}
            className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined">check</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Camera Preview Area */}
        <div className="relative w-full aspect-[4/3] bg-slate-200 dark:bg-slate-800 overflow-hidden">
          {/* Simulated Classroom Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544252655-bfa36dbfb9ac?q=80&w=2670&auto=format&fit=crop')" }}
          >
            {/* Mock Bounding Boxes */}
            <FaceBoundingBox top="25%" left="20%" width="24%" height="32%" status="present" name="Marcus Thorne" />
            <FaceBoundingBox top="30%" left="60%" width="20%" height="27%" status="present" name="Elena Rodriguez" />
            <FaceBoundingBox top="15%" left="45%" width="18%" height="24%" status="uncertain" name="Unknown?" />
            <FaceBoundingBox top="45%" left="10%" width="22%" height="30%" status="present" name="Sarah Chen" />
          </div>

          {/* Overlay Scan Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-1/4 w-full animate-pulse top-1/2"></div>
        </div>

        {/* Scan Indicators (Overlaying the image slightly) */}
        <div className="relative -mt-12 left-0 right-0 p-4 flex justify-between items-end z-10 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-[pulse_1s_infinite]"></div>
            <span className="text-white text-[10px] font-medium tracking-wider uppercase">Live Analysis</span>
          </div>
          <div className="flex flex-col items-end gap-1 bg-black/40 p-2 rounded-lg backdrop-blur-md">
            <div className="text-white/90 text-[10px] font-medium">98% Confidence</div>
            <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
               <div className="bg-primary h-full w-[98%]"></div>
            </div>
          </div>
        </div>

        {/* Detection Statistics */}
        <div className="px-4 pt-4 pb-20">
          <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">analytics</span>
            Detection Summary
          </h3>
          
          <DetectionSummary found={24} total={28} uncertain={2} />

          <div className="flex justify-between items-center mb-3">
             <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight">Recent Matches</h3>
             <button 
                onClick={() => navigate('/review')}
                className="text-primary text-sm font-semibold hover:underline"
             >
                Review All
             </button>
          </div>
          
          <div className="space-y-2">
            {/* Match Row 1 */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
              <div 
                className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center overflow-hidden border border-slate-200 dark:border-slate-700" 
                style={{ backgroundImage: "url('https://api.dicebear.com/7.x/notionists/svg?seed=Marcus')" }}
              ></div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Marcus Thorne</p>
                <p className="text-[10px] text-slate-500">Confidence: 0.99</p>
              </div>
              <div className="text-emerald-500 bg-emerald-500/10 p-1 rounded-full flex">
                <span className="material-symbols-outlined text-lg">verified</span>
              </div>
            </div>

            {/* Match Row 2 */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
              <div 
                className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center overflow-hidden border border-slate-200 dark:border-slate-700" 
                style={{ backgroundImage: "url('https://api.dicebear.com/7.x/notionists/svg?seed=Elena')" }}
              ></div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Elena Rodriguez</p>
                <p className="text-[10px] text-slate-500">Confidence: 0.96</p>
              </div>
              <div className="text-emerald-500 bg-emerald-500/10 p-1 rounded-full flex">
                <span className="material-symbols-outlined text-lg">verified</span>
              </div>
            </div>

            {/* Uncertain Row */}
            <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-200 dark:border-amber-900/30">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-amber-600">
                <span className="material-symbols-outlined">person_search</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-700 dark:text-amber-500">Partial Match - ID 890</p>
                <p className="text-[10px] text-amber-600/70">Requires Manual Review</p>
              </div>
              <div className="text-amber-500 flex gap-2">
                <button 
                  onClick={() => navigate('/review')}
                  className="hover:bg-amber-500/20 p-1.5 rounded transition-colors flex bg-amber-500/10"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
