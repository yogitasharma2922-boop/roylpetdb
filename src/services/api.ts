const API_BASE_URL = "/api";

export const apiFetch = async (path: string, options: any = {}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.reload();
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error?.message || data?.error || "Request failed";
    throw new Error(message);
  }
  return data?.data ?? data;
};
