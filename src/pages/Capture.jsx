import { useNavigate } from 'react-router-dom';
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
      <header className="flex items-center bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 w-full">
        <button 
          onClick={() => navigate(-1)}
          className="text-slate-900 dark:text-slate-100 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined block">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold flex-1 text-center pr-10">Attendance Capture</h1>
      </header>

      <main className="flex-1 flex flex-col w-full p-4 gap-6 pb-24">
        {/* Instruction Card */}
        <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-xl border border-primary/20 flex items-start gap-3 flex-shrink-0">
          <span className="material-symbols-outlined text-primary mt-0.5">info</span>
          <p className="text-sm font-medium leading-relaxed">
             Capture the classroom clearly so all student faces are visible. Ensure good lighting for better recognition.
          </p>
        </div>

        {/* Camera Viewport Area */}
        <CameraFrame />

        {/* Action Controls */}
        <div className="flex flex-col gap-4 mt-auto pt-4 flex-shrink-0">
          <div className="flex items-center justify-center gap-8 mb-4">
            <button className="flex flex-col items-center gap-1 group">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-slate-600 dark:text-slate-400 group-active:scale-95 transition-transform">
                <span className="material-symbols-outlined">image</span>
              </div>
              <span className="text-xs font-semibold">Gallery</span>
            </button>
            
            <button 
              onClick={handleCapture}
              className="w-20 h-20 rounded-full bg-primary text-white shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-4xl">photo_camera</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 group">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-slate-600 dark:text-slate-400 group-active:scale-95 transition-transform">
                <span className="material-symbols-outlined">refresh</span>
              </div>
              <span className="text-xs font-semibold">Flip</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleCapture}
              className="w-full h-14 bg-primary text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">capture</span>
              Take Photo
            </button>
            
            <button className="w-full h-14 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors active:scale-[0.98]">
              <span className="material-symbols-outlined">upload</span>
              Upload Photo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
