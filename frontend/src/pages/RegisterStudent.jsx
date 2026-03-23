import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useSections } from '../hooks/useSections';
import { useStudents } from '../hooks/useStudents';
import StudentForm from '../components/students/StudentForm';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import ErrorAlert from '../components/common/ErrorAlert';

export default function RegisterStudent() {
  const { sections, loading: secLoading } = useSections();
  const { register } = useStudents(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(data) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await register(data);
      setSuccess(`${result.name} registered successfully!`);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  if (secLoading) return <Loader fullPage text="Loading sections..." />;

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-xl font-bold text-white">Register Student</h1>
        <p className="text-slate-400 text-sm mt-1">Add a new student with their face photo</p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-emerald-300 text-sm">{success}</p>
        </div>
      )}

      <Card>
        <StudentForm sections={sections} onSubmit={handleSubmit} loading={loading} />
      </Card>
    </div>
  );
}
