/**
 * Attendance API module.
 */
import { get, post, postForm, getBlob } from './client';

/**
 * Upload a classroom image for face detection.
 * @param {File} image
 * @param {number} sectionId
 */
export async function detectAttendance(image, sectionId) {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('section_id', sectionId);
  return postForm('/detect', formData);
}

/**
 * Save confirmed attendance records.
 * @param {{ section_id: number, image_path?: string, records: Array<{ student_id: number, status: string, confidence: number }> }} body
 */
export async function saveAttendance(body) {
  return post('/attendance/save', body);
}

/**
 * Get past attendance sessions.
 * @param {number|null} sectionId - optional filter
 */
export async function getSessions(sectionId = null) {
  return get('/attendance/sessions', { section_id: sectionId });
}

/**
 * Get records for a specific session.
 * @param {number} sessionId
 */
export async function getRecords(sessionId) {
  return get('/attendance/records', { session_id: sessionId });
}

/**
 * Export attendance session as CSV blob.
 * @param {number} sessionId
 */
export async function exportSessionCSV(sessionId) {
  return getBlob('/attendance/export', { session_id: sessionId, format: 'csv' });
}
