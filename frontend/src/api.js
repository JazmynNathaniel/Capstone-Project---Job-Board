const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";
const TOKEN_KEY = "somedeed_token";
const ROLE_KEY = "somedeed_role";

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function setAuthRole(role) {
  if (role) {
    localStorage.setItem(ROLE_KEY, role);
  }
}

export function getAuthRole() {
  return localStorage.getItem(ROLE_KEY);
}

async function request(path, options = {}) {
  const token = getAuthToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export function updateJob(id, payload) {
  return request(`/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteJob(id) {
  return request(`/jobs/${id}`, {
    method: "DELETE"
  });
}

export function createProfile(payload) {
  return request("/profiles/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateProfile(id, payload) {
  return request(`/profiles/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteProfile(id) {
  return request(`/profiles/${id}`, {
    method: "DELETE"
  });
}

export function createApplication(payload) {
  return request("/applications/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateApplication(id, payload) {
  return request(`/applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteApplication(id) {
  return request(`/applications/${id}`, {
    method: "DELETE"
  });
}

export function listEmployers() {
  return request("/employers/");
}

export function createEmployer(payload) {
  return request("/employers/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateEmployer(id, payload) {
  return request(`/employers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteEmployer(id) {
  return request(`/employers/${id}`, {
    method: "DELETE"
  });
}

export function listProfiles() {
  return request("/profiles/");
}

export function listApplications() {
  return request("/applications/");
}

export function getMyProfile() {
  return request("/profiles/me");
}

export function createMyProfile(payload) {
  return request("/profiles/me", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateMyProfile(payload) {
  return request("/profiles/me", {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteMyProfile() {
  return request("/profiles/me", {
    method: "DELETE"
  });
}

export function registerUser(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function loginUser(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
