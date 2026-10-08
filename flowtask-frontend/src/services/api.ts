import type { Task } from "../store/taskSlice";
const API_URL = "https://flowtask-q9kj.onrender.com/api";;

// =========================
// TYPES
// =========================

interface AuthResponse {
  token: string;
}

// =========================
// HELPER
// =========================

async function parseResponse<T = unknown>(
  response: Response,
  fallbackError = "Request failed"
): Promise<T | null> {
  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        const data = await response.json();
        throw new Error(data?.message || fallbackError);
      } catch {
        throw new Error(fallbackError);
      }
    }

    const text = await response.text().catch(() => "");
    throw new Error(text || fallbackError);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  await response.text();
  return null;
}

// =========================
// AUTH
// =========================

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseResponse<AuthResponse>(
    response,
    "Invalid email or password"
  );

  if (!data) throw new Error("Invalid email or password");
  return data;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const response = await fetch(`${API_URL}/Auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  return parseResponse<{ message?: string }>(response, "Registration failed");
}

export async function logoutUser(token: string) {
  const response = await fetch(`${API_URL}/Auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  return parseResponse(response, "Logout failed");
}

// =========================
// TASKS
// =========================

export async function getTasks(token: string): Promise<Task[]> {
  const response = await fetch(`${API_URL}/Tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await parseResponse<Task[]>(response, "Failed to get tasks");
  return data ?? [];
}

export async function createTask(
  token: string,
  title: string,
  description: string
): Promise<Task> {
  const response = await fetch(`${API_URL}/Tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });

  const data = await parseResponse<Task>(response, "Failed to create task");

  if (!data) throw new Error("Failed to create task");
  return data;
}

export async function toggleTask(
  token: string,
  id: number
): Promise<Task> {
  const response = await fetch(`${API_URL}/Tasks/${id}/toggle`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await parseResponse<Task>(response, "Failed to update task");

  if (!data) throw new Error("Failed to update task");
  return data;
}

export async function deleteTask(
  token: string,
  id: number
): Promise<void> {
  const response = await fetch(`${API_URL}/Tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  await parseResponse(response, "Failed to delete task");
}