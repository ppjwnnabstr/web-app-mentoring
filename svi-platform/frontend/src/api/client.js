const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const TOKEN_KEY = "svi_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

/**
 * Thin fetch wrapper used by every api/*.js module.
 *   request("/matches/mine/")
 *   request("/requests/", { method: "POST", body: { mentor_id: 3 } })
 */
export async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Token ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. some error pages) — fall through with data = null
  }

  if (!res.ok) {
    const message =
      (data && (data.detail || (Array.isArray(data) ? data[0] : JSON.stringify(data)))) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}
