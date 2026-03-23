import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Camera, UserPlus, History, Settings, ChevronLeft } from 'lucide-react';

const tabs = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/capture', icon: Camera, label: 'Capture' },
  { to: '/register', icon: UserPlus, label: 'Register' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/sections', icon: Settings, label: 'Sections' },
];

function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-md mx-auto flex items-center h-14 px-4">
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all mr-3"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-base tracking-tight">
            Smart Attendance
          </span>
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-t border-white/5 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl
              transition-all duration-200 min-w-0
              ${isActive
                ? 'text-indigo-400'
                : 'text-slate-500 hover:text-slate-300'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`
                  p-1.5 rounded-xl transition-all duration-200
                  ${isActive ? 'bg-indigo-500/15' : ''}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <TopBar />
      <main className="max-w-md mx-auto px-4 pt-6 pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
