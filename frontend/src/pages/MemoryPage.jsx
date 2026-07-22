// frontend/src/pages/MemoryPage.jsx
import { useState, useEffect } from "react";
import MemoryForm from "../components/Memory/MemoryForm";
import MemoryList from "../components/Memory/MemoryList";
import { getMemories, createMemory, deleteMemory } from "../api";

export default function MemoryPage() {
  const [memories, setMemories] = useState([]);

  // ✅ Fetch memories on load
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMemories();
        setMemories(data);
      } catch (error) {
        console.error("Failed to fetch memories:", error);
      }
    }
    fetchData();
  }, []);

  // ✅ Add new memory
  async function handleSave(memory) {
    try {
      const newMemory = await createMemory(memory);
      setMemories((prev) => [...prev, newMemory]);
    } catch (error) {
      console.error("Failed to create memory:", error);
    }
  }

  // ✅ Delete memory
  async function handleDelete(id) {
    try {
      await deleteMemory(id);
      setMemories((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Failed to delete memory:", error);
    }
  }

  return (
    <div className="memory-page">
      <h1>🧠 Memories</h1>
      <MemoryForm onSave={handleSave} />
      <MemoryList memories={memories} onDelete={handleDelete} />
    </div>
  );
}
