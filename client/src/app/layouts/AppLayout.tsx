import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Compass, User, LogOut, Compass as LogoIcon } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';

export default function AppLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden">
      {/* Premium background radial light source */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.06)_0,transparent_100%)] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
              <LogoIcon className="w-5 h-5" />
            </span>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-400 bg-clip-text text-transparent">
              TravelMind
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link
              to="/"
              className={`font-medium transition-colors hover:text-slate-200 flex items-center gap-1.5 ${
                location.pathname === '/' ? 'text-purple-400' : 'text-slate-400'
              }`}
            >
              <Compass className="w-4 h-4" />
              Dashboard
            </Link>

            <Link
              to="/profile"
              className={`font-medium transition-colors hover:text-slate-200 flex items-center gap-1.5 ${
                location.pathname === '/profile' ? 'text-purple-400' : 'text-slate-400'
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 transition-colors font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-10 w-full relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/20 py-6 text-center text-xs text-slate-600 font-mono relative z-10">
        TravelMind &copy; {new Date().getFullYear()} — Built with React + FastAPI + SQLite
      </footer>
    </div>
  );
}
