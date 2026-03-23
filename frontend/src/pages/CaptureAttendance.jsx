import { useState, useCallback } from 'react';
import { Camera, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSections } from '../hooks/useSections';
import { useAttendance } from '../hooks/useAttendance';
import ImageUploader from '../components/attendance/ImageUploader';
import DetectionResults from '../components/attendance/DetectionResults';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorAlert from '../components/common/ErrorAlert';

const STEPS = ['select', 'upload', 'review', 'done'];

export default function CaptureAttendance() {
  const { sections, loading: secLoading } = useSections();
  const { detect, save, detectionResult, loading, error, clearError, resetDetection } = useAttendance();

  const [step, setStep] = useState(0);
  const [sectionId, setSectionId] = useState('');
  const [image, setImage] = useState(null);
  const [records, setRecords] = useState([]);
  const [saveResult, setSaveResult] = useState(null);

  // After detection, build editable records from results + absent_students
  function buildRecords(result) {
    const recs = [];
    result.results.forEach((r) => {
      if (r.student_id) {
        recs.push({
          student_id: r.student_id,
          status: r.status === 'present' ? 'present' : 'absent',
          confidence: r.confidence,
          name: r.name,
          student_id_number: r.student_id_number,
        });
      }
    });
    result.absent_students.forEach((s) => {
      recs.push({
        student_id: s.student_id,
        status: 'absent',
        confidence: 0,
        name: s.name,
        student_id_number: s.student_id_number,
      });
    });
    return recs;
  }

  // Step 1 → Step 2
  function handleSelectSection() {
    if (!sectionId) return;
    setStep(1);
  }

  // Step 2 → Step 3 (detect)
  async function handleDetect() {
    if (!image) return;
    clearError();
    try {
      const result = await detect(image, Number(sectionId));
      setRecords(buildRecords(result));
      setStep(2);
    } catch {
      // error already set by hook
    }
  }

  // Toggle face status in the editable records
  const handleToggleFace = useCallback((face) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.student_id === face.student_id
          ? { ...r, status: r.status === 'present' ? 'absent' : 'present' }
          : r
      )
    );
  }, []);

  // Step 3 → Step 4 (confirm & save)
  async function handleConfirm() {
    clearError();
    try {
      const result = await save({
        section_id: Number(sectionId),
        records: records.map(({ student_id, status, confidence }) => ({
          student_id,
          status,
          confidence,
        })),
      });
      setSaveResult(result);
      setStep(3);
    } catch {
      // error already set by hook
    }
  }

  // Reset everything
  function handleReset() {
    setStep(0);
    setSectionId('');
    setImage(null);
    setRecords([]);
    setSaveResult(null);
    resetDetection();
    clearError();
  }

  // Build a view-ready detection result from mutable records
  function buildViewResult() {
    if (!detectionResult) return null;
    return {
      total_faces_detected: detectionResult.total_faces_detected,
      results: records.filter((r) => r.confidence > 0),
      absent_students: records.filter((r) => r.status === 'absent' && r.confidence === 0),
    };
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all appearance-none';

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-xl font-bold text-white">Capture Attendance</h1>
        <p className="text-slate-400 text-sm mt-1">
          {STEPS[step] === 'select' && 'Select a section to get started'}
          {STEPS[step] === 'upload' && 'Upload a classroom photo'}
          {STEPS[step] === 'review' && 'Review detected students'}
          {STEPS[step] === 'done' && 'Attendance saved successfully'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full flex-1 transition-all duration-500 ${
              i <= step ? 'bg-indigo-500' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {error && <ErrorAlert message={error} onDismiss={clearError} />}

      {/* Step 0: Select section */}
      {step === 0 && (
        <div className="space-y-4">
          {secLoading ? (
            <Loader text="Loading sections..." />
          ) : (
            <>
              <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} className={inputClass}>
                <option value="" className="bg-slate-900">Choose a section</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900">
                    {s.name} — {s.course_name}
                  </option>
                ))}
              </select>
              <Button onClick={handleSelectSection} disabled={!sectionId} icon={ArrowRight} className="w-full">
                Continue
              </Button>
            </>
          )}
        </div>
      )}

      {/* Step 1: Upload image */}
      {step === 1 && (
        <div className="space-y-4">
          <ImageUploader onImageSelect={setImage} label="Upload classroom photo" />
          <Button onClick={handleDetect} disabled={!image} loading={loading} icon={Camera} className="w-full">
            {loading ? 'Detecting faces...' : 'Detect Faces'}
          </Button>
        </div>
      )}

      {/* Step 2: Review detection results */}
      {step === 2 && detectionResult && (
        <div className="space-y-4">
          <DetectionResults result={buildViewResult()} onToggleFace={handleToggleFace} />

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => setStep(1)}>
              Re-upload
            </Button>
            <Button variant="success" onClick={handleConfirm} loading={loading} icon={CheckCircle2}>
              Confirm
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Done */}
      {step === 3 && saveResult && (
        <div className="text-center space-y-6 py-8">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Attendance Saved!</h2>
            <p className="text-slate-400 text-sm mt-2">
              {saveResult.present} present · {saveResult.absent} absent · {saveResult.total_students} total
            </p>
          </div>
          <Button onClick={handleReset} className="mx-auto">
            Take Another
          </Button>
        </div>
      )}
    </div>
  );
}
