import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  Users, 
  Bell, 
  RotateCcw, 
  School, 
  Sparkles, 
  LogOut, 
  LogIn,
  KeyRound,
  Database 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    isAuthenticated,
    settings, 
    setIsRoleSwitcherOpen, 
    resetToDefaultData, 
    announcements,
    currentView,
    setCurrentView,
    logout,
    openLoginPortal
  } = useSchool();

  const roleLabels: Record<string, string> = {
    admin: 'Principal / Admin',
    teacher: 'Academic Staff',
    student: 'Student Portal',
    parent: 'Parent / Guardian',
    accountant: 'Bursar / Accounts',
  };

  const roleColors: Record<string, string> = {
    admin: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    teacher: 'text-blue-700 bg-blue-50 border-blue-200',
    student: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    parent: 'text-amber-700 bg-amber-50 border-amber-200',
    accountant: 'text-purple-700 bg-purple-50 border-purple-200',
  };

  const pinnedCount = announcements.filter(a => a.isPinned).length;

  return (
    <header className="no-print h-16 border-b border-slate-200 bg-white sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
      {/* Zone 1: Single element brand title + academic session */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden">
            {settings.crestUrl ? (
              <img 
                src={settings.crestUrl} 
                alt="School Crest" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <School className="w-4 h-4 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {settings.schoolName}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-normal">
              <span>{settings.currentSession}</span>
              <span aria-hidden="true">·</span>
              <span>{settings.currentTerm}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation Links (single-line controls) */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Overview
        </button>
        <button
          onClick={() => setCurrentView('timetable')}
          className="hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Timetable
        </button>
        <button
          onClick={() => setCurrentView('notices')}
          className="hover:text-slate-900 transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <span>Notices</span>
          {pinnedCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          )}
        </button>
      </nav>

      {/* Zone 3: Primary Actions - Login Place, Role Switcher & Active Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Prominent Header Login Place */}
        <button
          onClick={() => openLoginPortal()}
          className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white bg-linear-to-r from-indigo-600 via-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:from-indigo-700 active:to-blue-700 rounded-xl shadow-xs hover:shadow-sm transition-all border border-indigo-400/30 group cursor-pointer"
          title="Go to Login Portal to log in as Staff or Student"
        >
          <LogIn className="w-4 h-4 text-indigo-200 group-hover:text-white transition-colors" />
          <span className="tracking-wide">Login</span>
          <span className="hidden sm:inline-block text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-medium">
            Staff & Student
          </span>
        </button>

        {/* Demo Roles Shortcut (available when unauthenticated for fast exploration) */}
        {!isAuthenticated && (
          <button
            onClick={() => setIsRoleSwitcherOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all text-xs font-medium text-slate-600 cursor-pointer"
            title="Instant Demo Role Access"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Demo Roles</span>
          </button>
        )}

        <button
          onClick={() => {
            if (window.confirm('Reset all demo data back to default initial state?')) {
              resetToDefaultData();
            }
          }}
          title="Reset demo data"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setCurrentView('notices')}
          className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="View Announcements"
        >
          <Bell className="w-4 h-4" />
          {pinnedCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          )}
        </button>

        {/* Role Switcher Pill/Button (shown when authenticated) */}
        {isAuthenticated && (
          <button
            onClick={() => setIsRoleSwitcherOpen(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all text-left group cursor-pointer"
            title="Quick Persona Switcher"
          >
            <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-slate-500 capitalize">
                {roleLabels[currentUser.role]}
              </p>
            </div>
            <span className="ml-1 text-slate-400 group-hover:text-slate-700 transition-colors">
              <Users className="w-3.5 h-3.5" />
            </span>
          </button>
        )}

        {/* Log Out button (shown when authenticated) */}
        {isAuthenticated && (
          <button
            onClick={() => {
              logout();
              setCurrentView('dashboard');
            }}
            title="Log out and return to default school view"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        )}
      </div>
    </header>
  );
};
