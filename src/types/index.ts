export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'accountant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  associatedId?: string; // studentId for student, teacherId for teacher, childStudentId for parent
  title?: string;
  phone?: string;
  isChiefAdmin?: boolean; // For Chief Admin invite code generation
  inviteCode?: string;
}

export interface AdminInviteCode {
  code: string;
  generatedBy: string;
  createdAt: string;
  roleAssigned: 'admin';
  note?: string;
  used?: boolean;
  usedBy?: string;
}

export type ClassArm = 'Science' | 'Arts' | 'Commercial' | 'A' | 'B' | 'General';

export interface SchoolClass {
  id: string;
  name: string; // e.g. "SS 3 Science", "JSS 1A"
  level: 'JSS 1' | 'JSS 2' | 'JSS 3' | 'SS 1' | 'SS 2' | 'SS 3';
  arm: string;
  classTeacherId: string;
  roomNumber: string;
  capacity: number;
}

export interface Subject {
  id: string;
  code: string; // e.g. "MTH", "ENG", "PHY"
  name: string;
  category: 'Core' | 'Science' | 'Arts' | 'Vocational';
  applicableLevels: string[]; // ["JSS 1", "SS 1", etc.]
}

export type StudentStatus = 'active' | 'graduated' | 'suspended';

export interface Student {
  id: string;
  admissionNo: string; // e.g. "SMS/2024/042"
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  dob: string;
  classId: string;
  status: StudentStatus;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  photoUrl: string;
  enrolledDate: string;
  parentUserId?: string;
}

export interface Teacher {
  id: string;
  staffId: string; // e.g. "STF/2021/014"
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  email: string;
  phone: string;
  qualification: string; // "B.Sc. (Ed) Physics", "M.Ed Educational Admin"
  assignedClassIds: string[];
  assignedSubjectIds: string[];
  isClassTeacherOf?: string; // classId
  photoUrl: string;
  employmentDate: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  date: string; // "YYYY-MM-DD"
  classId: string;
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface SubjectResult {
  id: string;
  studentId: string;
  classId: string;
  subjectId: string;
  academicSession: string; // "2025/2026"
  term: '1st Term' | '2nd Term' | '3rd Term';
  ca1Score: number; // Max 20
  ca2Score: number; // Max 20
  examScore: number; // Max 60
  totalScore: number; // Max 100
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  gradeRemark: string; // "Excellent", "Very Good", "Credit", "Pass", "Fail"
  subjectPosition?: number;
  teacherRemarks?: string;
}

export interface AffectiveTraits {
  punctuality: number; // 1 to 5
  neatness: number;
  politeness: number;
  honesty: number;
  leadership: number;
  teamwork: number;
}

export interface PsychomotorTraits {
  handwriting: number; // 1 to 5
  sports: number;
  publicSpeaking: number;
  creativity: number;
  labPractical: number;
}

export interface TerminalReportCard {
  studentId: string;
  classId: string;
  academicSession: string;
  term: '1st Term' | '2nd Term' | '3rd Term';
  results: SubjectResult[];
  totalScore: number;
  averageScore: number;
  classPosition: number;
  totalStudentsInClass: number;
  timesSchoolOpened: number;
  timesPresent: number;
  timesAbsent: number;
  affectiveTraits: AffectiveTraits;
  psychomotorTraits: PsychomotorTraits;
  formTeacherRemarks: string;
  principalRemarks: string;
  resumptionDate: string;
}

export type FeeCategory = 
  | 'Tuition Fee' 
  | 'Science & Practical Levy' 
  | 'ICT & Computer Lab' 
  | 'PTA Development Levy' 
  | 'Sports & Games' 
  | 'Library & Textbooks';

export interface FeeItem {
  id: string;
  title: FeeCategory;
  amount: number;
  applicableClasses: string[]; // ['All'] or specific class IDs
  term: '1st Term' | '2nd Term' | '3rd Term';
}

export interface PaymentTransaction {
  id: string;
  receiptNo: string; // "REC-2026-0041"
  date: string;
  amount: number;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'POS' | 'Card Online';
  referenceNo: string;
  recordedBy: string;
  notes?: string;
}

export interface StudentFeeLedger {
  id: string;
  studentId: string;
  classId: string;
  academicSession: string;
  term: '1st Term' | '2nd Term' | '3rd Term';
  totalBill: number;
  amountPaid: number;
  balanceDue: number;
  status: 'paid' | 'partial' | 'unpaid';
  dueDate: string;
  transactions: PaymentTransaction[];
}

export interface TimetableSlot {
  id: string;
  classId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: number; // 1 to 8
  startTime: string; // "08:15"
  endTime: string;   // "09:00"
  subjectId: string;
  teacherId: string;
  room: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'academic' | 'examination' | 'event' | 'fees' | 'urgent';
  targetAudience: 'all' | 'teachers' | 'parents' | 'students';
  date: string;
  author: string;
  isPinned: boolean;
}

export interface SchoolSettings {
  schoolName: string;
  motto: string;
  address: string;
  phone: string;
  email: string;
  currentSession: string;
  currentTerm: '1st Term' | '2nd Term' | '3rd Term';
  nextResumptionDate: string;
  crestUrl: string;
  bannerUrl: string;
  principalPortraitUrl: string;
  principalName: string;
}
