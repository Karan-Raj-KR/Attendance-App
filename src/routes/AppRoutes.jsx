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

      <Route index element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/" element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="capture" element={<Capture />} />
        <Route path="preview" element={<Preview />} />
        <Route path="review" element={<Review />} />
        <Route path="export" element={<Export />} />
        <Route path="attendance" element={<Attendance />} />
      </Route>

    </Routes>
  );
}