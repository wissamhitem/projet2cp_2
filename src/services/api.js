/**
 * Arcio Clinical Portal — API Service Layer
 * 
 * Centralized API client for communicating with the Django backend.
 * All API calls go through this module so the base URL and auth headers
 * are managed in one place.
 * 
 * Usage:
 *   import api from '@/services/api';
 *   const patients = await api.patients.list();
 */

// ── Configuration ──────────────────────────────────────────────
// In development Vite proxies /api → Django (see vite.config.js).
// In production the React build is served by Django, so same origin.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// ── Helper: get CSRF token from cookie (Django sets this) ──────
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

// ── Core fetch wrapper ─────────────────────────────────────────
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken'),
    ...options.headers,
  };

  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Remove Content-Type for FormData (browser sets boundary automatically)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const config = {
    ...options,
    headers,
    credentials: 'same-origin', // send cookies to Django
  };

  const response = await fetch(url, config);

  // Handle 204 No Content
  if (response.status === 204) return null;

  // Parse JSON or throw
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.detail || data?.message || `API Error ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ── HTTP method shortcuts ──────────────────────────────────────
const get    = (endpoint)        => request(endpoint, { method: 'GET' });
const post   = (endpoint, body)  => request(endpoint, { method: 'POST', body: JSON.stringify(body) });
const put    = (endpoint, body)  => request(endpoint, { method: 'PUT',  body: JSON.stringify(body) });
const patch  = (endpoint, body)  => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
const del    = (endpoint)        => request(endpoint, { method: 'DELETE' });

// For file uploads (e.g. patient photos, documents)
const upload = (endpoint, formData) =>
  request(endpoint, { method: 'POST', body: formData });

// ── Resource APIs ──────────────────────────────────────────────
// Each key maps to a Django REST endpoint. When your Django backend
// is ready, these will work out of the box.

const api = {
  // ── Auth ──
  auth: {
    login:    (credentials) => post('/login/', credentials),
    logout:   ()            => post('/logout/'),
    me:       ()            => get('/my-profile/'),
  },

  // ── Patients ──
  patients: {
    list:     ()           => get('/patients/'),
    get:      (id)         => get(`/patients/${id}/`),
    create:   (data)       => post('/patients/create/', data),
    update:   (id, data)   => put(`/patients/${id}/update/`, data),
    delete:   (id)         => del(`/patients/${id}/delete/`),
  },

  // ── Doctors ──
  doctors: {
    listPublic: () => get('/doctors/public/'),
    list:     ()           => get('/doctors/'),
    get:      (id)         => get(`/doctors/${id}/`),
    create:   (data)       => post('/doctors/create/', data),
    update:   (id, data)   => put(`/doctors/${id}/update/`, data),
    delete:   (id)         => del(`/doctors/${id}/delete/`),
  },

  // ── Appointments ──
  appointments: {
    list:     ()           => get('/appointments/'),
    get:      (id)         => get(`/appointments/${id}/`),
    create:   (data)       => post('/appointments/create/', data),
    update:   (id, data)   => put(`/appointments/${id}/update/`, data),
    delete:   (id)         => del(`/appointments/${id}/delete/`),
  },

  // ── Services ──
  services: {
    listPublic: () => get('/services/public/'),
    list:     ()           => get('/services/'),
    get:      (id)         => get(`/services/${id}/`),
    create:   (data)       => post('/services/create/', data),
    update:   (id, data)   => put(`/services/${id}/update/`, data),
    delete:   (id)         => del(`/services/${id}/delete/`),
  },

  // ── Departments ──
  departments: {
    list:     ()           => get('/departments/'),
    get:      (id)         => get(`/departments/${id}/`),
    create:   (data)       => post('/departments/', data),
    update:   (id, data)   => patch(`/departments/${id}/`, data),
    delete:   (id)         => del(`/departments/${id}/`),
  },

  // ── Announcements ──
    announcements: {
    list:     ()           => get('/announcements/'),
    get:      (id)         => get(`/announcements/${id}/`),
    create:   (data)       => post('/announcements/create/', data),
    update:   (id, data)   => put(`/announcements/${id}/update/`, data),
    delete:   (id)         => del(`/announcements/${id}/delete/`),
    },

  // ── Schedules ──
    schedules: {
    list:     ()           => get('/schedules/'),
    get:      (id)         => get(`/schedules/${id}/`),
    create:   (data)       => post('/schedules/create/', data),
    update:   (id, data)   => put(`/schedules/${id}/update/`, data),
    delete:   (id)         => del(`/schedules/${id}/delete/`),
    },

  // ── Analytics ──
  analytics: {
    dashboard:  ()         => get('/dashboard/'),
    reports:    (params)   => get(`/dashboard/`),
  },

  // ── Documents / Files ──
  documents: {
    list:     ()           => get('/documents/'),
    upload:   (formData)   => upload('/documents/upload/', formData),
    download: (id)         => `${BASE_URL}/documents/${id}/download/`,
  },

  // ── Notifications ──
  notifications: {
    list:     ()           => get('/notifications/'),
    markRead: (id)         => patch(`/notifications/${id}/`, { is_read: true }),
    markAll:  ()           => post('/notifications/mark-all-read/'),
  },
};


export default api;
