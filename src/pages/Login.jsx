import { useNavigate } from 'react-router-dom';

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
            <span className="material-symbols-outlined text-primary text-5xl">school</span>
          </div>
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold tracking-tight">Smart Attendance</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Academic Portal Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-primary/5 p-8 border border-slate-100 dark:border-slate-700 relative z-10">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Welcome Back</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Please enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-xl">mail</span>
                </div>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="block w-full pl-10 pr-3 py-2.5 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all" 
                  placeholder="name@university.edu" 
                  required 
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-xl">lock</span>
                </div>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  className="block w-full pl-10 pr-3 py-2.5 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center mt-2">
              <input 
                type="checkbox" 
                id="remember-me" 
                name="remember-me" 
                className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer" 
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer">Keep me signed in</label>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit" 
              className="mt-6 w-full flex justify-center items-center py-3 px-4 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-sm tracking-wide transition-colors shadow-lg shadow-primary/20 active:scale-[0.98]"
            >
              SIGN IN
              <span className="material-symbols-outlined ml-2 text-lg">login</span>
            </button>
          </form>

          {/* Secondary Action */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              New instructor? <a href="#" className="text-primary font-semibold hover:underline">Request access</a>
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
