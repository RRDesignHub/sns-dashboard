// ============================================================
// STATIC DUMMY RESULTS — 3rd Semester only
// Class: Play, 1–10 | Roll: 3 (fixed per class)
// Delete when real API is ready
// ============================================================

const SCHOOL_YEAR = "2026";
const EXAM = "3rd Semester";

const makeSubjects = (
  entries: Array<
    [
      nameBn: string,
      name: string,
      code: string,
      total: number,
      academic: number,
      obtainedAcademic: number,
    ]
  >,
) => {
  return entries.map(
    ([nameBn, name, code, totalMarks, academicMarks, obtainedAcademic]) => {
      const behavioralMarks = totalMarks - academicMarks;
      const obtainedBehavioral =
        totalMarks === 100
          ? obtainedAcademic > 0
            ? Math.round(totalMarks - academicMarks - 2)
            : 0
          : 0;
      const obtainedTotal =
        obtainedAcademic + (totalMarks === 100 ? obtainedBehavioral : 0);
      const percent = Math.round((obtainedTotal / totalMarks) * 100);
      let grade = "F";
      let gpa = 0;
      if (percent >= 80) {
        grade = "A+";
        gpa = 5;
      } else if (percent >= 70) {
        grade = "A";
        gpa = 4;
      } else if (percent >= 60) {
        grade = "A-";
        gpa = 3.5;
      } else if (percent >= 50) {
        grade = "B";
        gpa = 3;
      } else if (percent >= 40) {
        grade = "C";
        gpa = 2;
      } else if (percent >= 33) {
        grade = "D";
        gpa = 1;
      }
      const isPassed = percent >= 33;
      return {
        subjectId: `dummy-${code}`,
        name,
        nameBn,
        code,
        totalMarks,
        academicMarks,
        obtainedAcademic,
        obtainedTotal,
        grade,
        gpa,
        isPassed,
      };
    },
  );
};

const makeResult = (
  className: string,
  roll: string,
  studentName: string,
  studentId: string,
  behavioral: {
    attendance: { present: number; total: number };
    meetings: { attended: number; total: number };
    fees: { paid: number; total: number };
    discipline: number;
  },
  subjects: ReturnType<typeof makeSubjects>,
) => {
  const attendanceMarks = Math.round(
    (behavioral.attendance.present / behavioral.attendance.total) * 5,
  );
  const meetingMarks = Math.round(
    (behavioral.meetings.attended / behavioral.meetings.total) * 5,
  );
  const feeMarks = Math.round(
    (behavioral.fees.paid / behavioral.fees.total) * 5,
  );
  const disciplineMarks = behavioral.discipline;
  const totalBehavioral =
    attendanceMarks + meetingMarks + feeMarks + disciplineMarks;

  let totalObtained = 0;
  let totalMax = 0;
  let passedCount = 0;
  let failedCount = 0;
  let totalGPA = 0;

  subjects.forEach((s) => {
    totalObtained += s.obtainedTotal;
    totalMax += s.totalMarks;
    totalGPA += s.gpa;
    if (s.isPassed) passedCount++;
    else failedCount++;
  });

  const hasFailed = failedCount > 0;
  const overallPercentage = Math.round((totalObtained / totalMax) * 100);
  const averageGPA = hasFailed ? 0 : totalGPA / subjects.length;

  let finalGrade = "F";
  if (!hasFailed) {
    if (averageGPA >= 5.0) finalGrade = "A+";
    else if (averageGPA >= 4.0) finalGrade = "A";
    else if (averageGPA >= 3.5) finalGrade = "A-";
    else if (averageGPA >= 3.0) finalGrade = "B";
    else if (averageGPA >= 2.0) finalGrade = "C";
    else if (averageGPA >= 1.0) finalGrade = "D";
  }

  return {
    studentSnapshot: { studentId, studentName, classRoll: roll, className },
    examSnapshot: { name: EXAM, examType: "semester" },
    academicYear: SCHOOL_YEAR,
    className,
    behavioralData: {
      attendance: {
        present: behavioral.attendance.present,
        total: behavioral.attendance.total,
        marks: attendanceMarks,
      },
      meetings: {
        attended: behavioral.meetings.attended,
        total: behavioral.meetings.total,
        marks: meetingMarks,
      },
      fees: {
        paid: behavioral.fees.paid,
        total: behavioral.fees.total,
        marks: feeMarks,
      },
      discipline: {
        obtained: disciplineMarks,
        total: 5,
        marks: disciplineMarks,
      },
      totalBehavioralMarks: totalBehavioral,
    },
    subjectResults: subjects,
    summary: {
      totalSubjects: subjects.length,
      passedSubjects: passedCount,
      failedSubjects: failedCount,
      totalObtainedMarks: totalObtained,
      totalMaxMarks: totalMax,
      overallPercentage,
      averageGPA: Number(averageGPA.toFixed(2)),
      finalGrade,
      isPassed: !hasFailed,
    },
    status: "published",
  };
};

