import { useState, useEffect, useCallback } from 'react';
import { getSections as fetchSections, createSection as apiCreateSection } from '../api/sections';
import { useAppContext } from '../context/AppContext';

export function useSections() {
  const { sections, setSections, refreshKey } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSections();
      setSections(data);
    } catch (err) {
      setError(err.message || 'Failed to load sections');
    } finally {
      setLoading(false);
    }
  }, [setSections]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const createSection = useCallback(async (body) => {
    const result = await apiCreateSection(body);
    await load(); // refresh list
    return result;
  }, [load]);

  return { sections, loading, error, reload: load, createSection };
}
