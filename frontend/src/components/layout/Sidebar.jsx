import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Code2
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../utils/cn';

export function Sidebar() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-900/50 border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent-start to-accent-end">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">CodeDoc AI</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-accent-end" : "text-slate-500 group-hover:text-slate-300"
                )} />
                {item.label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-end shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-4 mb-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white border border-white/10 overflow-hidden">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-white truncate">{user?.name}</span>
            <span className="text-xs text-slate-500 truncate">{user?.email}</span>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-error hover:bg-error/5 transition-all group"
        >
          <LogOut className="h-5 w-5 text-slate-500 group-hover:text-error/70" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
