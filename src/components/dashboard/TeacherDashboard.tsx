import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  CalendarCheck2,
  Award,
  BookOpen,
  Clock,
  GraduationCap,
  FileText,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { 
    currentUser, 
    teachers, 
    classes, 
    subjects, 
    students, 
    attendance, 
    setCurrentView, 
    openReportCard,
    timetable 
  } = useSchool();

  const teacher = teachers.find(t => t.id === currentUser.associatedId) || teachers[0];
  const formClass = classes.find(c => c.id === teacher.isClassTeacherOf);
  const myStudents = students.filter(s => s.classId === (formClass?.id || 'cls-ss3sci'));
  const mySubjects = subjects.filter(s => teacher.assignedSubjectIds.includes(s.id));

  // Today's attendance for form class
  const today = '2026-09-24';
  const classAttendanceToday = attendance.filter(
    a => a.classId === (formClass?.id || 'cls-ss3sci') && a.date === today
  );
  const isAttendanceMarkedToday = classAttendanceToday.length > 0;
  const presentCount = classAttendanceToday.filter(a => a.status === 'present' || a.status === 'late').length;

  // Filter timetable for this teacher
  const mySchedule = timetable.filter(t => t.teacherId === teacher.id);

  return (
    <div className="space-y-6">
      {/* Teacher Profile Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={teacher.photoUrl}
              alt={teacher.firstName}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {teacher.firstName} {teacher.lastName}
                </h2>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {teacher.staffId}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {teacher.qualification}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                <span>Form Master: <strong>{formClass?.name || 'SS 3 Science'}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Subjects: {mySubjects.map(s => s.name).join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setCurrentView('attendance')}
              className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Mark Attendance</span>
            </button>
            <button
              onClick={() => setCurrentView('results')}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Enter Scores</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Attendance Card */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Today's Class Roll Call</span>
            <CalendarCheck2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {isAttendanceMarkedToday ? `${presentCount}/${myStudents.length}` : 'Pending'}
            </span>
            <span className="text-xs text-slate-500">
              {isAttendanceMarkedToday ? 'present in class' : 'needs marking'}
            </span>
          </div>
          <div className="mt-3">
            <button
              onClick={() => setCurrentView('attendance')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>{isAttendanceMarkedToday ? 'Review roll register' : 'Take attendance now'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Form Class Students */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Form Class Strength</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {myStudents.length}
            </span>
            <span className="text-xs text-slate-500">registered learners</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Room: {formClass?.roomNumber || 'Senior Quad S3-A'}
          </p>
        </div>

        {/* Assigned Subjects */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Continuous Assessment</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              Term 2
            </span>
            <span className="text-xs text-emerald-600 font-medium">CA 1 & 2 Open</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Weighted 40% CA + 60% Final Exam
          </p>
        </div>
      </div>

      {/* Main Split: Form Class Students & Weekly Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Class Students & Report Cards */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {formClass?.name || 'SS 3 Science'} Student Roster
              </h3>
              <p className="text-xs text-slate-500">
                Click any student to view continuous assessment performance and terminal report cards
              </p>
            </div>
            <button
              onClick={() => setCurrentView('results')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Open Full Gradebook →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Admission No</th>
                  <th className="py-2.5 px-3">Gender</th>
                  <th className="py-2.5 px-3">Parent Contact</th>
                  <th className="py-2.5 px-3 text-right">Terminal Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={stu.photoUrl}
                          alt={stu.firstName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-semibold text-slate-900">
                          {stu.firstName} {stu.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {stu.admissionNo}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {stu.gender}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {stu.guardianPhone}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => openReportCard(stu.id)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded text-xs transition-colors"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Teaching Schedule / Classes Today */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Teaching Timetable</span>
            </h3>
            <span className="text-[10px] font-semibold text-slate-500 uppercase">
              Schedule
            </span>
          </div>

          <div className="space-y-2.5">
            {mySchedule.map((slot) => {
              const sub = subjects.find(s => s.id === slot.subjectId);
              const cls = classes.find(c => c.id === slot.classId);
              return (
                <div key={slot.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
                    <span className="font-semibold text-indigo-900">{slot.day}</span>
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">
                      {sub?.name || 'Subject'}
                    </p>
                    <span className="text-[11px] text-slate-600 font-medium">
                      {cls?.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Room: {slot.room}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
