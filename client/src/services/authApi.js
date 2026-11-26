const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function postJson(endpoint, body) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, networkError: true };
  }
}

export async function loginUser(email, password) {
  const { ok, data, networkError } = await postJson('/auth/login', { email, password });
  if (networkError) {
    return { success: false, message: 'Cannot connect to Spring Boot server. Ensure the backend is running on port 8080.' };
  }
  if (!ok) {
    return { success: false, message: data?.message || 'Login failed.' };
  }
  return { success: true, user: data?.user || { name: email.split('@')[0], email } };
}

export async function registerUser(fullName, email, password) {
  const { ok, data, networkError } = await postJson('/auth/register', { fullName, email, password });
  if (networkError) {
    return { success: false, message: 'Cannot connect to Spring Boot server. Ensure the backend is running on port 8080.' };
  }
  if (!ok) {
    return { success: false, message: data?.message || 'Registration failed.' };
  }
  return { success: true, user: data?.user || { name: fullName, email } };
}

export async function syncGoogleUser({ name, email, picture }) {
  const { ok, data } = await postJson('/auth/google', { name, email, picture });
  return { success: true, user: ok && data?.user ? data.user : { name, email, picture } };
}
