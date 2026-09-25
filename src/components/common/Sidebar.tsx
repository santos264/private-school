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
  Building2
} from 'lucide-react';

interface NavItem {
  id: NavigationModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { currentUser, currentView, setCurrentView, setIsRoleSwitcherOpen } = useSchool();

  // Role-filtered navigation items
  const getNavItems = (): NavItem[] => {
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
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">Current Role</span>
          <button 
            onClick={() => setIsRoleSwitcherOpen(true)}
            className="text-indigo-600 hover:text-indigo-800 font-medium text-[11px]"
          >
            Switch
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-sm font-semibold text-slate-800 capitalize truncate">
            {currentUser.role === 'admin' ? 'Administrator' : currentUser.role}
          </span>
        </div>
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
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
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
