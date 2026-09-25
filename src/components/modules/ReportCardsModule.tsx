import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  FileText,
  Calculator,
  Printer,
  Sparkles,
  Award,
  CheckCircle,
  Filter
} from 'lucide-react';

export const ReportCardsModule: React.FC = () => {
  const { classes, students, reportCards, results, computeClassRanks, openReportCard, settings } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-ss3sci');
  const [computeAlert, setComputeAlert] = useState(false);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classStudents = students.filter(s => s.classId === selectedClassId);

  const handleRunComputation = () => {
    computeClassRanks(selectedClassId);
    setComputeAlert(true);
    setTimeout(() => setComputeAlert(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Terminal Report Cards & Position Ranking
          </h2>
          <p className="text-xs text-slate-500">
            Automated class grading, average computation, ranking (1st, 2nd, 3rd) and printable terminal reports
          </p>
        </div>

        <button
          onClick={handleRunComputation}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Calculator className="w-4 h-4" />
          <span>Compute & Rank All Class Positions</span>
        </button>
      </div>

      {computeAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Class statistics updated! Positions and averages have been recalculated for all students in {selectedClass?.name}.</span>
        </div>
      )}

      {/* Class Selector Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-700">Select Class Stream:</span>
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

        <div className="text-xs text-slate-500">
          <span>{settings.currentSession}</span>
          <span className="mx-2" aria-hidden="true">·</span>
          <span>{settings.currentTerm}</span>
        </div>
      </div>

      {/* Roster & Report Cards Grid */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Class Rank</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Admission No</th>
                <th className="py-3 px-3 text-center">Subjects Graded</th>
                <th className="py-3 px-3 text-center">Aggregate Score</th>
                <th className="py-3 px-3 text-center">Terminal Average</th>
                <th className="py-3 px-4 text-right">Official Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((stu) => {
                const report = reportCards.find(rc => rc.studentId === stu.id);
                const stuResults = results.filter(r => r.studentId === stu.id);
                const totalScore = report?.totalScore ?? stuResults.reduce((a, b) => a + b.totalScore, 0);
                const avg = report?.averageScore ?? (stuResults.length > 0 ? (totalScore / stuResults.length).toFixed(1) : 0);
                const rank = report?.classPosition ?? '-';

                return (
                  <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`font-mono font-bold text-xs ${
                        rank === 1 ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded' :
                        rank === 2 ? 'text-slate-700 bg-slate-100 px-2 py-0.5 rounded' :
                        rank === 3 ? 'text-amber-800 bg-amber-50/70 px-2 py-0.5 rounded' : 'text-slate-600'
                      }`}>
                        {rank !== '-' ? `${rank}${['st','nd','rd'][Number(rank)-1] || 'th'}` : '-'}
                      </span>
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

                    <td className="py-3 px-3 text-center font-mono">
                      {stuResults.length}
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-900">
                      {totalScore}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {avg}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openReportCard(stu.id)}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded text-xs transition-colors inline-flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Print Report Card</span>
                      </button>
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
