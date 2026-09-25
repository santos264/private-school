import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { X, Printer, Award, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ReportCardModal: React.FC = () => {
  const { 
    selectedReportCardStudentId, 
    closeReportCard, 
    students, 
    classes, 
    subjects, 
    settings, 
    reportCards,
    results 
  } = useSchool();

  if (!selectedReportCardStudentId) return null;

  const student = students.find(s => s.id === selectedReportCardStudentId);
  if (!student) return null;

  const studentClass = classes.find(c => c.id === student.classId);
  const reportCard = reportCards.find(rc => rc.studentId === student.id) || {
    studentId: student.id,
    classId: student.classId,
    academicSession: settings.currentSession,
    term: settings.currentTerm,
    results: results.filter(r => r.studentId === student.id),
    totalScore: results.filter(r => r.studentId === student.id).reduce((a, b) => a + b.totalScore, 0),
    averageScore: Number((results.filter(r => r.studentId === student.id).reduce((a, b) => a + b.totalScore, 0) / Math.max(1, results.filter(r => r.studentId === student.id).length)).toFixed(2)),
    classPosition: 1,
    totalStudentsInClass: students.filter(s => s.classId === student.classId).length,
    timesSchoolOpened: 62,
    timesPresent: 61,
    timesAbsent: 1,
    affectiveTraits: { punctuality: 5, neatness: 5, politeness: 5, honesty: 5, leadership: 5, teamwork: 4 },
    psychomotorTraits: { handwriting: 4, sports: 4, publicSpeaking: 5, creativity: 5, labPractical: 5 },
    formTeacherRemarks: 'Outstanding terminal performance and moral conduct. Keeps raising the bar.',
    principalRemarks: 'Superb academic brilliance. Promoted with honors.',
    resumptionDate: settings.nextResumptionDate,
  };

  const studentResults = results.filter(r => r.studentId === student.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-6 overflow-hidden border border-slate-200">
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="no-print px-6 py-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Terminal Report Card Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={closeReportCard}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT CARD SHEET */}
        <div className="p-6 sm:p-8 bg-white text-slate-900 print:p-0 print:m-0">
          {/* School Header */}
          <div className="border-b-2 border-slate-900 pb-5 mb-5 flex items-start justify-between gap-4">
            <div className="w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border border-slate-300 shadow-xs">
              <img
                src={settings.crestUrl}
                alt="School Crest"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-center flex-1">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                {settings.schoolName}
              </h2>
              <p className="text-xs font-medium italic text-slate-600">
                &ldquo;{settings.motto}&rdquo;
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {settings.address} · Tel: {settings.phone}
              </p>
              <div className="mt-2 inline-block bg-slate-900 text-white px-3 py-0.5 rounded text-xs font-bold tracking-wide uppercase">
                Continuous Assessment & Terminal Examination Report Sheet
              </div>
            </div>

            <div className="w-18 h-18 sm:w-20 sm:h-20 shrink-0 border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
              <img
                src={student.photoUrl}
                alt={student.firstName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Student Bio-Data Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs mb-5">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Student Name</span>
              <span className="font-bold text-slate-900">{student.lastName}, {student.firstName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Admission No.</span>
              <span className="font-mono font-bold text-slate-900">{student.admissionNo}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Class / Arm</span>
              <span className="font-bold text-slate-900">{studentClass?.name || 'SS 3 Science'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Session / Term</span>
              <span className="font-medium text-slate-800">{reportCard.academicSession} · {reportCard.term}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Gender</span>
              <span className="font-medium text-slate-800">{student.gender}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Class Attendance</span>
              <span className="font-mono text-slate-800">{reportCard.timesPresent} / {reportCard.timesSchoolOpened} Days</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Class Position</span>
              <span className="font-bold text-indigo-700 font-mono">
                {reportCard.classPosition} of {reportCard.totalStudentsInClass}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Terminal Average</span>
              <span className="font-bold text-slate-900 font-mono">{reportCard.averageScore}%</span>
            </div>
          </div>

          {/* Cognitive Academic Results Table */}
          <div className="mb-5 overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold text-[11px]">
                  <th className="border border-slate-300 px-3 py-2">Subject</th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-16">CA 1<br/><span className="text-[9px] font-normal">(20)</span></th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-16">CA 2<br/><span className="text-[9px] font-normal">(20)</span></th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-16">Exam<br/><span className="text-[9px] font-normal">(60)</span></th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-16 font-bold">Total<br/><span className="text-[9px] font-normal">(100)</span></th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-14 font-bold">Grade</th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-14">Pos.</th>
                  <th className="border border-slate-300 px-3 py-2">Teacher Assessment Remarks</th>
                </tr>
              </thead>
              <tbody>
                {studentResults.map((res) => {
                  const subject = subjects.find(s => s.id === res.subjectId);
                  return (
                    <tr key={res.id} className="hover:bg-slate-50/50">
                      <td className="border border-slate-300 px-3 py-1.5 font-medium text-slate-800">
                        {subject?.name || res.subjectId}
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5 text-center font-mono tabular-nums">
                        {res.ca1Score}
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5 text-center font-mono tabular-nums">
                        {res.ca2Score}
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5 text-center font-mono tabular-nums">
                        {res.examScore}
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5 text-center font-mono font-bold tabular-nums text-slate-900 bg-slate-50">
                        {res.totalScore}
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5 text-center font-bold">
                        <span className={`font-mono ${res.grade === 'A' ? 'text-emerald-700' : res.grade === 'B' ? 'text-blue-700' : 'text-slate-800'}`}>
                          {res.grade}
                        </span>
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5 text-center font-mono tabular-nums text-slate-600">
                        {res.subjectPosition ? `${res.subjectPosition}${['st','nd','rd'][res.subjectPosition-1] || 'th'}` : '-'}
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-slate-600 italic text-[11px]">
                        {res.teacherRemarks}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-semibold text-slate-900">
                  <td className="border border-slate-300 px-3 py-2 uppercase">
                    Cumulative Summary ({studentResults.length} Subjects)
                  </td>
                  <td colSpan={3} className="border border-slate-300 px-2 py-2 text-right text-slate-600">
                    Grand Aggregate:
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center font-mono font-bold text-indigo-900 bg-slate-200">
                    {reportCard.totalScore}
                  </td>
                  <td colSpan={3} className="border border-slate-300 px-3 py-2 text-slate-700">
                    Terminal Average: <span className="font-mono font-bold">{reportCard.averageScore}%</span> · Position: <span className="font-mono font-bold text-indigo-700">{reportCard.classPosition} of {reportCard.totalStudentsInClass}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Behavioral & Skills Assessment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 text-xs">
            {/* Affective Domain */}
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
                Affective Domain (Rating 1 - 5)
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-600">Punctuality:</span>
                  <span className="font-mono font-bold text-slate-800">5 / 5</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-600">Personal Neatness:</span>
                  <span className="font-mono font-bold text-slate-800">5 / 5</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-600">Politeness & Respect:</span>
                  <span className="font-mono font-bold text-slate-800">5 / 5</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-600">Honesty & Integrity:</span>
                  <span className="font-mono font-bold text-slate-800">5 / 5</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-600">Leadership Ability:</span>
                  <span className="font-mono font-bold text-slate-800">5 / 5</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-600">Team Collaboration:</span>
                  <span className="font-mono font-bold text-slate-800">4 / 5</span>
                </div>
              </div>
            </div>

            {/* Psychomotor Domain */}
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
                Psychomotor Skills (Rating 1 - 5)
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-600">Handwriting:</span>
                  <span className="font-mono font-bold text-slate-800">4 / 5</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-600">Sports & Games:</span>
                  <span className="font-mono font-bold text-slate-800">4 / 5</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-600">Public Speaking & Debate:</span>
                  <span className="font-mono font-bold text-slate-800">5 / 5</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-600">Creativity / Arts:</span>
                  <span className="font-mono font-bold text-slate-800">5 / 5</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-600">Laboratory Practical:</span>
                  <span className="font-mono font-bold text-slate-800">5 / 5</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-600">Computer Skills:</span>
                  <span className="font-mono font-bold text-slate-800">5 / 5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grading Scale Legend */}
          <div className="p-2.5 bg-slate-100/70 border border-slate-200 rounded text-[10px] text-slate-600 mb-5 flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-slate-700">Grading Key:</span>
            <span>A (75 - 100%) Distinction</span>
            <span>·</span>
            <span>B (65 - 74%) Very Good</span>
            <span>·</span>
            <span>C (50 - 64%) Credit</span>
            <span>·</span>
            <span>D (45 - 49%) Pass</span>
            <span>·</span>
            <span>E (40 - 44%) Fair</span>
            <span>·</span>
            <span>F (0 - 39%) Fail</span>
          </div>

          {/* Teacher & Principal Remarks and Signatures */}
          <div className="border border-slate-300 rounded-lg p-4 space-y-4 text-xs">
            <div>
              <span className="font-bold text-slate-800 block text-[11px]">Form Teacher's Remarks:</span>
              <p className="italic text-slate-700 mt-0.5">{reportCard.formTeacherRemarks}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-1">
                <span>Teacher: Mr. David Adeleke</span>
                <span className="italic underline">Signature: D.Adeleke (Signed)</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <span className="font-bold text-slate-800 block text-[11px]">Principal's Remarks & Decision:</span>
              <p className="italic text-slate-700 mt-0.5">{reportCard.principalRemarks}</p>
              
              <div className="mt-3 flex items-end justify-between pt-2 border-t border-slate-100 text-[11px]">
                <div>
                  <p className="font-semibold text-slate-900">{settings.principalName}</p>
                  <p className="text-slate-500">Principal / Head of School</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full border border-indigo-200 flex items-center justify-center p-1 bg-indigo-50/50">
                    <ShieldCheck className="w-8 h-8 text-indigo-700" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-1">Official College Seal</span>
                </div>

                <div className="text-right">
                  <p className="text-slate-500">Next Term Resumption:</p>
                  <p className="font-bold text-slate-900">{settings.nextResumptionDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
