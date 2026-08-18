import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import Dashboard from "./pages/dashboard/Dashboard";
import Templates from "./pages/templates/Templates";
import Team from "./pages/team/Team";
import Alumni from "./pages/alumni/Alumni";
import Notices from "./pages/notices/Notices";
import Events from "./pages/events/Events";
import EventDetail from "./pages/events/EventDetail";
import Landing from "./pages/public/Landing";
import Alerts from "./pages/alerts/Alerts";
import AdminManagement from "./pages/admin/AdminManagement";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/alerts"
        element={
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/events/:id"
        element={
          <ProtectedRoute>
            <EventDetail />
          </ProtectedRoute>
        }
      />
<Route
  path="/dashboard/admin"
  element={<AdminManagement />}
/>
      <Route
        path="/dashboard/events"
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/notices"
        element={
          <ProtectedRoute>
            <Notices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/alumni"
        element={
          <ProtectedRoute>
            <Alumni />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/team"
        element={
          <ProtectedRoute>
            <Team />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/templates"
        element={
          <ProtectedRoute>
            <Templates />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}