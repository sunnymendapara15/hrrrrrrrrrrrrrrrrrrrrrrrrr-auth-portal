const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.error || 'Unexpected error');
    if (response.status === 401 || response.status === 403) {
      error.code = 'UNAUTHORIZED';
    }
    throw error;
  }
  return payload;
};

export const login = async (body) => {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseResponse(response);
};

export const signup = async (body) => {
  const response = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseResponse(response);
};

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const fetchUsers = async (token) => {
  const response = await fetch(`${API_BASE}/api/hr/users`, {
    headers: authHeaders(token),
  });
  return parseResponse(response);
};

export const createUser = async (token, body) => {
  const response = await fetch(`${API_BASE}/api/hr/users`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  return parseResponse(response);
};

export const updateUser = async (token, id, body) => {
  const response = await fetch(`${API_BASE}/api/hr/users/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  return parseResponse(response);
};

export const deleteUser = async (token, id) => {
  const response = await fetch(`${API_BASE}/api/hr/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (response.status === 204) {
    return { success: true };
  }
  return parseResponse(response);
};
