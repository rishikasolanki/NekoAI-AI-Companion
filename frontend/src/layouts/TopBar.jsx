import { useLocation } from "react-router-dom";

const pageInformation = {
  "/": {
    title: "Dashboard",
    icon: "🏠",
  },

  "/tasks": {
    title: "Tasks",
    icon: "📋",
  },

  "/focus": {
    title: "Focus Mode",
    icon: "⚡",
  },

  "/alarms": {
    title: "Alarms",
    icon: "⏰",
  },

  "/habits": {
    title: "Habit Tracker",
    icon: "🌱",
  },

  "/chat": {
    title: "Chat",
    icon: "💬",
  },

  "/memories": {
    title: "Memories",
    icon: "🧠",
  },
};

export default function TopBar() {
  const location = useLocation();

  const currentPage =
    pageInformation[location.pathname] ||
    pageInformation["/"];

  return (
    <header className="topbar">
      <div className="topbar-title-group">
        <div className="topbar-page-icon">
          {currentPage.icon}
        </div>

        <h2>{currentPage.title}</h2>
      </div>

      <div className="topbar-status">
        <span className="topbar-status-dot" />
        <span>Neko is online</span>
      </div>
    </header>
  );
}