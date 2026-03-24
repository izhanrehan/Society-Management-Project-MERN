import React from "react";
import { Routes, Route } from "react-router-dom";
import "./assets/css/global.css"; 

// Authentication Guard
import ProtectedRoute from "./components/ProtecteRoute"; // 👈 Spell check karein 'ProtectedRoute' vs 'ProtecteRoute'

// Public Pages
import Landing from "./pages/Landing";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import RegistrationForm from "./pages/RegistrationForm";
import Societies from "./pages/societies"; // ✅ Folder structure ke mutabiq small s
import SocietiesDetail from "./pages/SocietiesDetail"; 

// Admin Panel Pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AddEditEvent from "./pages/admin/AddEditEvent";
import ManageEvents from "./pages/admin/ManageEvents";
import Profile from "./pages/admin/Profile";
import TrackAttendees from "./pages/admin/TrackAttendees";

function App() {
  return (
    <Routes>
      {/* 🌐 Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/events" element={<Events />} />
      <Route path="/event-detail/:id" element={<EventDetail />} />
      <Route path="/registration-form" element={<RegistrationForm />} />
      <Route path="/societies" element={<Societies />} />
      <Route path="/society-detail/:id" element={<SocietiesDetail />} />

      {/* 🔒 Admin Panel Routes (Protected) */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/add-edit-event"
        element={
          <ProtectedRoute>
            <AddEditEvent />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/add-edit-event/:id"
        element={
          <ProtectedRoute>
            <AddEditEvent />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/manage-events"
        element={
          <ProtectedRoute>
            <ManageEvents />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/track-attendees"
        element={
          <ProtectedRoute>
            <TrackAttendees />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;