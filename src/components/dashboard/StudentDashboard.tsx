import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Award,
  CalendarCheck2,
  Clock,
  CreditCard,
  FileText,
  Printer,
  Sparkles,
  BookOpen,
  School,
  CheckCircle2
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { 
    currentUser, 
    students, 
    classes, 
    subjects, 
    results, 
    fees, 
    attendance, 
    settings, 
    openReportCard,
    timetable,
    announcements,
    setCurrentView 
  } = useSchool();

  const student = students.find(s => s.id === currentUser.associatedId) || students[0];
  const studentClass = classes.find(c => c.id === student.classId);
  const myResults = results.filter(r => r.studentId === student.id);
  const myFee = fees.find(f => f.studentId === student.id);

  // Attendance stats for student
  const myAttendance = attendance.filter(a => a.studentId === student.id);
  const presentDays = myAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const totalMarkedDays = myAttendance.length;
  const attendanceRate = totalMarkedDays > 0 ? Math.round((presentDays / totalMarkedDays) * 100) : 98;

  // Grade averages
  const totalScore = myResults.reduce((sum, r) => sum + r.totalScore, 0);
  const averageScore = myResults.length > 0 ? (totalScore / myResults.length).toFixed(1) : '87.8';

  // Timetable today
  const classTimetable = timetable.filter(t => t.classId === student.classId);

  return (
    <div className="space-y-6">
      {/* Student ID Profile Card & Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={student.photoUrl}
                alt={student.firstName}
                className="w-20 h-20 rounded-xl object-cover border-2 border-indigo-100 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-2 -right-1 px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold uppercase tracking-wider">
                Active
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {student.firstName} {student.lastName}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Adm No: {student.admissionNo} · {studentClass?.name || 'SS 3 Science'}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
                <span>Guardian: {student.guardianName}</span>
                <span aria-hidden="true">·</span>
                <span>Session: {settings.currentSession}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <button
              onClick={() => openReportCard(student.id)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>Print Terminal Report Card</span>
            </button>
            <button
              onClick={() => setCurrentView('timetable')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4" />
              <span>Class Timetable</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Terminal Average */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Term 2 Average</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {averageScore}%
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Distinction
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Across {myResults.length} registered subjects
          </p>
        </div>

        {/* Class Rank */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Class Standing</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-indigo-700 tabular-nums">
              1st
            </span>
            <span className="text-xs text-slate-500">of 38 students</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Top of Senior Science stream
          </p>
        </div>

        {/* Attendance */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Attendance Rate</span>
            <CalendarCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {attendanceRate}%
            </span>
            <span className="text-xs text-emerald-600 font-medium">Regular</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {presentDays} recorded attendance days
          </p>
        </div>

        {/* Fees Status */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Bursary Clearance</span>
            <CreditCard className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-700">
              {myFee?.status === 'paid' ? 'Fully Cleared' : 'Balance Pending'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-mono">
            {myFee?.status === 'paid' ? '₦0.00 outstanding' : `₦${myFee?.balanceDue.toLocaleString()} due`}
          </p>
        </div>
      </div>

      {/* Main Grid: Subject Scores & Class Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Registered Subject Performance */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Continuous Assessment & Terminal Scores
              </h3>
              <p className="text-xs text-slate-500">
                Breakdown of CA 1 (20%), CA 2 (20%) and Terminal Examination (60%)
              </p>
            </div>
            <button
              onClick={() => openReportCard(student.id)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Full Sheet</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-2 text-center">CA 1 (20)</th>
                  <th className="py-2.5 px-2 text-center">CA 2 (20)</th>
                  <th className="py-2.5 px-2 text-center">Exam (60)</th>
                  <th className="py-2.5 px-2 text-center">Total (100)</th>
                  <th className="py-2.5 px-2 text-center">Grade</th>
                  <th className="py-2.5 px-3">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myResults.map((res) => {
                  const sub = subjects.find(s => s.id === res.subjectId);
                  return (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {sub?.name || res.subjectId}
                      </td>
                      <td className="py-3 px-2 text-center font-mono tabular-nums text-slate-600">
                        {res.ca1Score}
                      </td>
                      <td className="py-3 px-2 text-center font-mono tabular-nums text-slate-600">
                        {res.ca2Score}
                      </td>
                      <td className="py-3 px-2 text-center font-mono tabular-nums text-slate-600">
                        {res.examScore}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold tabular-nums text-slate-900 bg-slate-50">
                        {res.totalScore}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-emerald-700">
                        {res.grade}
                      </td>
                      <td className="py-3 px-3 text-slate-500 italic text-[11px]">
                        {res.gradeRemark}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Timetable & Notices */}
        <div className="space-y-6">
          {/* Class Timetable */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Class Timetable</span>
              </h3>
              <span className="text-[11px] text-slate-400">Weekly</span>
            </div>

            <div className="space-y-2">
              {classTimetable.slice(0, 5).map((slot) => {
                const sub = subjects.find(s => s.id === slot.subjectId);
                return (
                  <div key={slot.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">{sub?.name}</span>
                      <span className="font-mono text-[11px] text-slate-500">{slot.day} · {slot.startTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Room: {slot.room}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* School Notices */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Notice Board Reminders
            </h3>
            <div className="space-y-2.5">
              {announcements.slice(0, 2).map((a) => (
                <div key={a.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                  <p className="font-semibold text-slate-900">{a.title}</p>
                  <p className="text-slate-500 text-[11px] line-clamp-2 mt-1">{a.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
