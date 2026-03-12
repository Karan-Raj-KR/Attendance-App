import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Search, CheckCircle2 } from 'lucide-react';
import StudentRow from '../components/StudentRow';

export default function Review() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock student data
  const students = [
    { id: '102945', name: 'David Chen', status: 'uncertain', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=David' },
    { id: '102938', name: 'Alex Johnson', status: 'present', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex' },
    { id: '102952', name: 'Elena Rodriguez', status: 'present', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Elena' },
    { id: '102960', name: 'Marcus Wright', status: 'present', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Marcus' },
    { id: '102941', name: 'Sarah Miller', status: 'absent', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah' },
  ];

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.id.includes(searchQuery)
  );

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-white dark:bg-slate-900 shadow-xl overflow-hidden relative">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center bg-white/80 dark:bg-card-dark/80 backdrop-blur-xl px-4 py-4 border-b border-slate-200/50 dark:border-slate-800/50 justify-between w-full">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 p-2.5 rounded-full transition-colors flex items-center justify-center -ml-2 active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <div>
            <h2 className="text-xl font-bold leading-tight tracking-tight">Review Attendance</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Computer Science - Section A</p>
          </div>
        </div>
        <button className="flex items-center justify-center p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-primary active:scale-95 transition-all">
          <Calendar className="w-5 h-5" strokeWidth={2} />
        </button>
      </header>

      {/* Attendance Overview */}
      <div className="px-4 py-4 bg-primary/5 dark:bg-primary/10 border-b border-primary/10">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Oct 25, 2023</h3>
          <span className="text-xs font-bold text-primary">42 Students Total</span>
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-emerald-600">38</span>
            <span className="text-[10px] font-bold uppercase text-slate-400">Present</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-rose-500">2</span>
            <span className="text-[10px] font-bold uppercase text-slate-400">Absent</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-amber-500">2</span>
            <span className="text-[10px] font-bold uppercase text-slate-400">Uncertain</span>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Search Bar */}
        <div className="px-4 py-3 sticky top-[73px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl z-10">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800/80 border-none rounded-xl py-3 pl-11 pr-4 text-[15px] font-medium focus:ring-2 focus:ring-primary/40 transition-all outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500" 
              placeholder="Search student name or ID..." 
            />
          </div>
        </div>

        {/* Student Cards */}
        <div className="flex flex-col">
          {filteredStudents.map(student => (
            <StudentRow 
              key={student.id} 
              student={student} 
              onEdit={() => console.log('Edit student', student.id)} 
            />
          ))}
          
          {filteredStudents.length === 0 && (
             <div className="p-8 text-center text-slate-500">
                No students found matching "{searchQuery}"
             </div>
          )}
        </div>
      </main>

      {/* Sticky Bottom Action Button */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-4 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 pt-8 z-30">
        <button 
          onClick={() => navigate('/export')}
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-[0_8px_25px_rgba(37,99,235,0.35)] flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all"
        >
          <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
          <span className="text-[17px]">Confirm Attendance</span>
        </button>
      </div>
    </div>
  );
}
