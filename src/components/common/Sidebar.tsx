import React from 'react';
import { useSchool, NavigationModule } from '../../context/SchoolContext';
import {
  LayoutDashboard,
  GraduationCap,
  Users2,
  BookOpen,
  CalendarCheck2,
  Award,
  FileText,
  CreditCard,
  Clock,
  Megaphone,
  School,
  ChevronRight,
  LogOut,
  LogIn,
  Building2,
  Database
} from 'lucide-react';

interface NavItem {
  id: NavigationModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { 
    currentUser, 
    isAuthenticated,
    currentView, 
    setCurrentView, 
    setIsRoleSwitcherOpen, 
    logout,
    openLoginPortal 
  } = useSchool();

  // Role-filtered navigation items
  const getNavItems = (): NavItem[] => {
    if (!isAuthenticated) {
      return [
        { id: 'dashboard', label: 'School Overview', icon: LayoutDashboard },
        { id: 'classes', label: 'Curriculum & Classes', icon: BookOpen },
        { id: 'timetable', label: 'School Timetable', icon: Clock },
        { id: 'notices', label: 'Announcements & News', icon: Megaphone },
      ];
    }

    switch (currentUser.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
          { id: 'students', label: 'Student Admissions', icon: GraduationCap },
          { id: 'teachers', label: 'Academic Staff', icon: Users2 },
          { id: 'classes', label: 'Classes & Subjects', icon: BookOpen },
          { id: 'attendance', label: 'Attendance Register', icon: CalendarCheck2 },
          { id: 'results', label: 'Examinations & Scores', icon: Award },
          { id: 'report-cards', label: 'Terminal Report Cards', icon: FileText },
          { id: 'fees', label: 'School Fees & Bursary', icon: CreditCard },
          { id: 'timetable', label: 'Master Timetable', icon: Clock },
          { id: 'notices', label: 'Announcements', icon: Megaphone },
          { id: 'database', label: 'Database & Records', icon: Database },
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Teacher Portal', icon: LayoutDashboard },
          { id: 'attendance', label: 'Daily Attendance', icon: CalendarCheck2 },
          { id: 'results', label: 'Continuous Assessment & Scores', icon: Award },
          { id: 'report-cards', label: 'Class Report Cards', icon: FileText },
          { id: 'students', label: 'Class Students', icon: GraduationCap },
          { id: 'timetable', label: 'Teaching Schedule', icon: Clock },
          { id: 'notices', label: 'School Notices', icon: Megaphone },
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
          { id: 'results', label: 'Academic Results', icon: Award },
          { id: 'report-cards', label: 'Terminal Report Card', icon: FileText },
          { id: 'attendance', label: 'My Attendance', icon: CalendarCheck2 },
          { id: 'timetable', label: 'Weekly Timetable', icon: Clock },
          { id: 'fees', label: 'Fee Clearance Status', icon: CreditCard },
          { id: 'notices', label: 'Notice Board', icon: Megaphone },
        ];
      case 'parent':
        return [
          { id: 'dashboard', label: 'Parent Portal', icon: LayoutDashboard },
          { id: 'report-cards', label: 'Ward Report Card', icon: FileText },
          { id: 'results', label: 'Assessment Scores', icon: Award },
          { id: 'attendance', label: 'Attendance Records', icon: CalendarCheck2 },
          { id: 'fees', label: 'School Fees & Receipts', icon: CreditCard },
          { id: 'timetable', label: 'Class Schedule', icon: Clock },
          { id: 'notices', label: 'School Circulars', icon: Megaphone },
        ];
      case 'accountant':
        return [
          { id: 'dashboard', label: 'Bursary Overview', icon: LayoutDashboard },
          { id: 'fees', label: 'Student Fee Ledgers', icon: CreditCard },
          { id: 'students', label: 'Student Directory', icon: GraduationCap },
          { id: 'notices', label: 'Financial Notices', icon: Megaphone },
        ];
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="no-print w-64 border-r border-slate-200 bg-white flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Role Indicator Bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        {isAuthenticated ? (
          <>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">Active Profile</span>
              <button 
                onClick={() => setIsRoleSwitcherOpen(true)}
                className="text-indigo-600 hover:text-indigo-800 font-semibold text-[11px] cursor-pointer"
              >
                Switch
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-bold text-slate-800 capitalize truncate">
                {currentUser.role === 'admin' ? 'Administrator' : currentUser.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">{currentUser.name}</p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">College Portal</span>
              <button 
                onClick={() => openLoginPortal()}
                className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <span>Login</span>
                <LogIn className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className="text-sm font-bold text-slate-800 truncate">
                Public School Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">St. Gregory Memorial College</p>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="p-3 flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {isActive ? (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Login Portal Access (Always accessible) */}
      <div className="p-3 border-t border-slate-100 bg-indigo-50/40">
        <button
          onClick={() => openLoginPortal()}
          className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-xs group cursor-pointer"
          title="Open Login Portal for Staff & Students"
        >
          <div className="flex items-center gap-2.5">
            <LogIn className="w-4 h-4 text-indigo-200 group-hover:text-white transition-colors" />
            <span>Staff & Student Login</span>
          </div>
          <span className="text-[10px] bg-indigo-500 text-indigo-100 px-1.5 py-0.5 rounded font-medium">
            Portal
          </span>
        </button>
      </div>

      {/* Logout / Exit Portal Action (shown when logged in) */}
      {isAuthenticated && (
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => {
              logout();
              setCurrentView('dashboard');
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50/80 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200/80 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Log Out & Return</span>
            </div>
            <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded font-medium">
              Exit
            </span>
          </button>
        </div>
      )}

      {/* School Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="text-xs text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Secondary SMS v2.6</span>
          </div>
          <p className="text-[11px] text-slate-400">
            MVC Architecture · Role-Based Access
          </p>
        </div>
      </div>
    </aside>
  );
};
