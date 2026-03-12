import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 pb-safe-area shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pt-2 pb-6 w-full">
      <div className="flex justify-around items-center max-w-xl mx-auto">
        <NavItem to="/dashboard" icon="home" label="Dashboard" />
        <NavItem to="/capture" icon="photo_camera" label="Capture" activeStyle="fill" />
        <NavItem to="/review" icon="fact_check" label="Review" />
        <NavItem to="/export" icon="file_export" label="Export" />
      </div>
    </nav>
  );
}

function NavItem({ to, icon, label, activeStyle }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex flex-col items-center gap-1 group transition-colors ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`
      }
    >
      {({ isActive }) => (
        <>
          <span 
            className="material-symbols-outlined text-[24px]" 
            style={isActive && activeStyle === 'fill' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            {icon}
          </span>
          <span className={`text-[10px] uppercase tracking-wider ${isActive ? 'font-bold' : 'font-medium'}`}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}
