const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      detail = "";
    }
    throw new Error(`Request failed (${res.status}) ${detail}`);
  }

  return res.json();
}

export function getHealth() {
  return request("/health");
}

export function listJobs() {
  return request("/jobs/");
}

export function createJob(payload) {
  return request("/jobs/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function createProfile(payload) {
  return request("/profiles/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function createApplication(payload) {
  return request("/applications/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
