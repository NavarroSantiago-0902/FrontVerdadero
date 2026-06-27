const BASE = 'https://futbol-practica.onrender.com/api/v1/RealMadrid';

function getToken() {
  return localStorage.getItem('rm_token') || '';
}

async function request(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);

  if (res.status === 401) {
    localStorage.removeItem('rm_token');
    localStorage.removeItem('rm_user');
    window.location.href = '/login';
    return null;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Auth
export const authApi = {
  login: (data) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  register: (data) =>
    fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
};

// Players
export const playersApi = {
  getAll: () => request('/players'),
  create: (data) => request('/players', 'POST', data),
  update: (id, data) => request(`/players/${id}`, 'PUT', data),
  delete: (id) => request(`/players/${id}`, 'DELETE'),
};

// Trainings
export const trainingsApi = {
  getAll: () => request('/trainings'),
  create: (data) => request('/trainings', 'POST', data),
  delete: (id) => request(`/trainings/${id}`, 'DELETE'),
};

// Training Results
export const resultsApi = {
  getAll: () => request('/training-results'),
  create: (data) => request('/training-results', 'POST', data),
  delete: (id) => request(`/training-results/${id}`, 'DELETE'),
};
