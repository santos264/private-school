import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { DEMO_USERS } from '../../data/initialData';
import { UserRole } from '../../types';
import { X, Check, ShieldCheck, GraduationCap, Users2, UserCheck, WalletCards } from 'lucide-react';

export const RoleSwitcherModal: React.FC = () => {
  const { isRoleSwitcherOpen, setIsRoleSwitcherOpen, currentUser, setCurrentUser, setCurrentView } = useSchool();

  if (!isRoleSwitcherOpen) return null;

  const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
    admin: ShieldCheck,
    teacher: Users2,
    student: GraduationCap,
    parent: UserCheck,
    accountant: WalletCards,
  };

  const handleSelectUser = (user: typeof DEMO_USERS[0]) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
    setIsRoleSwitcherOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Role-Based Access Switcher
            </h3>
            <p className="text-xs text-slate-500">
              Switch persona to test distinct role-based permissions and dashboards
            </p>
          </div>
          <button
            onClick={() => setIsRoleSwitcherOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Persona List */}
        <div className="p-4 space-y-2.5 max-h-[70vh] overflow-y-auto">
          {DEMO_USERS.map((user) => {
            const isSelected = currentUser.id === user.id;
            const Icon = roleIcons[user.role];

            return (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-xs border border-slate-200">
                      <Icon className="w-3 h-3 text-slate-700" />
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {user.name}
                      </h4>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {user.title}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 group-hover:text-indigo-600 transition-colors">
                      Switch →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>5 Core Roles Configured</span>
          <span>Security & Session Verified</span>
        </div>
      </div>
    </div>
  );
};
