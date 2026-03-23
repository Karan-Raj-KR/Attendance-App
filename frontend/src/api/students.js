/**
 * Student API module.
 */
import { get, postForm } from './client';

/**
 * Register a new student with a face photo.
 * @param {{ name: string, student_id_number: string, section_id: number, image: File }} data
 */
export async function registerStudent({ name, student_id_number, section_id, image }) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('student_id_number', student_id_number);
  formData.append('section_id', section_id);
  formData.append('image', image);
  return postForm('/students/register', formData);
}

/**
 * Get all students in a section.
 * @param {number} sectionId
 */
export async function getStudents(sectionId) {
  return get('/students', { section_id: sectionId });
}
