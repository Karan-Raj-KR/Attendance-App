import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import CaptureAttendance from './pages/CaptureAttendance';
import RegisterStudent from './pages/RegisterStudent';
import AttendanceHistory from './pages/AttendanceHistory';
import SessionDetail from './pages/SessionDetail';
import ManageSections from './pages/ManageSections';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/capture" element={<CaptureAttendance />} />
            <Route path="/register" element={<RegisterStudent />} />
            <Route path="/history" element={<AttendanceHistory />} />
            <Route path="/session/:sessionId" element={<SessionDetail />} />
            <Route path="/sections" element={<ManageSections />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}