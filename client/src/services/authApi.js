const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function sendJson(endpoint, body, method = 'POST') {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
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
  const { ok, data, networkError } = await sendJson('/auth/login', { email, password });
  if (networkError) {
    return { success: false, message: 'Cannot connect to server. Ensure Spring Boot is running on port 8080.' };
  }
  if (!ok) {
    return { success: false, message: data?.message || 'Login failed.' };
  }
  return { success: true, user: data?.user || { name: email.split('@')[0], email } };
}

export async function registerUser(fullName, email, password) {
  const { ok, data, networkError } = await sendJson('/auth/register', { fullName, email, password });
  if (networkError) {
    return { success: false, message: 'Cannot connect to server. Ensure Spring Boot is running on port 8080.' };
  }
  if (!ok) {
    return { success: false, message: data?.message || 'Registration failed.' };
  }
  return { success: true, user: data?.user || { name: fullName, email } };
}

export async function syncGoogleUser({ name, email, picture }) {
  const { ok, data } = await sendJson('/auth/google', { name, email, picture });
  return {
    success: true,
    user: ok && data?.user ? data.user : { name, email, picture },
  };
}

export async function updateUserProfile(profile) {
  const { ok, data, networkError } = await sendJson('/auth/profile', profile, 'PUT');
  if (networkError) {
    return { success: false, offline: true, message: 'Saved locally (server offline).' };
  }
  if (!ok) {
    return { success: false, message: data?.message || 'Failed to update profile in database.' };
  }
  return { success: true, user: data?.user, message: 'Saved' };
}

export function triggerGoogleSignIn({ clientId, onLoading, onError, onSuccess }) {
  if (!clientId) {
    onError('Google Client ID not configured. Please check your .env file.');
    return;
  }
  if (!window.google?.accounts?.oauth2) {
    onError('Google Identity Services not loaded. Please verify your connection.');
    return;
  }

  onLoading?.(true);

  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'email profile openid',
      callback: async (tokenResponse) => {
        onLoading?.(false);
        if (tokenResponse.error) {
          onError(`Google Sign-In failed: ${tokenResponse.error}`);
          return;
        }
        try {
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          });
          if (!res.ok) throw new Error('Failed to retrieve profile');
          const profile = await res.json();
          if (profile.email && profile.email_verified !== false) {
            const googleUserData = {
              name: profile.name || profile.email.split('@')[0],
              email: profile.email.trim().toLowerCase(),
              picture: profile.picture || '',
            };
            const syncRes = await syncGoogleUser(googleUserData);
            onSuccess(syncRes.user || googleUserData);
          } else {
            onError('Please use a verified Google account with a valid email.');
          }
        } catch {
          onError('Failed to fetch profile details from Google.');
        }
      },
    });
    tokenClient.requestAccessToken({ prompt: 'select_account' });
  } catch (err) {
    onLoading?.(false);
    onError(err.message || 'Error initializing Google authentication.');
  }
}
