import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "../pages/Splash/Splash.jsx";
import Login from "../pages/Login/Login.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Tasks from "../pages/Tasks/Tasks.jsx";
import Pet from "../pages/Pet/Pet.jsx";
import Chat from "../pages/Chat/Chat.jsx";
import Statistics from "../pages/Statistics/Statistics.jsx";
import Settings from "C:/Users/solan/OneDrive/Desktop/NekoAI/NekoAI-AI-Companion/frontend/src/pages/Settings/Settings.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/pet" element={<Pet />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;