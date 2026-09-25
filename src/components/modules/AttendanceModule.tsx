import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  CalendarCheck2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  CheckCheck,
  Calendar,
  Filter
} from 'lucide-react';
import { AttendanceStatus } from '../../types';

export const AttendanceModule: React.FC = () => {
  const { classes, students, attendance, markAttendanceBatch, settings } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-ss3sci');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const classStudents = students.filter(s => s.classId === selectedClassId);

  // Local state for attendance records being marked
  const [studentStatuses, setStudentStatuses] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>(() => {
    const initialMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach(stu => {
      const existing = attendance.find(a => a.studentId === stu.id && a.date === selectedDate);
      initialMap[stu.id] = {
        status: existing ? existing.status : 'present',
        remarks: existing?.remarks || '',
      };
    });
    return initialMap;
  });

  // Re-sync when date or class changes
  React.useEffect(() => {
    const updatedMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach(stu => {
      const existing = attendance.find(a => a.studentId === stu.id && a.date === selectedDate);
      updatedMap[stu.id] = {
        status: existing ? existing.status : 'present',
        remarks: existing?.remarks || '',
      };
    });
    setStudentStatuses(updatedMap);
  }, [selectedClassId, selectedDate, attendance]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentStatuses(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarkChange = (studentId: string, remarks: string) => {
    setStudentStatuses(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updatedMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach(stu => {
      updatedMap[stu.id] = {
        status,
        remarks: status === 'present' ? '' : studentStatuses[stu.id]?.remarks || '',
      };
    });
    setStudentStatuses(updatedMap);
  };

  const handleSaveAttendance = () => {
    const records = classStudents.map(stu => ({
      studentId: stu.id,
      status: studentStatuses[stu.id]?.status || 'present',
      remarks: studentStatuses[stu.id]?.remarks,
    }));

    markAttendanceBatch(selectedDate, selectedClassId, records);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Stats for current class & date
  const presentCount = Object.values(studentStatuses).filter(v => v.status === 'present').length;
  const lateCount = Object.values(studentStatuses).filter(v => v.status === 'late').length;
  const absentCount = Object.values(studentStatuses).filter(v => v.status === 'absent').length;
  const excusedCount = Object.values(studentStatuses).filter(v => v.status === 'excused').length;
  const attendanceRate = classStudents.length > 0 
    ? Math.round(((presentCount + lateCount) / classStudents.length) * 100) 
    : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Daily Class Attendance Register
          </h2>
          <p className="text-xs text-slate-500">
            Conduct daily roll call, record late arrivals, track absenteeism and excuses
          </p>
        </div>

        <button
          onClick={handleSaveAttendance}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Save Roll Call Register</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Class attendance successfully recorded into the centralized school database.</span>
        </div>
      )}

      {/* Control Bar: Class, Date, Batch Actions */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Select Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-500"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Register Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Quick Fill:</span>
          <button
            onClick={() => handleMarkAll('present')}
            className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md transition-colors"
          >
            Mark All Present
          </button>
          <button
            onClick={() => handleMarkAll('absent')}
            className="px-2.5 py-1 text-xs font-medium bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-md transition-colors"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Real-time Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="text-slate-400 text-[10px] uppercase block font-semibold">Total Students</span>
          <span className="text-lg font-bold font-mono text-slate-900">{classStudents.length}</span>
        </div>
        <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg">
          <span className="text-emerald-700 text-[10px] uppercase block font-semibold">Present</span>
          <span className="text-lg font-bold font-mono text-emerald-800">{presentCount}</span>
        </div>
        <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg">
          <span className="text-amber-700 text-[10px] uppercase block font-semibold">Late</span>
          <span className="text-lg font-bold font-mono text-amber-800">{lateCount}</span>
        </div>
        <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-lg">
          <span className="text-rose-700 text-[10px] uppercase block font-semibold">Absent</span>
          <span className="text-lg font-bold font-mono text-rose-800">{absentCount}</span>
        </div>
        <div className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-lg">
          <span className="text-indigo-700 text-[10px] uppercase block font-semibold">Turnout Rate</span>
          <span className="text-lg font-bold font-mono text-indigo-900">{attendanceRate}%</span>
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Admission No</th>
                <th className="py-3 px-3">Attendance Status</th>
                <th className="py-3 px-4">Remarks / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((stu, idx) => {
                const currentStatus = studentStatuses[stu.id]?.status || 'present';
                const currentRemark = studentStatuses[stu.id]?.remarks || '';

                return (
                  <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={stu.photoUrl}
                          alt={stu.firstName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
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

                    {/* Interactive segmented status pills */}
                    <td className="py-3 px-3">
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'present')}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Present
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'late')}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-white shadow-2xs font-semibold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Late
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'absent')}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white shadow-2xs font-semibold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Absent
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'excused')}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                            currentStatus === 'excused'
                              ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Optional remarks (e.g. sick bay permission)"
                        value={currentRemark}
                        onChange={(e) => handleRemarkChange(stu.id, e.target.value)}
                        className="w-full max-w-sm px-2.5 py-1 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
