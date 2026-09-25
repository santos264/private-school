import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Award,
  Save,
  CheckCircle,
  Calculator,
  FileText,
  Filter,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SubjectResult } from '../../types';

export const ResultsModule: React.FC = () => {
  const { 
    classes, 
    subjects, 
    students, 
    results, 
    settings, 
    updateSingleScore, 
    computeClassRanks, 
    openReportCard,
    currentUser 
  } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-ss3sci');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub-phy');
  const [saveBanner, setSaveBanner] = useState(false);
  const [ranksBanner, setRanksBanner] = useState(false);

  const classStudents = students.filter(s => s.classId === selectedClassId);
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const currentClass = classes.find(c => c.id === selectedClassId);

  // Local draft scores
  const [draftScores, setDraftScores] = useState<Record<string, { ca1: number; ca2: number; exam: number; remarks: string }>>({});

  // Sync draft scores whenever class or subject changes
  React.useEffect(() => {
    const map: Record<string, { ca1: number; ca2: number; exam: number; remarks: string }> = {};
    classStudents.forEach(stu => {
      const existing = results.find(
        r => r.studentId === stu.id && r.subjectId === selectedSubjectId && r.classId === selectedClassId
      );
      map[stu.id] = {
        ca1: existing ? existing.ca1Score : 15,
        ca2: existing ? existing.ca2Score : 15,
        exam: existing ? existing.examScore : 45,
        remarks: existing?.teacherRemarks || 'Satisfactory classroom engagement',
      };
    });
    setDraftScores(map);
  }, [selectedClassId, selectedSubjectId, classStudents.length]);

  const handleScoreChange = (studentId: string, field: 'ca1' | 'ca2' | 'exam', val: number) => {
    const clamped = Math.max(0, isNaN(val) ? 0 : val);
    const maxVal = field === 'exam' ? 60 : 20;
    const finalVal = Math.min(clamped, maxVal);

    setDraftScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: finalVal,
      },
    }));
  };

  const handleRemarkChange = (studentId: string, text: string) => {
    setDraftScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks: text,
      },
    }));
  };

  const handleSaveSubjectScores = () => {
    classStudents.forEach(stu => {
      const draft = draftScores[stu.id];
      if (draft) {
        updateSingleScore({
          studentId: stu.id,
          classId: selectedClassId,
          subjectId: selectedSubjectId,
          ca1Score: draft.ca1,
          ca2Score: draft.ca2,
          examScore: draft.exam,
          teacherRemarks: draft.remarks,
        });
      }
    });

    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);
  };

  const handleComputeRanks = () => {
    handleSaveSubjectScores();
    computeClassRanks(selectedClassId);
    setRanksBanner(true);
    setTimeout(() => setRanksBanner(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Examinations & Continuous Assessment Gradebook
          </h2>
          <p className="text-xs text-slate-500">
            Automated computation formula: CA 1 (20) + CA 2 (20) + Exam (60) = Total Score (100)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSaveSubjectScores}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Scores</span>
          </button>

          <button
            onClick={handleComputeRanks}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Calculator className="w-4 h-4" />
            <span>Compute Class Positions & Ranks</span>
          </button>
        </div>
      </div>

      {saveBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Scores successfully saved to database. Grades and totals automatically re-indexed.</span>
        </div>
      )}

      {ranksBanner && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Class rankings computed! All terminal positions (1st, 2nd, 3rd) and averages have been compiled into report cards.</span>
        </div>
      )}

      {/* Selectors Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
            Target Class
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
            Academic Subject
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-500"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 pt-3 sm:pt-0 sm:ml-auto">
          <span>Active Session: <strong>{settings.currentSession}</strong></span>
          <span className="mx-2" aria-hidden="true">·</span>
          <span>Term: <strong>{settings.currentTerm}</strong></span>
        </div>
      </div>

      {/* Score Grid Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4 w-10">#</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-3">Admission No</th>
                <th className="py-3 px-3 text-center w-28">CA 1<br/><span className="text-[9px] font-normal">(Max 20)</span></th>
                <th className="py-3 px-3 text-center w-28">CA 2<br/><span className="text-[9px] font-normal">(Max 20)</span></th>
                <th className="py-3 px-3 text-center w-28">Exam<br/><span className="text-[9px] font-normal">(Max 60)</span></th>
                <th className="py-3 px-3 text-center w-24 font-bold">Total (100)</th>
                <th className="py-3 px-3 text-center w-16">Grade</th>
                <th className="py-3 px-4">Subject Remarks</th>
                <th className="py-3 px-3 text-right">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((stu, idx) => {
                const draft = draftScores[stu.id] || { ca1: 0, ca2: 0, exam: 0, remarks: '' };
                const total = Math.min(100, draft.ca1 + draft.ca2 + draft.exam);
                const grade = total >= 75 ? 'A' : total >= 65 ? 'B' : total >= 50 ? 'C' : total >= 45 ? 'D' : total >= 40 ? 'E' : 'F';

                return (
                  <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {stu.firstName} {stu.lastName}
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-600">
                      {stu.admissionNo}
                    </td>

                    {/* CA 1 Input */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={draft.ca1}
                        onChange={(e) => handleScoreChange(stu.id, 'ca1', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 border border-slate-300 rounded text-center font-mono tabular-nums text-xs focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* CA 2 Input */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={draft.ca2}
                        onChange={(e) => handleScoreChange(stu.id, 'ca2', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 border border-slate-300 rounded text-center font-mono tabular-nums text-xs focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* Exam Input */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={draft.exam}
                        onChange={(e) => handleScoreChange(stu.id, 'exam', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 border border-slate-300 rounded text-center font-mono tabular-nums text-xs focus:ring-1 focus:ring-indigo-500 font-semibold"
                      />
                    </td>

                    {/* Computed Total */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 tabular-nums bg-slate-50">
                      {total}
                    </td>

                    {/* Computed Grade */}
                    <td className="py-3 px-3 text-center">
                      <span className={`font-mono font-bold ${
                        grade === 'A' ? 'text-emerald-700' :
                        grade === 'B' ? 'text-blue-700' :
                        grade === 'C' ? 'text-indigo-700' :
                        grade === 'D' ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        {grade}
                      </span>
                    </td>

                    {/* Teacher Remarks Input */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={draft.remarks}
                        onChange={(e) => handleRemarkChange(stu.id, e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-600 focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => openReportCard(stu.id)}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded"
                        title="View Full Report Card"
                      >
                        <FileText className="w-4 h-4" />
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
