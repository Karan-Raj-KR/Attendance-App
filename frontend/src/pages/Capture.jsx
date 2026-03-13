import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Image as ImageIcon, Camera, RefreshCw, Aperture, Upload } from 'lucide-react';
import CameraFrame from '../components/CameraFrame';

export default function Capture() {
  const navigate = useNavigate();

  const handleCapture = () => {
    setTimeout(() => {
      navigate('/preview');
    }, 600); // Simulate processing delay
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="flex items-center bg-white/90 dark:bg-card-dark/90 backdrop-blur-md px-4 py-4 border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-20 w-full">
        <button 
          onClick={() => navigate(-1)}
          className="text-slate-900 dark:text-slate-100 p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center -ml-2 active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={2} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center pr-8 tracking-tight">Attendance Capture</h1>
      </header>

      <main className="flex-1 flex flex-col w-full p-4 gap-6 pb-24">
        {/* Instruction Card */}
        <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-2xl border border-primary/20 flex items-start gap-4 flex-shrink-0">
          <Info className="text-primary mt-0.5 w-6 h-6 shrink-0" strokeWidth={2} />
          <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
             Capture the classroom clearly so all student faces are visible. Ensure good lighting for better recognition.
          </p>
        </div>

        {/* Camera Viewport Area */}
        <CameraFrame />

        {/* Action Controls */}
        <div className="flex flex-col gap-6 mt-auto pt-4 flex-shrink-0">
          <div className="flex items-center justify-center gap-10 mb-4">
            <button className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.4)] flex items-center justify-center text-slate-600 dark:text-slate-400 group-active:scale-95 transition-all">
                <ImageIcon className="w-6 h-6" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold tracking-wide text-slate-500">Gallery</span>
            </button>
            
            <button 
              onClick={handleCapture}
              className="w-22 h-22 rounded-full bg-primary text-white shadow-[0_8px_25px_rgba(37,99,235,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline outline-4 outline-primary/20"
            >
              <Camera className="w-10 h-10" strokeWidth={1.5} />
            </button>
            
            <button className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.4)] flex items-center justify-center text-slate-600 dark:text-slate-400 group-active:scale-95 transition-all">
                <RefreshCw className="w-6 h-6" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold tracking-wide text-slate-500">Flip</span>
            </button>
          </div>

          <div className="flex flex-col gap-3.5">
            <button 
              onClick={handleCapture}
              className="w-full h-[3.75rem] bg-primary text-white rounded-2xl font-bold text-[17px] flex items-center justify-center gap-2.5 hover:bg-primary/90 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.25)] active:scale-[0.98]"
            >
              <Aperture className="w-5 h-5" strokeWidth={2.5} />
              Take Photo
            </button>
            
            <button className="w-full h-[3.75rem] bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl font-bold text-[17px] flex items-center justify-center gap-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-[0.98]">
              <Upload className="w-5 h-5" strokeWidth={2.5} />
              Upload Photo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
