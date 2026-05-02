export interface Exam {
  _id?: string;
  name: string; // Exam name: "1st Semester", "Final Exam"
  examType: "semester" | "yearly"; // Type of exam
  section: "primary" | "secondary";
  academicYear: string; // "2026"

  // Dates
  startDate: string; // Exam start date
  endDate: string; // Exam end date

  // For Behavioral Marks (20 marks calculation)
  totalWorkdays: number; // For attendance (5 marks)
  totalGuardianMeetings: number; // For guardian meeting (5 marks)
  feeMonths: number; // Months for fee regularity (5 marks per month)

  // Status
  status: "upcoming" | "ongoing" | "completed";
  currentStatus: "upcoming" | "ongoing" | "completed";
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamFormData {
  name: string;
  examType: "semester" | "yearly";
  section: "primary" | "secondary";
  academicYear: string;
  startDate: string;
  endDate: string;
  totalWorkdays: number;
  totalGuardianMeetings: number;
  feeMonths: number;
}
