// src/utils/auth.ts

export function getAuthHeader() {
  const token = localStorage.getItem("token");
  // The space after 'Bearer ' is critical!
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getCurrentUser() {
  const rawUser = localStorage.getItem("user");
  if (rawUser) {
    try {
      return JSON.parse(rawUser);
    } catch {
      // ignore
    }
  }

  // Check both keys here as well
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (!token) return null;

  try {
    const [, payloadBase64] = token.split(".");
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    return {
      id: payload.id,
      username: payload.username ?? null,
      role: payload.role ?? null,
    };
  } catch {
    return null;
  }
}