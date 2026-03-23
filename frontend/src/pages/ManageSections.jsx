import { useState } from 'react';
import { Plus, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useSections } from '../hooks/useSections';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';

export default function ManageSections() {
  const { sections, loading, error, createSection } = useSections();
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [name, setName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [schedule, setSchedule] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !courseName.trim()) {
      setFormError('Section name and course name are required');
      return;
    }
    setFormLoading(true);
    setFormError(null);
    try {
      const result = await createSection({
        name: name.trim(),
        course_name: courseName.trim(),
        instructor_name: instructorName.trim() || undefined,
        schedule: schedule.trim() || undefined,
      });
      setSuccess(`Section "${result.name}" created!`);
      setName('');
      setCourseName('');
      setInstructorName('');
      setSchedule('');
      setShowForm(false);
    } catch (err) {
      setFormError(err.message || 'Failed to create section');
    } finally {
      setFormLoading(false);
    }
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all';

  if (loading && sections.length === 0) return <Loader fullPage text="Loading sections..." />;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Sections</h1>
          <p className="text-slate-400 text-sm mt-1">{sections.length} sections</p>
        </div>
        <Button size="sm" icon={Plus} onClick={() => { setShowForm(!showForm); setSuccess(null); }}>
          New
        </Button>
      </div>

      {error && <ErrorAlert message={error} />}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-emerald-300 text-sm">{success}</p>
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <Card title="Create Section">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Section name (e.g. Section A)" className={inputClass} />
            <input value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Course name (e.g. Computer Science 101)" className={inputClass} />
            <input value={instructorName} onChange={(e) => setInstructorName(e.target.value)} placeholder="Instructor name (optional)" className={inputClass} />
            <input value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="Schedule (optional, e.g. MWF 9:00 AM)" className={inputClass} />
            {formError && <p className="text-rose-400 text-sm">{formError}</p>}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" loading={formLoading}>Create</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Sections List */}
      {sections.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No sections yet"
          message="Create your first section to start registering students."
          actionLabel="Create Section"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-3">
          {sections.map((s) => (
            <div
              key={s.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{s.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{s.course_name}</p>
                  {s.instructor_name && (
                    <p className="text-slate-500 text-xs mt-0.5">{s.instructor_name}</p>
                  )}
                </div>
                {s.schedule && (
                  <span className="text-slate-500 text-xs bg-white/5 px-2 py-1 rounded-md">
                    {s.schedule}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
