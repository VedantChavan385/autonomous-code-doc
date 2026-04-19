import React from 'react';
import { Search, LogOut, Code2 } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export function Header() {
  const { searchQuery, setSearchQuery } = useProjectStore();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-[72px] border-b-2 border-[#1a1a1a] bg-white sticky top-0 z-20 flex px-6 items-center justify-between shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-yellow border-2 border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a]">
            <Code2 className="h-5 w-5 text-[#1a1a1a]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-[#1a1a1a] tracking-tight leading-none">codebase.docs</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Docs / Write / Themselves</span>
          </div>
        </Link>
        <div className="hidden md:block relative w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-2 border-[#1a1a1a] rounded-xl pl-10 pr-4 py-2 text-sm font-medium text-[#1a1a1a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
          <Link 
            to="/dashboard" 
            className={cn("transition-colors pb-1 border-b-2", location.pathname === '/dashboard' ? 'text-[#1a1a1a] border-[#1a1a1a]' : 'text-slate-500 border-transparent hover:text-[#1a1a1a]')}
          >
            Home
          </Link>
          <Link 
            to="/settings" 
            className={cn("transition-colors pb-1 border-b-2", location.pathname === '/settings' ? 'text-[#1a1a1a] border-[#1a1a1a]' : 'text-slate-500 border-transparent hover:text-[#1a1a1a]')}
          >
            Settings
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <div className="h-8 px-3 rounded-full bg-accent-start border-2 border-[#1a1a1a] flex items-center justify-center font-bold text-[10px] uppercase tracking-wider text-[#1a1a1a] shadow-[1px_1px_0_#1a1a1a]">
            <div className="h-2 w-2 rounded-full bg-[#1a1a1a] mr-2" />
            Rag Powered
          </div>
          
          <button onClick={handleLogout} className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-transparent hover:border-[#1a1a1a] hover:bg-slate-100 text-slate-500 hover:text-error transition-all" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
