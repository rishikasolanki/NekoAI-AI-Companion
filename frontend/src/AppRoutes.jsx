import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Focus from "./pages/Focus";
import Alarm from "./pages/Alarm";
import AlarmRing from "./pages/AlarmRing";
import Habits from "./pages/Habits";
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
          path="tasks"
          element={<Tasks />}
        />

        <Route
          path="focus"
          element={<Focus />}
        />

        <Route
          path="alarms"
          element={<Alarm />}
        />

        <Route
          path="habits"
          element={<Habits />}
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
        path="alarm-ring"
        element={<AlarmRing />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}