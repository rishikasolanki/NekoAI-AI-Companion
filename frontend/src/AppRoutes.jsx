import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat/Chat";
import MemoryPage from "./pages/MemoryPage";
import PetWindow from "./pages/PetWindow";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Dashboard />}
        />

        <Route
          path="chat"
          element={<Chat />}
        />

        <Route
          path="memories"
          element={<MemoryPage />}
        />
      </Route>

      <Route
        path="pet"
        element={<PetWindow />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}