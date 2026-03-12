import { useNavigate } from 'react-router-dom';
import SectionCard from '../components/SectionCard';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleTakeAttendance = (sectionId) => {
    navigate('/capture');
  };

  const sections = [
    {
      id: 1,
      color: 'bg-primary',
      icon: { name: 'terminal', bgClass: 'bg-gradient-to-br from-primary to-blue-400' },
      name: 'Section 1',
      title: 'Advanced Algorithms',
      enrolled: 45,
      time: '10:00 AM - 11:30 AM'
    },
    {
      id: 4,
      color: 'bg-indigo-500',
      icon: { name: 'database', bgClass: 'bg-gradient-to-br from-indigo-500 to-purple-400' },
      name: 'Section 4',
      title: 'Database Systems',
      enrolled: 38,
      time: '01:00 PM - 02:30 PM'
    },
    {
      id: 2,
      color: 'bg-emerald-500',
      icon: { name: 'developer_mode', bgClass: 'bg-gradient-to-br from-emerald-500 to-teal-400' },
      name: 'Section 2',
      title: 'Software Engineering',
      enrolled: 52,
      time: '03:00 PM - 04:30 PM'
    }
  ];

  return (
    <div className="w-full max-w-xl mx-auto p-4 pb-24">
      {/* Top Header Row (Simulating the sticky header conceptually but positioned normally) */}
      <header className="flex items-center justify-between mb-6 pt-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">school</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight">Smart Attendance</h1>
        </div>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      {/* Greeting Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome, Professor Miller</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Ready for your morning sessions?</p>
      </section>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Today's Classes</p>
          <p className="text-2xl font-bold mt-1">4</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Students</p>
          <p className="text-2xl font-bold mt-1">182</p>
        </div>
      </div>

      {/* Active Sections List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">Your Active Sections</h3>
          <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wide">
            Live Now
          </span>
        </div>

        <div className="gap-4 flex flex-col">
          {sections.map(section => (
            <SectionCard 
              key={section.id} 
              {...section} 
              onAction={() => handleTakeAttendance(section.id)} 
            />
          ))}
        </div>
      </section>
    </div>
  );
}
