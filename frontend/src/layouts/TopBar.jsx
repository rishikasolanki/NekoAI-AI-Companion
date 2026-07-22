import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Dashboard",
  "/chat": "Chat",
  "/memories": "Memories",
};

export default function TopBar() {
  const location = useLocation();

  const pageTitle =
    pageTitles[location.pathname] || "NekoAI";

  return (
    <header className="topbar">
      <div>
        <p className="topbar-label">
          PERSONAL WORKSPACE
        </p>

        <h2>{pageTitle}</h2>
      </div>

      <div className="topbar-status">
        <span className="topbar-status-dot" />

        <span>Neko is online</span>
      </div>
    </header>
  );
}