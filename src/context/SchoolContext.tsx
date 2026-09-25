import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  SchoolSettings,
  SchoolClass,
  Subject,
  Teacher,
  Student,
  AttendanceRecord,
  SubjectResult,
  TerminalReportCard,
  StudentFeeLedger,
  PaymentTransaction,
  TimetableSlot,
  Announcement,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_RESULTS,
  INITIAL_REPORT_CARDS,
  INITIAL_FEES,
  INITIAL_TIMETABLE,
  INITIAL_ANNOUNCEMENTS,
  DEMO_USERS,
} from '../data/initialData';

export type NavigationModule = 
  | 'dashboard' 
  | 'students' 
  | 'teachers' 
  | 'classes' 
  | 'attendance' 
  | 'results' 
  | 'report-cards' 
  | 'fees' 
  | 'timetable' 
  | 'notices' 
  | 'settings';

interface SchoolContextType {
  currentUser: User;
  settings: SchoolSettings;
  classes: SchoolClass[];
  subjects: Subject[];
  teachers: Teacher[];
  students: Student[];
  attendance: AttendanceRecord[];
  results: SubjectResult[];
  reportCards: TerminalReportCard[];
  fees: StudentFeeLedger[];
  timetable: TimetableSlot[];
  announcements: Announcement[];
  currentView: NavigationModule;
  
  // Modals state
  selectedReportCardStudentId: string | null;
  selectedReceiptData: { fee: StudentFeeLedger; transaction: PaymentTransaction; student: Student } | null;
  isRoleSwitcherOpen: boolean;
  isAuthModalOpen: boolean;
  
  // Action handlers
  setCurrentView: (view: NavigationModule) => void;
  switchRole: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;
  openReportCard: (studentId: string) => void;
  closeReportCard: () => void;
  openReceipt: (fee: StudentFeeLedger, transaction: PaymentTransaction, student: Student) => void;
  closeReceipt: () => void;
  setIsRoleSwitcherOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;

  // Domain Actions
  addStudent: (student: Omit<Student, 'id'>) => Student;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  addTeacher: (teacher: Omit<Teacher, 'id'>) => Teacher;
  updateTeacher: (id: string, data: Partial<Teacher>) => void;

  markAttendanceBatch: (date: string, classId: string, records: { studentId: string; status: AttendanceRecord['status']; remarks?: string }[]) => void;

  updateSingleScore: (result: Partial<SubjectResult> & { id?: string; studentId: string; subjectId: string; classId: string }) => void;
  computeClassRanks: (classId: string, session?: string, term?: '1st Term' | '2nd Term' | '3rd Term') => void;

  recordFeePayment: (studentId: string, amount: number, method: PaymentTransaction['paymentMethod'], refNo: string, notes?: string) => PaymentTransaction | null;
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;

  resetToDefaultData: () => void;

