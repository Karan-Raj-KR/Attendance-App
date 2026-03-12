import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, GraduationCap } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-md">
        
        {/* Header / Logo Section */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <GraduationCap className="w-12 h-12 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold tracking-tight">Smart Attendance</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Academic Portal Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-card-dark rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-8 relative z-10">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Welcome Back</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Please enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" strokeWidth={2} />
                </div>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="block w-full pl-11 pr-3 py-3.5 bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary/20 outline-none rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all font-medium" 
                  placeholder="name@university.edu" 
                  required 
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400" strokeWidth={2} />
                </div>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  className="block w-full pl-11 pr-3 py-3.5 bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary/20 outline-none rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all font-medium" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center mt-3">
              <input 
                type="checkbox" 
                id="remember-me" 
                name="remember-me" 
                className="h-4.5 w-4.5 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer transition-all" 
              />
              <label htmlFor="remember-me" className="ml-2.5 block text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer">Keep me signed in</label>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit" 
              className="mt-8 w-full flex justify-center items-center py-4 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-base tracking-wide transition-all shadow-[0_8px_16px_rgba(37,99,235,0.2)] dark:shadow-[0_8px_16px_rgba(37,99,235,0.1)] active:scale-[0.98]"
            >
              Sign In
              <LogIn className="ml-2 w-5 h-5" strokeWidth={2.5} />
            </button>
          </form>

          {/* Secondary Action */}
          <div className="mt-8 pt-6 border-t border-slate-100/50 dark:border-slate-800/50 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              New instructor? <a href="#" className="text-primary font-bold hover:text-primary/80 transition-colors">Request access</a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center relative z-10">
          <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-medium">
            Version 2.0 • Security Encrypted
          </p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
