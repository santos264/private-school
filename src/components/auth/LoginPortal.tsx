import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { DEMO_USERS } from '../../data/initialData';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  GraduationCap,
  Users2,
  UserCheck,
  WalletCards,
  KeyRound,
  ArrowRight,
  School,
  Lock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Info,
  ArrowLeft
} from 'lucide-react';

export const LoginPortal: React.FC = () => {
  const { settings, loginAsUser, loginWithCredentials, adminInviteCodes, setCurrentView, targetAuthRole } = useSchool();
  
  const [selectedRole, setSelectedRole] = useState<UserRole>(targetAuthRole || 'student');
  const [identifier, setIdentifier] = useState('SMS/2024/042');
  const [passwordOrCode, setPasswordOrCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showInviteGuide, setShowInviteGuide] = useState(false);

  React.useEffect(() => {
    if (targetAuthRole) {
      setSelectedRole(targetAuthRole);
      const conf = roleConfig[targetAuthRole];
      if (conf) {
        setIdentifier(conf.defaultId);
        setPasswordOrCode(conf.defaultPass);
      }
    }
  }, [targetAuthRole]);

  // Role metadata definitions
  const roleConfig: Record<UserRole, {
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    idPlaceholder: string;
    idLabel: string;
    passLabel: string;
    passPlaceholder: string;
    defaultId: string;
    defaultPass: string;
    accentColor: string;
  }> = {
    student: {
      label: 'Student Portal',
      description: 'Access terminal report card, assessment marks, timetable & attendance',
      icon: GraduationCap,
      idLabel: 'Admission Number or Full Name',
      idPlaceholder: 'e.g. SMS/2024/042 or Chidinma Eze',
      passLabel: 'Access Passcode (Optional for demo)',
      passPlaceholder: '••••••••',
      defaultId: 'SMS/2024/042',
      defaultPass: 'student123',
      accentColor: 'indigo',
    },
    parent: {
      label: 'Parent / Guardian Portal',
      description: 'Track your ward’s report card, check attendance, and pay school fees',
      icon: UserCheck,
      idLabel: 'Ward Admission No, Parent Phone or Email',
      idPlaceholder: 'e.g. SMS/2024/042 or 08039123456 or Chief Eze',
      passLabel: 'PIN / Passcode',
      passPlaceholder: '••••••••',
      defaultId: 'SMS/2024/042',
      defaultPass: 'parent123',
      accentColor: 'amber',
    },
    teacher: {
      label: 'Academic Staff / Teacher',
      description: 'Take daily class roll call, enter CA & Exam scores, view teaching timetable',
      icon: Users2,
      idLabel: 'Staff ID or Institutional Email',
      idPlaceholder: 'e.g. STF/2021/014 or d.adeleke@stgregorycollege.edu.ng',
      passLabel: 'Staff Security Password',
      passPlaceholder: '••••••••',
      defaultId: 'STF/2021/014',
      defaultPass: 'teacher123',
      accentColor: 'blue',
    },
    admin: {
      label: 'Administrator Portal',
      description: 'Chief Administrator login or Join with Admin Verification Invite Code',
      icon: ShieldCheck,
      idLabel: 'Administrator Email or Name',
      idPlaceholder: 'e.g. principal@stgregorycollege.edu.ng or vice.principal@...',
      passLabel: 'Admin Password OR Chief Admin Invite Code',
      passPlaceholder: 'e.g. CHIEF2026 or ADMIN-CHIEF-2026-X9',
      defaultId: 'principal@stgregorycollege.edu.ng',
      defaultPass: 'CHIEF2026',
      accentColor: 'rose',
    },
    accountant: {
      label: 'Bursary / Accountant',
      description: 'Manage school fees ledgers, process payments and generate official receipts',
      icon: WalletCards,
      idLabel: 'Bursary Account ID or Email',
      idPlaceholder: 'e.g. bursar@stgregorycollege.edu.ng',
      passLabel: 'Bursary Security PIN',
      passPlaceholder: '••••••••',
      defaultId: 'bursar@stgregorycollege.edu.ng',
      defaultPass: 'bursar123',
      accentColor: 'purple',
    },
  };

  const currentConfig = roleConfig[selectedRole];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setIdentifier(roleConfig[role].defaultId);
    setPasswordOrCode(roleConfig[role].defaultPass);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your identification credential.');
      return;
    }

    const result = loginWithCredentials(selectedRole, identifier, passwordOrCode);
    if (result.success) {
      setSuccessMessage(result.message);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleOneClickPersona = (demoUser: typeof DEMO_USERS[0]) => {
    loginAsUser(demoUser);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Header / Branding Bar */}
      <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 shrink-0 shadow-sm">
            <img 
              src={settings.crestUrl} 
              alt={settings.schoolName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
              {settings.schoolName}
            </h1>
            <p className="text-xs text-slate-400">
              Secondary School Centralized Management & Academic Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl transition-all shadow-xs"
            title="Return back to the main School Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span>Return to School Dashboard</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span>{settings.currentSession}</span>
            <span>·</span>
            <span>{settings.currentTerm}</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Hero Context & Instant 1-Click Access */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Role-Based Authentication Gateway
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Secure Portals for School Community
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Log in to your authorized secondary school workspace. Chief Administrators can invite and verify new administrators using generated invite keys.
              </p>
            </div>

            {/* Quick 1-Click Persona Login Cards */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                  Instant Demo Persona Logins
                </span>
                <span className="text-[10px] text-slate-500 font-mono">1-Click Auth</span>
              </div>

              <div className="space-y-2">
                {DEMO_USERS.map((user) => {
                  const Icon = roleConfig[user.role]?.icon || School;
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleOneClickPersona(user)}
                      className="w-full p-2.5 rounded-xl border border-slate-700/60 hover:border-indigo-500/50 bg-slate-800/80 hover:bg-slate-750 transition-all flex items-center justify-between text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatarUrl} 
                          alt={user.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {user.name}
                            </span>
                            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                              {user.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {user.title}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chief Admin Code Notice Box */}
            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/50 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                <KeyRound className="w-4 h-4" />
                <span>Chief Admin Invite System</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Dr. Patricia Okon (Chief Admin) has generated verification codes for appointed administrators to join:
              </p>
              <div className="pt-1 flex flex-wrap gap-1.5 font-mono text-[10px]">
                {adminInviteCodes.filter(c => !c.used).slice(0, 2).map((code) => (
                  <span 
                    key={code.code}
                    onClick={() => {
                      setSelectedRole('admin');
                      setIdentifier('Vice.Principal');
                      setPasswordOrCode(code.code);
                    }}
                    className="cursor-pointer px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 hover:bg-indigo-900 transition-colors"
                    title="Click to fill into Admin login"
                  >
                    {code.code}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Role-Based Login Form */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Role Tab Selector */}
            <div className="bg-slate-100 p-2 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(['student', 'parent', 'teacher', 'admin'] as UserRole[]).map((role) => {
                const isSelected = selectedRole === role;
                const Icon = roleConfig[role].icon;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="capitalize">{role === 'teacher' ? 'Staff' : role}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Header Info */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {selectedRole.toUpperCase()} LOGIN
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {currentConfig.label}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {currentConfig.description}
                </p>
              </div>

              {/* Status Alert Banner */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-start gap-2 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form Input Fields */}
              <form onSubmit={handleFormLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    {currentConfig.idLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={currentConfig.idPlaceholder}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white"
                  />
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                    <span>Demo preset ready</span>
                    {selectedRole === 'student' && (
                      <button 
                        type="button" 
                        onClick={() => setIdentifier('SMS/2024/042')}
                        className="text-indigo-600 hover:underline"
                      >
                        Use Chidinma Eze (SS3)
                      </button>
                    )}
                    {selectedRole === 'teacher' && (
                      <button 
                        type="button" 
                        onClick={() => setIdentifier('STF/2021/014')}
                        className="text-indigo-600 hover:underline"
                      >
                        Use Mr. Adeleke (Physics Master)
                      </button>
                    )}
                    {selectedRole === 'parent' && (
                      <button 
                        type="button" 
                        onClick={() => setIdentifier('SMS/2024/042')}
                        className="text-indigo-600 hover:underline"
                      >
                        Use Ward: SMS/2024/042
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5 flex items-center justify-between">
                    <span>{currentConfig.passLabel}</span>
                    {selectedRole === 'admin' && (
                      <span className="text-[10px] text-rose-600 font-normal">
                        Chief Pass or Invite Code
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={passwordOrCode}
                      onChange={(e) => setPasswordOrCode(e.target.value)}
                      placeholder={currentConfig.passPlaceholder}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>

                  {selectedRole === 'admin' && (
                    <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-800">
                        Admin Authentication Modes:
                      </p>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                        <li><strong>Chief Admin Password:</strong> <code className="bg-slate-200 px-1 py-0.2 rounded font-mono text-slate-800">CHIEF2026</code> (Dr. Patricia Okon)</li>
                        <li><strong>Join with Invite Code:</strong> <code className="bg-slate-200 px-1 py-0.2 rounded font-mono text-slate-800">{adminInviteCodes[0]?.code}</code></li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Enter {currentConfig.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Bursar link */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Looking for Accounts / Bursary Portal?</span>
                <button
                  onClick={() => handleRoleSelect('accountant')}
                  className="font-semibold text-purple-700 hover:underline"
                >
                  Bursar Login →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-800 py-3 px-6 text-center text-xs text-slate-500">
        <p>
          {settings.schoolName} · MVC Architecture Secondary School Management System · Authorized Personnel Only
        </p>
      </div>
    </div>
  );
};
