// src/utils/auth.ts
export function getAuthHeader() {
  const token = localStorage.getItem("accessToken"); // not "token"
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getCurrentUser() {
  // 1) Try stored user (for future, when you add it)
  const rawUser = localStorage.getItem("user");
  if (rawUser) {
    try {
      return JSON.parse(rawUser); // { id, email?, username? }
    } catch {
      // ignore and fall back to token
    }
  }

  // 2) Fallback: decode id from JWT in accessToken (issued by faruqbackend)
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const [, payloadBase64] = token.split(".");
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson); // { id, role, username, iat, exp }

    return {
      id: payload.id,
      username: payload.username ?? null,
      role: payload.role ?? null,
    };
  } catch {
    return null;
  }
}

