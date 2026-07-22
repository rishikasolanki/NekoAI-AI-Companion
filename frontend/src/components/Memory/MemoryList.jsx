import MemoryCard from "./MemoryCard";
import "./MemoryList.css";

export default function MemoryList({
  memories = [],
  onDelete,
}) {
  if (!memories.length) {
    return (
      <div className="memory-list">
        <p className="empty-memory">
          🧠 No memories yet.
        </p>

        <small>
          Start saving goals, study notes, and important
          information for NekoAI.
        </small>
      </div>
    );
  }

  return (
    <div className="memory-list">
      {memories.map((memory) => (
        <MemoryCard
          key={memory.id}
          memory={memory}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}