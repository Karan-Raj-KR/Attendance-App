import { useState, useCallback } from 'react';
import {
  detectAttendance as apiDetect,
  saveAttendance as apiSave,
  getSessions as apiSessions,
  getRecords as apiRecords,
  exportSessionCSV as apiExport,
} from '../api/attendance';

export function useAttendance() {
  const [detectionResult, setDetectionResult] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const detect = useCallback(async (image, sectionId) => {
    setLoading(true);
    setError(null);
    setDetectionResult(null);
    try {
      const data = await apiDetect(image, sectionId);
      setDetectionResult(data);
      return data;
    } catch (err) {
      setError(err.message || 'Detection failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (body) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiSave(body);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to save attendance');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSessions = useCallback(async (sectionId = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiSessions(sectionId);
      setSessions(data);
    } catch (err) {
      setError(err.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRecords = useCallback(async (sessionId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRecords(sessionId);
      setRecords(data);
    } catch (err) {
      setError(err.message || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  }, []);

  const exportCSV = useCallback(async (sessionId) => {
    try {
      const blob = await apiExport(sessionId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_session_${sessionId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Export failed');
    }
  }, []);

  const resetDetection = useCallback(() => {
    setDetectionResult(null);
  }, []);

  return {
    detectionResult,
    sessions,
    records,
    loading,
    error,
    clearError,
    detect,
    save,
    loadSessions,
    loadRecords,
    exportCSV,
    resetDetection,
  };
}
