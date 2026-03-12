import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AppLayout() {
  return (
    <div className="flex-1 flex flex-col w-full h-full">
      <div className="flex-1 overflow-y-auto w-full relative">
        <Outlet />
      </div>
      {<Navbar />}
    </div>
  );
}