  // Helpers
  getStudentById: (id: string) => Student | undefined;
  getTeacherById: (id: string) => Teacher | undefined;
  getClassById: (id: string) => SchoolClass | undefined;
  getSubjectById: (id: string) => Subject | undefined;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'academiasync_v1_';

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe localStorage helper
  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const saveState = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch {
      // Ignore quota errors
    }
  };

  const [settings, setSettings] = useState<SchoolSettings>(() => loadState('settings', INITIAL_SETTINGS));
  const [currentUser, setCurrentUser] = useState<User>(() => loadState('currentUser', DEMO_USERS[0]));
  const [classes, setClasses] = useState<SchoolClass[]>(() => loadState('classes', INITIAL_CLASSES));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadState('subjects', INITIAL_SUBJECTS));
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadState('teachers', INITIAL_TEACHERS));
  const [students, setStudents] = useState<Student[]>(() => loadState('students', INITIAL_STUDENTS));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadState('attendance', INITIAL_ATTENDANCE));
  const [results, setResults] = useState<SubjectResult[]>(() => loadState('results', INITIAL_RESULTS));
  const [reportCards, setReportCards] = useState<TerminalReportCard[]>(() => loadState('reportCards', INITIAL_REPORT_CARDS));
  const [fees, setFees] = useState<StudentFeeLedger[]>(() => loadState('fees', INITIAL_FEES));
  const [timetable] = useState<TimetableSlot[]>(() => loadState('timetable', INITIAL_TIMETABLE));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => loadState('announcements', INITIAL_ANNOUNCEMENTS));

  const [currentView, setCurrentView] = useState<NavigationModule>('dashboard');
  const [selectedReportCardStudentId, setSelectedReportCardStudentId] = useState<string | null>(null);
  const [selectedReceiptData, setSelectedReceiptData] = useState<{ fee: StudentFeeLedger; transaction: PaymentTransaction; student: Student } | null>(null);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => saveState('settings', settings), [settings]);
  useEffect(() => saveState('currentUser', currentUser), [currentUser]);
  useEffect(() => saveState('classes', classes), [classes]);
  useEffect(() => saveState('subjects', subjects), [subjects]);
  useEffect(() => saveState('teachers', teachers), [teachers]);
  useEffect(() => saveState('students', students), [students]);
  useEffect(() => saveState('attendance', attendance), [attendance]);
  useEffect(() => saveState('results', results), [results]);
  useEffect(() => saveState('reportCards', reportCards), [reportCards]);
  useEffect(() => saveState('fees', fees), [fees]);
  useEffect(() => saveState('announcements', announcements), [announcements]);

  const switchRole = (role: UserRole) => {
    const demoUser = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(demoUser);
    setCurrentView('dashboard');
    setIsRoleSwitcherOpen(false);
  };

  const openReportCard = (studentId: string) => {
    setSelectedReportCardStudentId(studentId);
  };

  const closeReportCard = () => {
    setSelectedReportCardStudentId(null);
  };

  const openReceipt = (fee: StudentFeeLedger, transaction: PaymentTransaction, student: Student) => {
    setSelectedReceiptData({ fee, transaction, student });
  };

  const closeReceipt = () => {
    setSelectedReceiptData(null);
  };

  const getStudentById = (id: string) => students.find(s => s.id === id);
  const getTeacherById = (id: string) => teachers.find(t => t.id === id);
  const getClassById = (id: string) => classes.find(c => c.id === id);
  const getSubjectById = (id: string) => subjects.find(s => s.id === id);

  const addStudent = (studentData: Omit<Student, 'id'>): Student => {
    const newId = `stu-${Date.now().toString().slice(-5)}`;
    const newStudent: Student = {
      ...studentData,
      id: newId,
    };
    setStudents(prev => [newStudent, ...prev]);

    // Create an initial fee ledger record for this term
    const newFee: StudentFeeLedger = {
      id: `fee-${Date.now().toString().slice(-5)}`,
      studentId: newId,
      classId: newStudent.classId,
      academicSession: settings.currentSession,
      term: settings.currentTerm,
      totalBill: 185000,
      amountPaid: 0,
      balanceDue: 185000,
      status: 'unpaid',
      dueDate: '2026-03-31',
      transactions: [],
    };
    setFees(prev => [newFee, ...prev]);

    return newStudent;
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id'>): Teacher => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `tch-${Date.now().toString().slice(-5)}`,
    };
    setTeachers(prev => [newTeacher, ...prev]);
    return newTeacher;
  };

  const updateTeacher = (id: string, data: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
  };

  const markAttendanceBatch = (
    date: string,
    classId: string,
    records: { studentId: string; status: AttendanceRecord['status']; remarks?: string }[]
  ) => {
    setAttendance(prev => {
      // Remove any existing records for this class & date to prevent duplicates
      const filtered = prev.filter(a => !(a.date === date && a.classId === classId));
      const newRecords: AttendanceRecord[] = records.map((r, idx) => ({
        id: `att-${Date.now()}-${idx}`,
        date,
        classId,
        studentId: r.studentId,
        status: r.status,
        remarks: r.remarks,
      }));
      return [...filtered, ...newRecords];
    });
  };

  const calculateGrade = (total: number): { grade: SubjectResult['grade']; remark: string } => {
    if (total >= 75) return { grade: 'A', remark: 'Distinction' };
    if (total >= 65) return { grade: 'B', remark: 'Very Good' };
    if (total >= 50) return { grade: 'C', remark: 'Credit' };
    if (total >= 45) return { grade: 'D', remark: 'Pass' };
    if (total >= 40) return { grade: 'E', remark: 'Fair' };
    return { grade: 'F', remark: 'Fail' };
  };

  const updateSingleScore = (input: Partial<SubjectResult> & { id?: string; studentId: string; subjectId: string; classId: string }) => {
    setResults(prev => {
      const existingIndex = prev.findIndex(
        r => r.studentId === input.studentId && r.subjectId === input.subjectId && r.classId === input.classId
      );

      const ca1 = input.ca1Score !== undefined ? input.ca1Score : (existingIndex >= 0 ? prev[existingIndex].ca1Score : 0);
      const ca2 = input.ca2Score !== undefined ? input.ca2Score : (existingIndex >= 0 ? prev[existingIndex].ca2Score : 0);
      const exam = input.examScore !== undefined ? input.examScore : (existingIndex >= 0 ? prev[existingIndex].examScore : 0);
      const total = Math.min(100, Math.max(0, ca1 + ca2 + exam));
      const { grade, remark } = calculateGrade(total);

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...input,
          ca1Score: ca1,
          ca2Score: ca2,
          examScore: exam,
          totalScore: total,
          grade,
          gradeRemark: remark,
        };
        return updated;
      } else {
        const newRecord: SubjectResult = {
          id: input.id || `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          studentId: input.studentId,
          classId: input.classId,
          subjectId: input.subjectId,
          academicSession: settings.currentSession,
          term: settings.currentTerm,
          ca1Score: ca1,
          ca2Score: ca2,
          examScore: exam,
          totalScore: total,
          grade,
          gradeRemark: remark,
          teacherRemarks: input.teacherRemarks || 'Satisfactory assessment performance',
        };
        return [...prev, newRecord];
      }
    });
  };

  const computeClassRanks = (classId: string, session = settings.currentSession, term = settings.currentTerm) => {
    const classStudents = students.filter(s => s.classId === classId);
    if (classStudents.length === 0) return;

    // Calculate student overall totals
    const studentAggregates = classStudents.map(student => {
      const studentResults = results.filter(
        r => r.studentId === student.id && r.academicSession === session && r.term === term
      );
      const totalScore = studentResults.reduce((acc, curr) => acc + curr.totalScore, 0);
      const averageScore = studentResults.length > 0 ? Number((totalScore / studentResults.length).toFixed(2)) : 0;
      return {
        studentId: student.id,
        totalScore,
        averageScore,
        results: studentResults,
      };
    });

    // Sort descending by average
    studentAggregates.sort((a, b) => b.averageScore - a.averageScore);

    // Build terminal reports with rank
    const newReports: TerminalReportCard[] = studentAggregates.map((agg, idx) => {
      const rank = idx + 1;
      const existing = reportCards.find(
        rc => rc.studentId === agg.studentId && rc.academicSession === session && rc.term === term
      );

      // Attendance tally
      const studentAttendance = attendance.filter(a => a.studentId === agg.studentId);
      const timesPresent = studentAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
      const timesAbsent = studentAttendance.filter(a => a.status === 'absent').length;

      return {
        studentId: agg.studentId,
        classId,
        academicSession: session,
        term: term as '1st Term' | '2nd Term' | '3rd Term',
        results: agg.results,
        totalScore: agg.totalScore,
        averageScore: agg.averageScore,
        classPosition: rank,
        totalStudentsInClass: classStudents.length,
        timesSchoolOpened: Math.max(60, timesPresent + timesAbsent),
        timesPresent: Math.max(timesPresent, 58),
        timesAbsent: timesAbsent,
        affectiveTraits: existing?.affectiveTraits || {
          punctuality: 5,
          neatness: 5,
          politeness: 5,
          honesty: 5,
          leadership: 4,
          teamwork: 4,
        },
        psychomotorTraits: existing?.psychomotorTraits || {
          handwriting: 4,
          sports: 4,
          publicSpeaking: 4,
          creativity: 4,
          labPractical: 5,
        },
        formTeacherRemarks:
          rank === 1
            ? 'Top of the class! Exceptional intellectual consistency and character.'
            : rank <= 3
            ? 'Commendable performance. Keep working hard to maintain high standards.'
            : 'Good effort, encouraged to devote more study time to challenging subjects.',
        principalRemarks:
          agg.averageScore >= 75
            ? 'An outstanding terminal result. Promoted with merit honors.'
            : 'Satisfactory performance. Continue to strive for academic brilliance.',
        resumptionDate: settings.nextResumptionDate,
      };
    });

    setReportCards(prev => {
      const filtered = prev.filter(rc => !(rc.classId === classId && rc.academicSession === session && rc.term === term));
      return [...filtered, ...newReports];
    });
  };

  const recordFeePayment = (
    studentId: string,
    amount: number,
    method: PaymentTransaction['paymentMethod'],
    refNo: string,
    notes?: string
  ): PaymentTransaction | null => {
    let createdTx: PaymentTransaction | null = null;

    setFees(prev => {
      const ledgerIdx = prev.findIndex(f => f.studentId === studentId);
      if (ledgerIdx < 0) return prev;

      const ledger = prev[ledgerIdx];
      const receiptNo = `REC-2026-${(ledger.transactions.length + 101).toString().padStart(4, '0')}`;
      const newTx: PaymentTransaction = {
        id: `tx-${Date.now()}`,
        receiptNo,
        date: new Date().toISOString().split('T')[0],
        amount,
        paymentMethod: method,
        referenceNo: refNo || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        recordedBy: currentUser.name,
        notes: notes || 'Terminal school fees receipt',
      };
      createdTx = newTx;

      const newPaid = ledger.amountPaid + amount;
      const newBalance = Math.max(0, ledger.totalBill - newPaid);
      const newStatus = newBalance === 0 ? 'paid' : newPaid > 0 ? 'partial' : 'unpaid';

      const updatedLedger: StudentFeeLedger = {
        ...ledger,
        amountPaid: newPaid,
        balanceDue: newBalance,
        status: newStatus,
        transactions: [newTx, ...ledger.transactions],
      };

      const clone = [...prev];
      clone[ledgerIdx] = updatedLedger;
      return clone;
    });

    return createdTx;
  };

  const addAnnouncement = (data: Omit<Announcement, 'id'>) => {
    const newNotice: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
    };
    setAnnouncements(prev => [newNotice, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setSettings(INITIAL_SETTINGS);
    setClasses(INITIAL_CLASSES);
    setSubjects(INITIAL_SUBJECTS);
    setTeachers(INITIAL_TEACHERS);
    setStudents(INITIAL_STUDENTS);
    setAttendance(INITIAL_ATTENDANCE);
    setResults(INITIAL_RESULTS);
    setReportCards(INITIAL_REPORT_CARDS);
    setFees(INITIAL_FEES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setCurrentUser(DEMO_USERS[0]);
    setCurrentView('dashboard');
  };

  return (
    <SchoolContext.Provider
      value={{
        currentUser,
        settings,
        classes,
        subjects,
        teachers,
        students,
        attendance,
        results,
        reportCards,
        fees,
        timetable,
        announcements,
        currentView,
        selectedReportCardStudentId,
        selectedReceiptData,
        isRoleSwitcherOpen,
        isAuthModalOpen,
        setCurrentView,
        switchRole,
        setCurrentUser,
        openReportCard,
        closeReportCard,
        openReceipt,
        closeReceipt,
        setIsRoleSwitcherOpen,
        setIsAuthModalOpen,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        markAttendanceBatch,
        updateSingleScore,
        computeClassRanks,
        recordFeePayment,
        addAnnouncement,
        deleteAnnouncement,
        resetToDefaultData,
        getStudentById,
        getTeacherById,
        getClassById,
        getSubjectById,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
