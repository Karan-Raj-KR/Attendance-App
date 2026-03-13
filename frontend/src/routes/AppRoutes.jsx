import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Capture from "../pages/Capture";
import Preview from "../pages/Preview";
import Review from "../pages/Review";
import Export from "../pages/Export";
import Attendance from "../pages/Attendance";

export default function AppRoutes() {
  return (
    <Routes>

      {/* login */}
      <Route path="/login" element={<Login />} />

      {/* app layout routes */}
      <Route path="/" element={<AppLayout />}>

        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="capture" element={<Capture />} />
        <Route path="preview" element={<Preview />} />
        <Route path="review" element={<Review />} />
        <Route path="export" element={<Export />} />
        <Route path="attendance" element={<Attendance />} />

      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}