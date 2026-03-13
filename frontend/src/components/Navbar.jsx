import { NavLink } from 'react-router-dom';
import { Home, Camera, ClipboardCheck, Download } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-card-dark/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 px-4 pb-safe-area shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pt-3 pb-6 w-full">
      <div className="flex justify-around items-center max-w-xl mx-auto">
        <NavItem to="/dashboard" icon={Home} label="Dashboard" />
        <NavItem to="/capture" icon={Camera} label="Capture" activeStyle="fill" />
        <NavItem to="/review" icon={ClipboardCheck} label="Review" />
        <NavItem to="/export" icon={Download} label="Export" />
      </div>
    </nav>
  );
}

function NavItem({ to, icon, label, activeStyle }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex flex-col items-center gap-1.5 group transition-colors ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary/70'}`
      }
    >
      {({ isActive }) => {
        const IconComponent = icon;
        return (
          <>
            <IconComponent 
              className={`w-6 h-6 transition-transform group-active:scale-95 ${isActive && activeStyle === 'fill' ? 'fill-current' : ''}`} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={`text-[10px] tracking-wide ${isActive ? 'font-semibold' : 'font-medium'}`}>
              {label}
            </span>
          </>
        );
      }}
    </NavLink>
  );
}
