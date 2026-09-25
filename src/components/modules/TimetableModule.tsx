import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Clock, Calendar, BookOpen, Building, User } from 'lucide-react';

export const TimetableModule: React.FC = () => {
  const { classes, subjects, teachers, timetable } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-ss3sci');
  const [filterMode, setFilterMode] = useState<'class' | 'teacher'>('class');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || 'tch-01');

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  const periods = [1, 2, 3, 4, 5, 6];

  const filteredSlots = timetable.filter(slot => {
    if (filterMode === 'class') {
      return slot.classId === selectedClassId;
    } else {
      return slot.teacherId === selectedTeacherId;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Master Academic Timetable
          </h2>
          <p className="text-xs text-slate-500">
            Weekly instruction schedules, laboratory practical hours and classroom allocations
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setFilterMode('class')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterMode === 'class' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Class Timetable
          </button>
          <button
            onClick={() => setFilterMode('teacher')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterMode === 'teacher' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teacher Schedule
          </button>
        </div>
      </div>

      {/* Selector */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
        {filterMode === 'class' ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700">Select Class:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-medium text-slate-800"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700">Select Teacher:</span>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-medium text-slate-800"
            >
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.qualification})</option>
              ))}
            </select>
          </div>
        )}

        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          Official School Hours: 08:00 AM - 02:00 PM
        </span>
      </div>

      {/* Weekly Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map((day) => {
          const daySlots = filteredSlots
            .filter(s => s.day === day)
            .sort((a, b) => a.period - b.period);

          return (
            <div key={day} className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col">
              <div className="border-b border-slate-100 pb-2 mb-3 flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">{day}</h3>
                <span className="text-[10px] font-mono font-medium text-slate-400">
                  {daySlots.length} periods
                </span>
              </div>

              {daySlots.length > 0 ? (
                <div className="space-y-2.5 flex-1">
                  {daySlots.map((slot) => {
                    const subject = subjects.find(s => s.id === slot.subjectId);
                    const teacher = teachers.find(t => t.id === slot.teacherId);
                    const sClass = classes.find(c => c.id === slot.classId);

                    return (
                      <div
                        key={slot.id}
                        className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-mono text-[10px] text-indigo-700 font-semibold">
                          <span>Period {slot.period}</span>
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                        <p className="font-bold text-slate-900 leading-tight">
                          {subject?.name || 'Subject'}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                          <span>{filterMode === 'class' ? teacher?.lastName : sClass?.name}</span>
                          <span className="text-slate-400 font-medium">{slot.room}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-6 text-center text-xs text-slate-400 italic">
                  No scheduled lessons
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
