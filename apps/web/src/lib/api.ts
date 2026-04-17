const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type TokenStore = {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
};

const tokens: TokenStore = {
  accessToken: null,
  refreshToken: null,
  userId: null,
};

export function setTokens(access: string, refresh: string, userId: string) {
  tokens.accessToken = access;
  tokens.refreshToken = refresh;
  tokens.userId = userId;
  // Persist refresh token + userId for session recovery
  localStorage.setItem('tervlon_refresh', refresh);
  localStorage.setItem('tervlon_user_id', userId);
}

export function clearTokens() {
  tokens.accessToken = null;
  tokens.refreshToken = null;
  tokens.userId = null;
  localStorage.removeItem('tervlon_refresh');
  localStorage.removeItem('tervlon_user_id');
}

export function getAccessToken() {
  return tokens.accessToken;
}

export function getSavedRefresh(): { refreshToken: string; userId: string } | null {
  const refreshToken = localStorage.getItem('tervlon_refresh');
  const userId = localStorage.getItem('tervlon_user_id');
  if (refreshToken && userId) return { refreshToken, userId };
  return null;
}

async function refreshAccessToken(): Promise<boolean> {
  const saved = getSavedRefresh();
  if (!saved) return false;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saved),
    });

    if (!res.ok) {
      clearTokens();
      return false;
    }

    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken, saved.userId);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

export async function api(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (tokens.accessToken) {
    headers['Authorization'] = `Bearer ${tokens.accessToken}`;
  }

  let res = await fetch(`${API_URL}${path}`, { ...options, headers });

  // If 401, try refreshing the token and retry once
  if (res.status === 401 && tokens.refreshToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      res = await fetch(`${API_URL}${path}`, { ...options, headers });
    }
  }

  return res;
}