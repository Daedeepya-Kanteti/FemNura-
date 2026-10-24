import React from "react";
import { Routes, Route } from "react-router-dom";
import { DemoDataProvider } from "./context/DemoDataContext.jsx";
import Landing from "./pages/Landing.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SymptomTracker from "./pages/SymptomTracker.jsx";
import MoodTracker from "./pages/MoodTracker.jsx";
import Reminders from "./pages/Reminders.jsx";
import Timeline from "./pages/Timeline.jsx";
import DoctorQGen from "./pages/DoctorQGen.jsx";
import CycleTracker from "./pages/CycleTracker.jsx";
import Vault from "./pages/Vault.jsx";
import Education from "./pages/Education.jsx";
import CareCircle from "./pages/CareCircle.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <DemoDataProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/start" element={<Onboarding />} />
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="symptoms" element={<SymptomTracker />} />
          <Route path="mood" element={<MoodTracker />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="doctor-qgen" element={<DoctorQGen />} />
          <Route path="cycle" element={<CycleTracker />} />
          <Route path="vault" element={<Vault />} />
          <Route path="education" element={<Education />} />
          <Route path="care-circle" element={<CareCircle />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DemoDataProvider>
  );
}