// ==================== PRIMARY (Play, 1, 2) ====================
const primarySubjects = (values: {
  ban: number;
  eng: number;
  math: number;
  rel: number;
  gk: number;
  dra: number;
}) =>
  makeSubjects([
    ["বাংলা ১ম পত্র", "Bangla 1st Paper", "BAN-101", 100, 80, values.ban],
    ["ইংরেজি ১ম পত্র", "English 1st Paper", "ENG-107", 100, 80, values.eng],
    ["গণিত", "Mathematics", "MAT-109", 100, 80, values.math],
    ["ধর্ম ও নৈতিক শিক্ষা", "Religion", "REL-111", 50, 50, values.rel],
    ["সাধারণ জ্ঞান", "General Knowledge", "GK-150", 30, 30, values.gk],
    ["ছবি আঁকা", "Drawing", "DRA-149", 20, 20, values.dra],
  ]);

// ==================== SECONDARY (3–10) ====================
const secondarySubjects = (values: {
  ban1: number;
  ban2: number;
  eng1: number;
  eng2: number;
  math: number;
  sci: number;
  soc: number;
  rel: number;
  ict: number;
  dra: number;
}) =>
  makeSubjects([
    ["বাংলা ১ম পত্র", "Bangla 1st Paper", "BAN-101", 100, 80, values.ban1],
    ["বাংলা ২য় পত্র", "Bangla 2nd Paper", "BAN-102", 100, 80, values.ban2],
    ["ইংরেজি ১ম পত্র", "English 1st Paper", "ENG-107", 100, 80, values.eng1],
    ["ইংরেজি ২য় পত্র", "English 2nd Paper", "ENG-108", 100, 80, values.eng2],
    ["গণিত", "Mathematics", "MAT-109", 100, 80, values.math],
    ["বিজ্ঞান", "Science", "SCI-110", 100, 80, values.sci],
    ["সমাজ বিজ্ঞান", "Social Science", "SOC-111", 100, 80, values.soc],
    ["ধর্ম ও নৈতিক শিক্ষা", "Religion", "REL-112", 100, 80, values.rel],
    ["তথ্য ও যোগাযোগ প্রযুক্তি", "ICT", "ICT-113", 50, 50, values.ict],
    ["ছবি আঁকা", "Drawing", "DRA-149", 50, 50, values.dra],
  ]);

