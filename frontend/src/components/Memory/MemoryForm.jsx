import { useState } from "react";

import "./MemoryForm.css";

export default function MemoryForm({
  onSave,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    const cleanCategory = category.trim() || "General";

    if (!cleanTitle || !cleanContent) {
      setError("Please enter both a title and content.");
      return;
    }

    if (!onSave) {
      setError("Memory saving is not available.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      await onSave({
        title: cleanTitle,
        content: cleanContent,
        category: cleanCategory,
      });

      setTitle("");
      setContent("");
      setCategory("General");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Memory could not be saved."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="memory-form"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Memory title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={120}
        required
      />

      <textarea
        placeholder="What should Neko remember?"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={2000}
        required
      />

      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="General">General</option>
        <option value="Goal">Goal</option>
        <option value="Study">Study</option>
        <option value="Project">Project</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
      </select>

      {error && (
        <p className="memory-form-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Memory"}
      </button>
    </form>
  );
}