import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';

// Mock imports for pages (will create these next)
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Capture from '../pages/Capture';
import Preview from '../pages/Preview';
import Review from '../pages/Review';
import Export from '../pages/Export';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      
      {/* Routes that share the common bottom navigation layout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/review" element={<Review />} />
        <Route path="/export" element={<Export />} />
      </Route>
    </Routes>
  );
}
