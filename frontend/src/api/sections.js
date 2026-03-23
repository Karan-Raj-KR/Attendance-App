/**
 * Section API module.
 */
import { get, post } from './client';

/**
 * Get all sections.
 */
export async function getSections() {
  return get('/students/sections');
}

/**
 * Create a new section.
 * @param {{ name: string, course_name: string, instructor_name?: string, schedule?: string }} body
 */
export async function createSection(body) {
  return post('/students/sections', body);
}
