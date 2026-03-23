import { useState, useEffect, useCallback } from 'react';
import { getStudents as fetchStudents, registerStudent as apiRegister } from '../api/students';

export function useStudents(sectionId) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!sectionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStudents(sectionId);
      setStudents(data);
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    load();
  }, [load]);

  const register = useCallback(async (formData) => {
    const result = await apiRegister(formData);
    await load(); // refresh list
    return result;
  }, [load]);

  return { students, loading, error, reload: load, register };
}
