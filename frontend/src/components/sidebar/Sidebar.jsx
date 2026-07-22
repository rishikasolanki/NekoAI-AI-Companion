import { NavLink } from "react-router-dom";

import "./Sidebar.css";

const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: "🏠",
  },
  {
    name: "Memories",
    path: "/memories",
    icon: "🧠",
  },
  {
    name: "Chat",
    path: "/chat",
    icon: "💬",
  },
  {
    name: "Pet",
    path: "/pet",
    icon: "🐱",
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">
        🐱 NekoAI
      </h2>

      <nav>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/"}
          >
            <span>{item.icon}</span>

            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}