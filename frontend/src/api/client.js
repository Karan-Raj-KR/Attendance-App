/**
 * Centralized API client for the Smart Attendance frontend.
 * All API requests flow through these helpers.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // response body wasn't JSON
    }
    const message = errorData?.detail || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, errorData);
  }
  // handle empty responses (204, etc.)
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/**
 * GET request
 */
export async function get(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString());
  return handleResponse(response);
}

/**
 * POST request with JSON body
 */
export async function post(path, body = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

/**
 * POST request with FormData (file uploads)
 */
export async function postForm(path, formData) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse(response);
}

/**
 * GET request that returns a Blob (for CSV export etc.)
 */
export async function getBlob(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new ApiError('Download failed', response.status);
  }
  return response.blob();
}

export { ApiError };
