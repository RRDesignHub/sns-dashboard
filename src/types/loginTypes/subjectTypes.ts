export interface Subject {
  _id?: string;
  name: string;
  nameBn: string;
  code: string;
  totalMarks: 50 | 100;
  academicMarks: number;
  behavioralMarks: number;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignedSubject {
  subjectId: string;
  order: number;
  isActive: boolean;
  customConfig?: {
    totalMarks?: number;
    academicMarks?: number;
    behavioralMarks?: number;
  };
}

export interface ClassConfig {
  _id?: string;
  classId: string;
  className: string;
  section: "primary" | "secondary";
  academicYear: string;
  subjects: AssignedSubject[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ========== SUBJECT WITH CLASS INFO (For display) ==========
export interface ClassSubjectWithDetails extends ClassConfig {
  subjects: (AssignedSubject & {
    subjectDetails?: Subject;
  })[];
}
