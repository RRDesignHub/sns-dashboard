// Student search result
export interface StudentSearchResult {
  _id: string;
  studentID: string;
  studentName: string;
  classRoll: string;
  className: string;
  classId: string;
  section: string;
  group?: string;
  image?: string;
}

// Exam info
export interface ExamInfo {
  _id: string;
  name: string;
  nameBn: string;
  examType: "semester" | "yearly";
  academicYear: string;
  session: string;
  startDate: string;
  endDate: string;
  totalWorkdays: number;
  totalGuardianMeetings: number;
  feeMonths: number;
}

// Subject with effective marks
export interface SubjectWithMarks {
  _id: string;
  name: string;
  nameBn: string;
  code: string;
  totalMarks: number; // ✅ From API (effective marks)
  academicMarks: number; // ✅ From API (effective marks)
  behavioralMarks: number; // ✅ From API (effective marks)
  order: number;
  isActive: boolean;
  hasCustomConfig: boolean; // ✅ Whether marks are overridden
  defaultTotalMarks?: number; // Original marks (if overridden)
}

// Form data for subject marks
export interface SubjectMarksEntry {
  subjectId: string;
  academicMarks: number;
}

// Complete result form data
export interface ResultFormData {
  studentId: string;
  studentInfo: {
    studentId: string;
    name: string;
    roll: number;
    className: string;
  };
  examId: string;
  examInfo: {
    name: string;
    academicYear: string;
  };
  attendance: {
    present: number;
    total: number;
  };
  meetings: {
    attended: number;
    total: number;
  };
  fees: {
    paid: number;
    total: number;
  };
  discipline: {
    obtained: number;
    total: number;
  };
  subjects: SubjectMarksEntry[];
}

// Grade result
export interface GradeResult {
  obtained: number;
  max: number;
  percentage: number;
  grade: string;
  gpa: number;
  isPassed: boolean;
}
export interface SubjectResult {
  subjectId: string;
  name: string;
  nameBn: string;
  code: string;
  totalMarks: number;
  academicMarks: number;
  behavioralMarks: number;
  obtainedAcademic: number;
  obtainedTotal: number;
  grade: string;
  gpa: number;
  isPassed: boolean;
  customConfig?: {
    originalTotalMarks: number;
  };
}

export interface BehavioralData {
  attendance: { present: number; total: number; marks: number };
  meetings: { attended: number; total: number; marks: number };
  fees: { paid: number; total: number; marks: number };
  discipline: { obtained: number; total: number; marks: number };
  totalBehavioralMarks: number;
}

export interface ResultData {
  _id: string;

  academicYear: string;
  studentSnapshot: {
    studentId: string;
    studentName: string;
    classRoll: string;
    className: string;
  };
  examSnapshot: {
    name: string;
    examType: string;
  };
  behavioralData: BehavioralData;
  subjectResults: SubjectResult[];
  summary: {
    totalSubjects: number;
    passedSubjects: number;
    failedSubjects: number;
    totalObtainedMarks: number;
    totalMaxMarks: number;
    overallPercentage: number;
    averageGPA: number;
    finalGrade: string;
    isPassed: boolean;
  };
  status: string;
  createdAt: string;
}

export interface ResultPrintModalProps {
  resultId: string;
  onClose: () => void;
}
