import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  GraduationCap,
  Users2,
  BookOpen,
  CalendarCheck2,
  CreditCard,
  Award,
  ArrowUpRight,
  TrendingUp,
  Megaphone,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  KeyRound,
  ShieldAlert,
  Copy,
  Check,
  Send,
  Trash2,
  ShieldCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser,
    students, 
    teachers, 
    classes, 
    attendance, 
    fees, 
    settings, 
    setCurrentView, 
    openReportCard,
    announcements,
    adminInviteCodes,
    generateAdminInviteCode,
    revokeAdminInviteCode
  } = useSchool();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newCodeNote, setNewCodeNote] = useState('');
  const [newCodeRole, setNewCodeRole] = useState<'admin'>('admin');
  const [newCodeSuccess, setNewCodeSuccess] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const generated = generateAdminInviteCode(
      newCodeNote.trim() || 'New Administrative Officer Invitation',
      newCodeRole,
      30
    );
    setNewCodeSuccess(generated.code);
    setNewCodeNote('');
  };

  // Metrics
  const totalStudents = students.filter(s => s.status === 'active').length;
  const maleStudents = students.filter(s => s.status === 'active' && s.gender === 'Male').length;
  const femaleStudents = students.filter(s => s.status === 'active' && s.gender === 'Female').length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;

  // Attendance stats
  const totalAttendanceRecords = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = totalAttendanceRecords > 0 
    ? Math.round((presentCount / totalAttendanceRecords) * 100) 
    : 96;

  // Fees stats
  const totalExpectedRevenue = fees.reduce((acc, f) => acc + f.totalBill, 0);
  const totalCollectedRevenue = fees.reduce((acc, f) => acc + f.amountPaid, 0);
  const totalOutstanding = fees.reduce((acc, f) => acc + f.balanceDue, 0);
  const feeCollectionRate = totalExpectedRevenue > 0 
    ? Math.round((totalCollectedRevenue / totalExpectedRevenue) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-medium mb-3">
            <span>Executive Administration Console</span>
            <span aria-hidden="true">·</span>
            <span>{settings.currentSession}</span>
            <span aria-hidden="true">·</span>
            <span>{settings.currentTerm}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {settings.principalName}
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Secondary school operations are operating smoothly. You have {totalStudents} active students enrolled across {totalClasses} classes with a {attendanceRate}% term attendance average.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => setCurrentView('students')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Enroll New Student</span>
            </button>
            <button
              onClick={() => setCurrentView('results')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Compute Results & Ranks</span>
            </button>
            <button
              onClick={() => setCurrentView('attendance')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Take Daily Attendance</span>
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              title="Chief Admin Verification Code Generator"
            >
              <KeyRound className="w-4 h-4" />
              <span>Chief Admin: Issue Admin Code</span>
            </button>
          </div>
        </div>

        {/* Decorative campus backdrop overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 hidden md:block">
          <img
            src={settings.bannerUrl}
            alt="School Campus"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Primary KPI Grid (High density, tabular nums) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Enrollment
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalStudents}
            </span>
            <span className="text-xs text-slate-500">enrolled</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span>{maleStudents} Boys</span>
            <span aria-hidden="true">·</span>
            <span>{femaleStudents} Girls</span>
          </div>
        </div>

        {/* Academic Staff */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Academic Teachers
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalTeachers}
            </span>
            <span className="text-xs text-slate-500">instructors</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span>Across 11 Subjects</span>
            <span aria-hidden="true">·</span>
            <span>100% Certified</span>
          </div>
        </div>

        {/* Term Attendance Rate */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Attendance Average
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {attendanceRate}%
            </span>
            <span className="text-xs text-emerald-600 font-medium">Optimal</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span>{presentCount} Marked Present</span>
            <span aria-hidden="true">·</span>
            <span>Roll Call active</span>
          </div>
        </div>

        {/* School Fees Revenue */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fees Collected
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {feeCollectionRate}%
            </span>
            <span className="text-xs text-slate-500">collection rate</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-mono">
            <span>₦{totalCollectedRevenue.toLocaleString()}</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-400">₦{totalExpectedRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Class Performance & Recent Admissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Classes Overview & Quick Operations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Class Roster Summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Classes & Arms Overview
                </h3>
                <p className="text-xs text-slate-500">
                  Current enrolled students per class arm and assigned form masters
                </p>
              </div>
              <button
                onClick={() => setCurrentView('classes')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Manage Classes →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3">Level / Stream</th>
                    <th className="py-2.5 px-3">Form Tutor</th>
                    <th className="py-2.5 px-3">Students</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classes.map((cls) => {
                    const classStudents = students.filter(s => s.classId === cls.id);
                    const teacher = teachers.find(t => t.id === cls.classTeacherId);
                    return (
                      <tr key={cls.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {cls.name}
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {cls.level} · {cls.arm}
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unassigned'}
                        </td>
                        <td className="py-3 px-3 font-mono tabular-nums text-slate-800">
                          {classStudents.length} / {cls.capacity}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setCurrentView('results')}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Scores
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Action Operations */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Administrative Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setCurrentView('students')}
                className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all group"
              >
                <GraduationCap className="w-5 h-5 text-indigo-600 mb-1.5" />
                <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600">
                  New Student
                </p>
                <p className="text-[11px] text-slate-400">Register admission</p>
              </button>

              <button
                onClick={() => setCurrentView('attendance')}
                className="p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <CalendarCheck2 className="w-5 h-5 text-emerald-600 mb-1.5" />
                <p className="text-xs font-semibold text-slate-800 group-hover:text-emerald-600">
                  Roll Call
                </p>
                <p className="text-[11px] text-slate-400">Class attendance</p>
              </button>

              <button
                onClick={() => setCurrentView('results')}
                className="p-3 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-left transition-all group"
              >
                <Award className="w-5 h-5 text-amber-600 mb-1.5" />
                <p className="text-xs font-semibold text-slate-800 group-hover:text-amber-600">
                  Gradebook
                </p>
                <p className="text-[11px] text-slate-400">Enter CA & Exam</p>
              </button>

              <button
                onClick={() => setCurrentView('fees')}
                className="p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 text-left transition-all group"
              >
                <CreditCard className="w-5 h-5 text-purple-600 mb-1.5" />
                <p className="text-xs font-semibold text-slate-800 group-hover:text-purple-600">
                  Fee Payments
                </p>
                <p className="text-[11px] text-slate-400">Record bursary receipt</p>
              </button>
            </div>
          </div>

          {/* Chief Admin Verification Codes Section */}
          <div className="rounded-xl border border-rose-200/80 bg-linear-to-br from-rose-50/50 via-white to-slate-50 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-600 text-white shadow-xs">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Chief Admin Invite Codes</span>
                    <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                      Authorized Admin Access
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Generate and send secure verification codes to onboard other school administrators.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInviteModal(true)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Issue Code</span>
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {adminInviteCodes.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center italic">
                  No active admin invitation codes. Click "Issue Code" to create one.
                </p>
              ) : (
                adminInviteCodes.map((invite) => {
                  const isCopied = copiedCode === invite.code;
                  return (
                    <div 
                      key={invite.code}
                      className="p-3 rounded-lg border border-slate-200/80 bg-white hover:border-rose-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-bold font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                            {invite.code}
                          </code>
                          <span 
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              invite.used 
                                ? 'bg-slate-100 text-slate-500' 
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {invite.used ? 'Redeemed' : 'Active & Valid'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          {invite.note}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Issued by {invite.generatedBy} on {invite.createdAt} · Role: {invite.roleAssigned.toUpperCase()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCopyCode(invite.code)}
                          className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                            isCopied
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                          title="Copy verification code to clipboard"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'Copied' : 'Copy Code'}</span>
                        </button>

                        {!invite.used && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Revoke admin invite code ${invite.code}?`)) {
                                revokeAdminInviteCode(invite.code);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Revoke this code"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>Recipient admins select "Administrator Portal" on the login screen to enter this code.</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Announcements & Top Students Spotlight */}
        <div className="space-y-6">
          {/* Top Achieving Students */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Honor Roll Spotlight
              </h3>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Term 2
              </span>
            </div>

            <div className="space-y-3">
              {students.slice(0, 3).map((stu, i) => {
                const stuClass = classes.find(c => c.id === stu.classId);
                return (
                  <div key={stu.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
                        <img 
                          src={stu.photoUrl} 
                          alt={stu.firstName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          {stu.firstName} {stu.lastName}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {stuClass?.name} · Pos #{i + 1}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => openReportCard(stu.id)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Report Card
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Announcements Feed */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-indigo-600" />
                <span>Notice Board</span>
              </h3>
              <button
                onClick={() => setCurrentView('notices')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-semibold uppercase text-slate-600 tracking-wider">
                      {ann.category}
                    </span>
                    <span className="font-mono">{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {ann.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Issue Admin Invite Code Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Chief Admin: Issue Administrator Code
                  </h3>
                  <p className="text-xs text-slate-500">
                    Generate an official verification code for another administrator to join.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setNewCodeSuccess(null);
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {newCodeSuccess ? (
              <div className="py-6 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Admin Code Generated Successfully!
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Send this code to the new administrator. They can immediately log in through the Administrator Portal.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between gap-3 max-w-md mx-auto">
                  <span className="font-mono text-base font-bold tracking-wider text-rose-400">
                    {newCodeSuccess}
                  </span>
                  <button
                    onClick={() => handleCopyCode(newCodeSuccess)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    {copiedCode === newCodeSuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === newCodeSuccess ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Valid for 30 days · Authorized single-use clearance
                </p>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setNewCodeSuccess(null);
                    }}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                  >
                    Issue Another Code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteModal(false);
                      setNewCodeSuccess(null);
                    }}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerateCode} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Designation / Admin Note
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vice Principal Academic, Dean of Studies, Exams Board Officer"
                    value={newCodeNote}
                    onChange={(e) => setNewCodeNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    This note will be attached to the code so you can track who was invited.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Role Clearance Level
                  </label>
                  <select
                    value={newCodeRole}
                    onChange={(e) => setNewCodeRole(e.target.value as 'admin')}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs bg-white text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    <option value="admin">Secondary School Administrator (Full Rights)</option>
                  </select>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Chief Admin Security Protocol</span>
                  </p>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Once generated, any authorized colleague with this verification code can bypass standard restrictions and gain full administrative privileges over students, staff, and records.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Generate Verification Code</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
