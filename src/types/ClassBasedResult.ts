// Result list item (for table display)
export interface ResultListItem {
  _id: string;
  studentName: string;
  studentRoll: number;
  studentId: string;
  examName: string;
  examType: string;
  position: number;
  totalObtained: number;
  totalMax: number;
  percentage: number;
  grade: string;
  gpa: number;
  status: "draft" | "published";
  isFailed: boolean;
  createdAt: string;
}

// Filter options
export interface ResultFilters {
  className: string;
  academicYear: string;
  examId?: string;
  status?: string;
}

// ✅ Aggregate types (for final evaluation view)
export interface AggregateSubjectResult {
  subjectId: string;
  name: string;
  nameBn: string;
  code: string;
  totalMarks: number;
  semesterMarks: (number | null)[];
  presentCount: number;
  averageMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
  isPassed: boolean;
}

export interface AggregateResult {
  studentId: string;
  studentSnapshot: {
    studentId: string;
    studentName: string;
    classRoll: string;
    className: string;
  };
  semesterCount: number;
  semesters: Array<{
    semesterNumber: number;
    resultId: string;
    examId: string;
    examName: string;
    examStartDate?: string;
  }>;
  behavioral: {
    attendance: {
      totalWorkdays: number;
      totalPresent: number;
      totalAbsent: number;
    };
    meetings: { totalMeetings: number; totalAttended: number };
    fees: { totalFeeMonths: number; totalPaid: number };
    discipline: { totalObtained: number };
  };
  subjectResults: AggregateSubjectResult[];
  summary: {
    totalSubjects: number;
    passedSubjects: number;
    failedSubjects: number;
    totalObtained: number;
    totalMax: number;
    overallPercentage: number;
    averageGPA: number;
    finalGrade: string;
    isPassed: boolean;
  };
  position: number;
}
