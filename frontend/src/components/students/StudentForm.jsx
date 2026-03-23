import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import Button from '../common/Button';
import ImageUploader from '../attendance/ImageUploader';

export default function StudentForm({ sections, onSubmit, loading = false }) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [image, setImage] = useState(null);
  const [validationError, setValidationError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) return setValidationError('Student name is required');
    if (!studentId.trim()) return setValidationError('Student ID is required');
    if (!sectionId) return setValidationError('Please select a section');
    if (!image) return setValidationError('Please upload a face photo');

    onSubmit({
      name: name.trim(),
      student_id_number: studentId.trim(),
      section_id: Number(sectionId),
      image,
    });
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rahul Sharma"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">Student ID</label>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="e.g. S12345"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">Section</label>
        <select
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          className={`${inputClass} appearance-none`}
        >
          <option value="" className="bg-slate-900">Select a section</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id} className="bg-slate-900">
              {s.name} — {s.course_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">Face Photo</label>
        <ImageUploader onImageSelect={setImage} label="Upload student face photo" />
      </div>

      {validationError && (
        <p className="text-rose-400 text-sm">{validationError}</p>
      )}

      <Button type="submit" loading={loading} icon={UserPlus} className="w-full">
        Register Student
      </Button>
    </form>
  );
}
