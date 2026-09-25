import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  BookOpen,
  GraduationCap,
  Users2,
  Layers,
  Sparkles,
  CheckCircle2,
  Building
} from 'lucide-react';

export const ClassesSubjectsModule: React.FC = () => {
  const { classes, subjects, teachers, students, setCurrentView } = useSchool();
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects'>('classes');

  return (
    <div className="space-y-6">
      {/* Header with Segmented Control */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Classes, Curriculum & Subjects
          </h2>
          <p className="text-xs text-slate-500">
            Configure secondary school levels, class arms, capacity and subject allocations
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'classes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Class Arms ({classes.length})
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'subjects' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Subjects Directory ({subjects.length})
          </button>
        </div>
      </div>

      {activeTab === 'classes' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classes.map((cls) => {
            const classStudents = students.filter(s => s.classId === cls.id);
            const teacher = teachers.find(t => t.id === cls.classTeacherId);
            const percentFilled = Math.round((classStudents.length / cls.capacity) * 100);

            return (
              <div key={cls.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {cls.level} · {cls.arm}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-700">
                      {classStudents.length} / {cls.capacity}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {cls.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cls.roomNumber}</span>
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Form Master</span>
                    <p className="font-semibold text-slate-800">
                      {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unassigned'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mr-3 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${percentFilled}%` }}
                    ></div>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 shrink-0">
                    {percentFilled}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">Subject Code</th>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-4">Department / Category</th>
                  <th className="py-3 px-4">Applicable Levels</th>
                  <th className="py-3 px-4">Assigned Specialist Masters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((sub) => {
                  const instructors = teachers.filter(t => t.assignedSubjectIds.includes(sub.id));
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                        {sub.code}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {sub.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          sub.category === 'Core' ? 'bg-slate-100 text-slate-700' :
                          sub.category === 'Science' ? 'bg-blue-50 text-blue-700' :
                          sub.category === 'Arts' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {sub.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {sub.applicableLevels.join(', ')}
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-medium">
                        {instructors.length > 0
                          ? instructors.map(i => `${i.firstName} ${i.lastName}`).join(', ')
                          : 'Awaiting Instructor'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
