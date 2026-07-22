import "./MemoryCard.css";

export default function MemoryCard({
  memory,
  onDelete,
}) {
  function handleDelete() {
    if (!onDelete) return;

    const confirmed = window.confirm(
      `Delete "${memory.title}"?`
    );

    if (confirmed) {
      onDelete(memory.id);
    }
  }

  return (
    <div className="memory-card">
      <h3>{memory.title}</h3>

      <p>{memory.content}</p>

      <small>
        📂 {memory.category}
      </small>

      <button
        type="button"
        onClick={handleDelete}
      >
        🗑 Delete
      </button>
    </div>
  );
}