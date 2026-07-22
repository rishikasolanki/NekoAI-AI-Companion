export async function getDashboardStats() {
  const res = await fetch("http://127.0.0.1:8000/analytics/dashboard");
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }
  return res.json();
}
