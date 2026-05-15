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