// ==================== STATIC RESULTS (Roll 3, 3rd Semester) ====================
export const DUMMY_RESULTS: Record<string, any> = {
  Play: makeResult(
    "Play",
    "3",
    "Jannatul Mawa",
    "SN-20261003",
    {
      attendance: { present: 48, total: 53 },
      meetings: { attended: 2, total: 2 },
      fees: { paid: 3, total: 3 },
      discipline: 5,
    },
    primarySubjects({ ban: 70, eng: 68, math: 74, rel: 46, gk: 27, dra: 18 }),
  ),
  "1": makeResult(
    "1",
    "3",
    "Md. Ali Hossen",
    "SN-20261103",
    {
      attendance: { present: 45, total: 53 },
      meetings: { attended: 2, total: 2 },
      fees: { paid: 3, total: 3 },
      discipline: 4,
    },
    primarySubjects({ ban: 65, eng: 60, math: 58, rel: 42, gk: 24, dra: 15 }),
  ),
  "2": makeResult(
    "2",
    "3",
    "Arfitha Shil",
    "SN-20261203",
    {
      attendance: { present: 50, total: 53 },
      meetings: { attended: 2, total: 2 },
      fees: { paid: 3, total: 3 },
      discipline: 5,
    },
    primarySubjects({ ban: 74, eng: 72, math: 76, rel: 48, gk: 28, dra: 19 }),
  ),
  "3": makeResult(
    "3",
    "3",
    "Aradya Shil Mistu",
    "SN-20261303",
    {
      attendance: { present: 44, total: 53 },
      meetings: { attended: 2, total: 2 },
      fees: { paid: 2, total: 3 },
      discipline: 4,
    },
    secondarySubjects({
      ban1: 68,
      ban2: 65,
      eng1: 62,
      eng2: 60,
      math: 58,
      sci: 55,
      soc: 63,
      rel: 70,
      ict: 40,
      dra: 38,
    }),
  ),
  "4": makeResult(
    "4",
    "3",
    "Zayan Hasan",
    "SN-20261403",
    {
      attendance: { present: 52, total: 53 },
      meetings: { attended: 2, total: 2 },
      fees: { paid: 3, total: 3 },
      discipline: 5,
    },
    secondarySubjects({
      ban1: 76,
      ban2: 72,
      eng1: 70,
      eng2: 68,
      math: 74,
      sci: 72,
      soc: 74,
      rel: 76,
      ict: 44,
      dra: 42,
    }),
  ),
  "5": makeResult(
    "5",
    "3",
    "Ain Uddin",
    "SN-20261503",
    {
      attendance: { present: 40, total: 53 },
      meetings: { attended: 1, total: 2 },
      fees: { paid: 2, total: 3 },
      discipline: 3,
    },
    secondarySubjects({
      ban1: 55,
      ban2: 50,
      eng1: 48,
      eng2: 45,
      math: 42,
      sci: 44,
      soc: 52,
      rel: 58,
      ict: 32,
      dra: 28,
    }),
  ),
  "6": makeResult(
    "6",
    "3",
    "Pranti Chowdhury",
    "SN-20261603",
    {
      attendance: { present: 46, total: 53 },
      meetings: { attended: 2, total: 2 },
      fees: { paid: 3, total: 3 },
      discipline: 4,
    },
    secondarySubjects({
      ban1: 66,
      ban2: 64,
      eng1: 60,
      eng2: 58,
      math: 62,
      sci: 60,
      soc: 65,
      rel: 68,
      ict: 38,
      dra: 36,
    }),
  ),
  "7": makeResult(
    "7",
    "3",
    "Prangron Chowdhury",
    "SN-20261703",
    {
      attendance: { present: 48, total: 53 },
      meetings: { attended: 2, total: 2 },
      fees: { paid: 3, total: 3 },
      discipline: 5,
    },
    secondarySubjects({
      ban1: 72,
      ban2: 70,
      eng1: 68,
      eng2: 66,
      math: 70,
      sci: 68,
      soc: 72,
      rel: 74,
      ict: 42,
      dra: 40,
    }),
  ),
  "8": makeResult(
    "8",
    "3",
    "Megha Das",
    "SN-20261803",
    {
      attendance: { present: 51, total: 53 },
      meetings: { attended: 2, total: 2 },
      fees: { paid: 3, total: 3 },
      discipline: 5,
    },
    secondarySubjects({
      ban1: 78,
      ban2: 76,
      eng1: 74,
      eng2: 72,
      math: 78,
      sci: 76,
      soc: 78,
      rel: 80,
      ict: 46,
      dra: 44,
    }),
  ),
  "9": makeResult(
    "9",
    "3",
    "Md. Abdullah Irfan",
    "SN-20261903",
    {
      attendance: { present: 43, total: 53 },
      meetings: { attended: 2, total: 2 },
      fees: { paid: 3, total: 3 },
      discipline: 4,
    },
    secondarySubjects({
      ban1: 60,
      ban2: 58,
      eng1: 55,
      eng2: 52,
      math: 48,
      sci: 50,
      soc: 58,
      rel: 62,
      ict: 34,
      dra: 32,
    }),
  ),
  "10": makeResult(
    "10",
    "3",
    "Sinthiya Hossen Jara",
    "SN-20262003",
    {
      attendance: { present: 49, total: 53 },
      meetings: { attended: 2, total: 2 },
      fees: { paid: 3, total: 3 },
      discipline: 5,
    },
    secondarySubjects({
      ban1: 74,
      ban2: 72,
      eng1: 70,
      eng2: 68,
      math: 72,
      sci: 70,
      soc: 74,
      rel: 76,
      ict: 44,
      dra: 42,
    }),
  ),
};

// ✅ Fetch helper — mimics API response
export const getDummyResult = (
  className: string,
  classRoll: string,
  examName: string,
  academicYear: string,
) => {
  const data = DUMMY_RESULTS[className];
  if (!data) return null;
  // Only return if roll and exam match
  if (data.studentSnapshot.classRoll !== classRoll) return null;
  if (data.examSnapshot.name !== examName) return null;
  return data;
};
