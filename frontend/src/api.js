// src/api.js

const API = "http://127.0.0.1:8000";

// 🐱 Chat API
export async function sendMessage(text) {
  const response = await fetch(`${API}/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text }),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.detail || "Unable to get an AI response.");
  return payload;
}

// 🧠 Memory APIs
export async function getMemories() {
  const response = await fetch(`${API}/memories/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch memories");
  }

  return await response.json(); // backend returns array of memories
}

export async function createMemory(memory) {
  const response = await fetch("http://127.0.0.1:8000/memories/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(memory),
  });

  if (!response.ok) {
    throw new Error("Failed to create memory");
  }

  return await response.json();
}
export async function deleteMemory(id) {
  const response = await fetch(`${API}/memories/${id}/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to delete memory");
  }

  return true; // deletion successful
}
