import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Upload, ScanFace, CheckCircle2, 
  AlertCircle, User, Percent, Loader2, 
  ImagePlus, X, Save
} from 'lucide-react';
import { detectFaces, saveAttendance } from '../services/api';

export default function Attendance() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // State
  const [sectionId, setSectionId] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResults(null);
    setError(null);
    setSaved(false);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setResults(null);
    setError(null);
    setSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Call /detect API
  const handleDetect = async () => {
    if (!imageFile) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await detectFaces(imageFile, sectionId);
      setResults(data);
    } catch (err) {
      setError('Failed to detect faces. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Save attendance
  const handleSave = async () => {
    if (!results) return;

    setSaving(true);
    setError(null);

    try {
      const payload = {
        section_id: sectionId,
        image_path: imageFile?.name || 'uploaded_image.jpg',
        records: results.results.map((r) => ({
          student_id: r.student_id,
          status: r.status,
          confidence: r.confidence,
        })),
      };

      // Add absent students as records too
      if (results.absent_students) {
        results.absent_students.forEach((s) => {
          payload.records.push({
            student_id: s.student_id,
            status: 'absent',
            confidence: 0.0,
          });
        });
      }

      await saveAttendance(payload);
      setSaved(true);
    } catch (err) {
      setError('Failed to save attendance. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const presentCount = results?.results?.filter(r => r.status === 'present').length || 0;
  const absentCount = results?.absent_students?.length || 0;
  const totalFaces = results?.total_faces_detected || 0;

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-x-hidden">
      
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-card-dark/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4 flex items-center justify-between w-full">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors -ml-2 active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-slate-100" strokeWidth={2} />
        </button>
        <h1 className="text-xl font-bold tracking-tight">Attendance</h1>
        <div className="w-11" />
      </header>

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col w-full p-4 gap-5 pb-36 overflow-y-auto">

        {/* Section Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Section
          </label>
          <select
            value={sectionId}
            onChange={(e) => setSectionId(Number(e.target.value))}
            className="w-full h-14 px-4 rounded-2xl bg-white dark:bg-card-dark border border-slate-200/50 dark:border-slate-800/50 shadow-[0_2px_10px_rgb(0,0,0,0.03)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)] text-[15px] font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
          >
            <option value={1}>Section A</option>
            <option value={2}>Section B</option>
            <option value={3}>Section C</option>
          </select>
        </div>

        {/* Image Upload Area */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Classroom Photo
          </label>

          {!imagePreview ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-card-dark flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-[0.98] cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <ImagePlus className="w-7 h-7 text-primary" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Tap to upload photo</p>
                <p className="text-xs text-slate-400 mt-0.5">JPG, PNG supported</p>
              </div>
            </button>
          ) : (
            <div className="relative rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <img 
                src={imagePreview} 
                alt="Captured classroom" 
                className="w-full h-56 object-cover" 
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors active:scale-95"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
              {results && (
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-bold">
                  {totalFaces} faces detected
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* Detect Button */}
        {imageFile && !results && (
          <button
            onClick={handleDetect}
            disabled={loading}
            className="w-full h-[3.75rem] bg-primary text-white rounded-2xl font-bold text-[17px] flex items-center justify-center gap-2.5 hover:bg-primary/90 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.25)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                Detecting Faces...
              </>
            ) : (
              <>
                <ScanFace className="w-5 h-5" strokeWidth={2.5} />
                Detect Students
              </>
            )}
          </button>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/50 dark:border-rose-500/20">
            <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" strokeWidth={2} />
            <p className="text-sm font-medium text-rose-700 dark:text-rose-400">{error}</p>
          </div>
        )}

        {/* ── Results ────────────────────────────────────────────── */}
        {results && (
          <div className="flex flex-col gap-5">
            
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center p-4 rounded-2xl bg-white dark:bg-card-dark shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">{totalFaces}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Detected</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-2xl bg-white dark:bg-card-dark shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">{presentCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/70 mt-1">Present</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-2xl bg-white dark:bg-card-dark shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <p className="text-3xl font-bold text-rose-600 dark:text-rose-400 tracking-tight">{absentCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500/70 mt-1">Absent</p>
              </div>
            </div>

            {/* Detected Students List */}
            {results.results.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Detected Students
                </h2>
                <div className="rounded-2xl overflow-hidden bg-white dark:bg-card-dark shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                  {results.results.map((student, index) => (
                    <div 
                      key={student.student_id || index}
                      className={`flex items-center justify-between px-4 py-4 ${
                        index < results.results.length - 1 ? 'border-b border-slate-100 dark:border-slate-800/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            {student.name || 'Unknown'}
                          </p>
                          <p className="text-xs font-medium text-slate-400">
                            {student.student_id_number || `ID: ${student.student_id}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                          <Percent className="w-3 h-3 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {(student.confidence * 100).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Absent Students List */}
            {results.absent_students && results.absent_students.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Absent Students
                </h2>
                <div className="rounded-2xl overflow-hidden bg-white dark:bg-card-dark shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                  {results.absent_students.map((student, index) => (
                    <div 
                      key={student.student_id || index}
                      className={`flex items-center justify-between px-4 py-4 ${
                        index < results.absent_students.length - 1 ? 'border-b border-slate-100 dark:border-slate-800/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/15 flex items-center justify-center">
                          <User className="w-5 h-5 text-rose-600 dark:text-rose-400" strokeWidth={2} />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            {student.name}
                          </p>
                          <p className="text-xs font-medium text-slate-400">
                            {student.student_id_number || `ID: ${student.student_id}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-full">
                        Absent
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Bottom Action Bar ───────────────────────────────────── */}
      {results && !saved && (
        <div className="fixed bottom-0 left-0 right-0 z-30">
          <div className="max-w-md mx-auto px-4 pb-8 pt-4 bg-gradient-to-t from-white via-white dark:from-background-dark dark:via-background-dark">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-[3.75rem] bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-[17px] flex items-center justify-center gap-2.5 transition-all shadow-[0_8px_25px_rgba(16,185,129,0.35)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" strokeWidth={2.5} />
                  Confirm & Save Attendance
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {saved && (
        <div className="fixed bottom-0 left-0 right-0 z-30">
          <div className="max-w-md mx-auto px-4 pb-8 pt-4 bg-gradient-to-t from-white via-white dark:from-background-dark dark:via-background-dark">
            <div className="w-full h-[3.75rem] bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl font-bold text-[17px] flex items-center justify-center gap-2.5">
              <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
              Attendance Saved Successfully
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
