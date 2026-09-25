/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { RoleSwitcherModal } from './components/common/RoleSwitcherModal';
import { ReportCardModal } from './components/modules/ReportCardModal';
import { ReceiptModal } from './components/modules/ReceiptModal';

// Dashboards
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { AccountantDashboard } from './components/dashboard/AccountantDashboard';

// Functional Modules
import { StudentsModule } from './components/modules/StudentsModule';
import { TeachersModule } from './components/modules/TeachersModule';
import { ClassesSubjectsModule } from './components/modules/ClassesSubjectsModule';
import { AttendanceModule } from './components/modules/AttendanceModule';
import { ResultsModule } from './components/modules/ResultsModule';
import { ReportCardsModule } from './components/modules/ReportCardsModule';
import { FeesModule } from './components/modules/FeesModule';
import { TimetableModule } from './components/modules/TimetableModule';
import { NoticesModule } from './components/modules/NoticesModule';

import { Menu, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView, currentUser } = useSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderDashboardByRole = () => {
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'parent':
        return <ParentDashboard />;
      case 'accountant':
        return <AccountantDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboardByRole();
      case 'students':
        return <StudentsModule />;
      case 'teachers':
        return <TeachersModule />;
      case 'classes':
        return <ClassesSubjectsModule />;
      case 'attendance':
        return <AttendanceModule />;
      case 'results':
        return <ResultsModule />;
      case 'report-cards':
        return <ReportCardsModule />;
      case 'fees':
        return <FeesModule />;
      case 'timetable':
        return <TimetableModule />;
      case 'notices':
        return <NoticesModule />;
      default:
        return renderDashboardByRole();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar Header */}
      <Header />

      {/* Mobile Toggle Button */}
      <div className="no-print md:hidden flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-1.5 rounded-lg border border-slate-200"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{mobileMenuOpen ? 'Close Navigation' : 'Menu Navigation'}</span>
        </button>
        <span className="text-xs text-slate-400 capitalize font-medium">
          {currentUser.role} portal
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Sidebar Mobile Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div 
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-50 bg-white w-64 h-full shadow-xl">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Application Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Interactive Modals */}
      <ReportCardModal />
      <ReceiptModal />
      <RoleSwitcherModal />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainContent />
    </SchoolProvider>
  );
}
