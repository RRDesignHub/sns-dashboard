export interface Subject {
  _id: string;
  name: string;
  nameBn: string;
  code: string;
  totalMarks: 50 | 100;
  academicMarks: number;
  behavioralMarks: number;
  status: "active" | "inactive";
}

export interface ClassConfig {
  _id: string;
  classId: string;
  className: string;
  section: string;
  academicYear: string;
  subjects: {
    subjectId: string;
    order: number;
    isActive: boolean;
    customConfig?: {
      totalMarks?: number;
      academicMarks?: number;
      behavioralMarks?: number;
    };
  }[];
}
