import React, { useState } from "react";
import {
  FaSearch,
  FaUserGraduate,
  FaCalendarAlt,
  FaSave,
  FaEye,
  FaInfoCircle,
  FaPlus,
} from "react-icons/fa";
import { MdClass, MdSubject } from "react-icons/md";
import styles from "../../../styles/DashboardPages/CreateResult.module.scss";
import type {
  StudentSearchResult,
  ExamInfo,
  SubjectWithMarks,
  SubjectMarksEntry,
  GradeResult,
} from "../../../types/ResultTypes";
import Swal from "sweetalert2";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";
import SubjectMarksInput from "../../../components/DashboardComponents/SubjectsMarksInputs";
import ResultPreview from "../../../components/DashboardComponents/ResultPreview";

const CreateResult: React.FC = () => {
  // ==================== STATE MANAGEMENT ====================
  const axiosSecure = useAxiosSecure();
  // Search state
  const [searchType, setSearchType] = useState<"roll" | "studentId">("roll");
  const [searchClass, setSearchClass] = useState("");
  const [searchRoll, setSearchRoll] = useState("");
  const [searchStudentId, setSearchStudentId] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Found data
  const [foundStudent, setFoundStudent] = useState<StudentSearchResult | null>(
    null,
  );
  const [availableExams, setAvailableExams] = useState<ExamInfo[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamInfo | null>(null);
  const [classSubjects, setClassSubjects] = useState<SubjectWithMarks[]>([]);

  // Form data
  const [attendanceDays, setAttendanceDays] = useState({
    present: 0,
    total: 0,
  });
  const [meetingAttendance, setMeetingAttendance] = useState({
    attended: 0,
    total: 0,
  });
  const [feeMonths, setFeeMonths] = useState({ paid: 0, total: 0 });
  const [subjectMarks, setSubjectMarks] = useState<SubjectMarksEntry[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<"search" | "marks">("search");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for preview modal
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  // ==================== HELPER FUNCTIONS ====================

  // Calculate grade from percentage
  const calculateGrade = (percentage: number): GradeResult => {
    if (percentage >= 80)
      return {
        obtained: 0,
        max: 0,
        percentage,
        grade: "A+",
        gpa: 5.0,
        isPassed: true,
      };
    if (percentage >= 70)
      return {
        obtained: 0,
        max: 0,
        percentage,
        grade: "A",
        gpa: 4.0,
        isPassed: true,
      };
    if (percentage >= 60)
      return {
        obtained: 0,
        max: 0,
        percentage,
        grade: "A-",
        gpa: 3.5,
        isPassed: true,
      };
    if (percentage >= 50)
      return {
        obtained: 0,
        max: 0,
        percentage,
        grade: "B",
        gpa: 3.0,
        isPassed: true,
      };
    if (percentage >= 40)
      return {
        obtained: 0,
        max: 0,
        percentage,
        grade: "C",
        gpa: 2.0,
        isPassed: true,
      };
    if (percentage >= 33)
      return {
        obtained: 0,
        max: 0,
        percentage,
        grade: "D",
        gpa: 1.0,
        isPassed: true,
      };
    return {
      obtained: 0,
      max: 0,
      percentage,
      grade: "F",
      gpa: 0.0,
      isPassed: false,
    };
  };

  // Calculate behavioral marks
  const calculateBehavioralMarks = (
    present: number,
    totalDays: number,
    attended: number,
    totalMeetings: number,
    paid: number,
    totalMonths: number,
  ) => {
    const attendanceMark = totalDays > 0 ? (present / totalDays) * 5 : 0;
    const meetingMark = totalMeetings > 0 ? (attended / totalMeetings) * 5 : 0;
    const feeMark = totalMonths > 0 ? (paid / totalMonths) * 5 : 0;
    return { attendanceMark, meetingMark, feeMark };
  };

  // Calculate subject total and grade
  const calculateSubjectResult = (
    academicObtained: number,
    behavioralObtained: number,
    disciplineMark: number,
    subject: SubjectWithMarks,
  ): GradeResult => {
    const totalObtained =
      academicObtained + behavioralObtained + disciplineMark;
    const totalMax = subject.totalMarks; // ✅ Use totalMarks directly
    const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
    const grade = calculateGrade(percentage);
    return { ...grade, obtained: totalObtained, max: totalMax };
  };

  // ==================== HANDLERS ====================

  // Handle student search
  const handleSearch = async () => {
    // Validation
    if (searchType === "roll") {
      if (!searchClass) {
        Swal.fire("সতর্কতা!", "দয়া করে ক্লাস নির্বাচন করুন", "warning");
        setIsSearching(false);
        return;
      }
      if (!searchRoll) {
        Swal.fire("সতর্কতা!", "দয়া করে রোল নম্বর দিন", "warning");
        setIsSearching(false);
        return;
      }
    } else {
      if (!searchStudentId) {
        Swal.fire("সতর্কতা!", "দয়া করে শিক্ষার্থী আইডি দিন", "warning");
        setIsSearching(false);
        return;
      }
    }

    setIsSearching(true);

    try {
      let response;

      if (searchType === "roll") {
        // ✅ Convert classId to className for database query
        const classMap: Record<string, string> = {
          play: "Play",
          nursery: "Nursery",
          "class-1": "1",
          "class-2": "2",
          "class-3": "3",
          "class-4": "4",
          "class-5": "5",
        };

        const className = classMap[searchClass];

        // Search by class + roll
        response = await axiosSecure.get("/api/result/student-data", {
          params: {
            className: className,
            classRoll: searchRoll,
            academicYear: new Date().getFullYear().toString(),
          },
        });
      } else {
        // Search by student ID
        response = await axiosSecure.get("/api/result/student-data", {
          params: {
            studentId: searchStudentId,
          },
        });
      }

      // Set found student
      setFoundStudent(response.data.data);

      // After finding student, fetch available exams for that class
      const examsResponse = await axiosSecure.get("/api/exams/class", {
        params: {
          className: response.data.data.className,
          academicYear: new Date().getFullYear().toString(),
        },
      });

      setAvailableExams(examsResponse.data.data);
      setIsSearching(false);
      setActiveTab("marks");
    } catch (error: any) {
      setIsSearching(false);
      Swal.fire(
        "ত্রুটি!",
        error.response?.data?.message || "শিক্ষার্থী খুঁজে পাওয়া যায়নি",
        "error",
      );
    }
  };

  // Handle exam selection
  const handleExamSelect = async (exam: ExamInfo) => {
    setSelectedExam(exam);
    setAttendanceDays({ present: 0, total: exam.totalWorkdays });
    setMeetingAttendance({ attended: 0, total: exam.totalGuardianMeetings });
    setFeeMonths({ paid: 0, total: exam.feeMonths });

    try {
      // Fetch class subjects from API
      const subjectsResponse = await axiosSecure.get(
        `/api/subjects/class/${foundStudent?.classId}/subjects/${exam.academicYear}`,
      );
      const subjects = subjectsResponse.data.data;

      setClassSubjects(subjects);

      // Initialize subject marks
      const initialMarks: SubjectMarksEntry[] = subjects.map((sub: any) => ({
        subjectId: sub._id,
        academicMarks: 0,
        behavioralMarks: 0,
        disciplineMarks: 5,
      }));
      setSubjectMarks(initialMarks);
    } catch (error: any) {
      console.error("Failed to fetch class subjects:", error);
      Swal.fire("ত্রুটি!", "বিষয় তথ্য আনতে ব্যর্থ হয়েছে", "error");
      setClassSubjects([]);
    }
  };

  // Update subject marks
  const updateSubjectMark = (
    subjectId: string,
    field: keyof SubjectMarksEntry,
    value: number,
  ) => {
    setSubjectMarks((prev) =>
      prev.map((mark) =>
        mark.subjectId === subjectId ? { ...mark, [field]: value } : mark,
      ),
    );
  };

  // Calculate total summary
  const calculateTotalSummary = () => {
    const behavioral = calculateBehavioralMarks(
      attendanceDays.present,
      attendanceDays.total,
      meetingAttendance.attended,
      meetingAttendance.total,
      feeMonths.paid,
      feeMonths.total,
    );

    let totalObtained = 0;
    let totalMax = 0;

    subjectMarks.forEach((mark) => {
      const subject = classSubjects.find((s) => s._id === mark.subjectId);
      if (subject) {
        const subjectTotal =
          mark.academicMarks + mark.behavioralMarks + mark.disciplineMarks;
        totalObtained += subjectTotal;
        totalMax += subject.totalMarks;
      }
    });

    const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
    const grade = calculateGrade(percentage);

    return { totalObtained, totalMax, percentage, grade, behavioral };
  };

  const summary = calculateTotalSummary();

  // ==================== PREVIEW FUNCTION ====================
  const handlePreview = () => {
    // Prepare preview data (same as before)
    const previewData = {
      student: {
        studentName: foundStudent?.studentName,
        className: foundStudent?.className,
        classRoll: foundStudent?.classRoll,
        studentId: foundStudent?.studentID,
      },
      exam: {
        name: selectedExam?.name,
        academicYear: selectedExam?.academicYear,
      },
      behavioral: {
        attendance: {
          marks: (
            (attendanceDays.present / attendanceDays.total) * 5 || 0
          ).toFixed(2),
        },
        meetings: {
          marks: (
            (meetingAttendance.attended / meetingAttendance.total) * 5 || 0
          ).toFixed(2),
        },
        fees: {
          marks: ((feeMonths.paid / feeMonths.total) * 5 || 0).toFixed(2),
        },
        totalBehavioralMarks: (
          ((attendanceDays.present / attendanceDays.total) * 5 || 0) +
          ((meetingAttendance.attended / meetingAttendance.total) * 5 || 0) +
          ((feeMonths.paid / feeMonths.total) * 5 || 0)
        ).toFixed(2),
      },
      subjects: subjectMarks.map((mark) => {
        const subject = classSubjects.find((s) => s._id === mark.subjectId);
        const totalObtained =
          mark.academicMarks + mark.behavioralMarks + mark.disciplineMarks;
        const percentage = (totalObtained / (subject?.totalMarks || 1)) * 100;
        const grade = calculateGrade(percentage);
        return {
          subjectName: subject?.nameBn,
          subjectCode: subject?.code,
          academicObtained: mark.academicMarks,
          academicMax: subject?.academicMarks,
          behavioralObtained: mark.behavioralMarks,
          behavioralMax: subject?.behavioralMarks,
          disciplineObtained: mark.disciplineMarks,
          totalObtained,
          totalMax: subject?.totalMarks,
          percentage: percentage.toFixed(2),
          grade: grade.grade,
          gpa: grade.gpa.toFixed(2),
        };
      }),
      summary: {
        totalObtained: summary.totalObtained,
        totalMax: summary.totalMax,
        percentage: summary.percentage.toFixed(2),
        grade: summary.grade.grade,
        gpa: summary.grade.gpa.toFixed(2),
      },
    };

    setPreviewData(previewData);
    setShowPreview(true);
  };

  // ==================== SUBMIT FUNCTION ====================
  const handleSubmit = async () => {
    // Validate before submit
    if (!foundStudent || !selectedExam) {
      Swal.fire("ত্রুটি!", "শিক্ষার্থী বা পরীক্ষা নির্বাচন করেননি", "error");
      return;
    }

    // Validate subject marks
    for (const mark of subjectMarks) {
      const subject = classSubjects.find((s) => s._id === mark.subjectId);
      if (subject) {
        if (
          mark.academicMarks < 0 ||
          mark.academicMarks > subject.academicMarks
        ) {
          Swal.fire(
            "ত্রুটি!",
            `${subject.nameBn} এর একাডেমিক মার্ক সঠিক নয়`,
            "error",
          );
          return;
        }
        if (
          mark.behavioralMarks < 0 ||
          mark.behavioralMarks > subject.behavioralMarks
        ) {
          Swal.fire(
            "ত্রুটি!",
            `${subject.nameBn} এর বিহেভিওরাল মার্ক সঠিক নয়`,
            "error",
          );
          return;
        }
        if (mark.disciplineMarks < 0 || mark.disciplineMarks > 5) {
          Swal.fire(
            "ত্রুটি!",
            `${subject.nameBn} এর শৃঙ্খলা মার্ক সঠিক নয়`,
            "error",
          );
          return;
        }
      }
    }

    // Prepare submit data
    const submitData = {
      studentId: foundStudent._id,
      examId: selectedExam._id,
      classId: foundStudent?.classId,
      attendance: {
        present: attendanceDays.present,
        total: attendanceDays.total,
      },
      meetings: {
        attended: meetingAttendance.attended,
        total: meetingAttendance.total,
      },
      fees: {
        paid: feeMonths.paid,
        total: feeMonths.total,
      },
      subjects: subjectMarks.map((mark) => ({
        subjectId: mark.subjectId,
        obtainedAcademic: mark.academicMarks,
        obtainedBehavioral: mark.behavioralMarks,
        obtainedDiscipline: mark.disciplineMarks,
      })),
    };

    console.log("📤 SUBMIT DATA:", JSON.stringify(submitData, null, 2));

    setIsSubmitting(true);

    try {
      const response = await axiosSecure.post("/api/result/create", submitData);

      if (response.data.success) {
        Swal.fire({
          title: "সফল!",
          text: "ফলাফল সফলভাবে সংরক্ষণ করা হয়েছে",
          icon: "success",
          confirmButtonColor: "#16a34a",
        }).then(() => {
          // Reset form after successful submission
          resetForm();
        });
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      Swal.fire({
        title: "ত্রুটি!",
        text:
          error.response?.data?.message || "ফলাফল সংরক্ষণ করতে ব্যর্থ হয়েছে",
        icon: "error",
        confirmButtonColor: "#16a34a",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== RESET FORM FUNCTION ====================
  const resetForm = () => {
    // Reset search state
    setSearchType("roll");
    setSearchClass("");
    setSearchRoll("");
    setSearchStudentId("");

    // Reset found data
    setFoundStudent(null);
    setAvailableExams([]);
    setSelectedExam(null);
    setClassSubjects([]);

    // Reset form data
    setAttendanceDays({ present: 0, total: 0 });
    setMeetingAttendance({ attended: 0, total: 0 });
    setFeeMonths({ paid: 0, total: 0 });
    setSubjectMarks([]);

    // Reset UI state
    setActiveTab("search");
    setIsSubmitting(false);

    // Optional: Clear any preview states
    setShowPreview(false);
    setPreviewData(null);
  };
  return (
    <>
      <div className={styles.createResult}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <FaUserGraduate />
            </div>
            <div>
              <h1 className={styles.pageTitle}>ফলাফল তৈরি করুন</h1>
              <p className={styles.pageSubtitle}>
                শিক্ষার্থীর ফলাফল তৈরি করতে নিচের ধাপগুলো অনুসরণ করুন
              </p>
            </div>

            {/* ✅ Add Reset Button at Top Right */}
            {(foundStudent || selectedExam || subjectMarks.length > 0) && (
              <button className={styles.resetTopBtn} onClick={resetForm}>
                <FaPlus /> নতুন ফলাফল তৈরি
              </button>
            )}
          </div>
        </div>

        {/* Step Indicator */}
        <div className={styles.stepIndicator}>
          <div
            className={`${styles.step} ${activeTab === "search" ? styles.active : styles.completed}`}
          >
            <div className={styles.stepNumber}>১</div>
            <div className={styles.stepLabel}>শিক্ষার্থী অনুসন্ধান</div>
          </div>
          <div className={styles.stepLine}></div>
          <div
            className={`${styles.step} ${activeTab === "marks" ? styles.active : ""}`}
          >
            <div className={styles.stepNumber}>২</div>
            <div className={styles.stepLabel}>ফলাফল দিন</div>
          </div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.step}`}>
            <div className={styles.stepNumber}>৩</div>
            <div className={styles.stepLabel}>সংরক্ষণ করুন</div>
          </div>
        </div>

        {/* Step 1: Search Student */}
        {activeTab === "search" && (
          <div className={styles.searchSection}>
            <div className={styles.searchCard}>
              <h3 className={styles.sectionTitle}>
                <FaSearch /> শিক্ষার্থী খুঁজুন
              </h3>

              {/* Search Type Toggle */}
              <div className={styles.searchTypeToggle}>
                <button
                  className={`${styles.toggleBtn} ${searchType === "roll" ? styles.active : ""}`}
                  onClick={() => setSearchType("roll")}
                >
                  রোল নং দিয়ে
                </button>
                <button
                  className={`${styles.toggleBtn} ${searchType === "studentId" ? styles.active : ""}`}
                  onClick={() => setSearchType("studentId")}
                >
                  আইডি দিয়ে
                </button>
              </div>

              {/* Search Form */}
              {searchType === "roll" ? (
                <div className={styles.searchForm}>
                  <div className={styles.formGroup}>
                    <label>ক্লাস নির্বাচন করুন</label>
                    <select
                      className={styles.selectInput}
                      value={searchClass}
                      onChange={(e) => setSearchClass(e.target.value)}
                    >
                      <option value="">-- ক্লাস নির্বাচন করুন --</option>
                      <option value="play">Play</option>
                      <option value="nursery">Nursery</option>
                      <option value="class-1">Class 1</option>
                      <option value="class-2">Class 2</option>

                      <option value="class-3">Class 3</option>
                      <option value="class-4">Class 4</option>

                      <option value="class-5">Class 5</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>রোল নম্বর</label>
                    <input
                      type="number"
                      className={styles.textInput}
                      placeholder="যেমন: ১৫"
                      value={searchRoll}
                      onChange={(e) => setSearchRoll(e.target.value)}
                    />
                  </div>
                  <button
                    className={styles.searchBtn}
                    onClick={handleSearch}
                    disabled={!searchClass || !searchRoll || isSearching}
                  >
                    {isSearching ? (
                      "অনুসন্ধান হচ্ছে..."
                    ) : (
                      <>
                        <FaSearch /> অনুসন্ধান
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className={styles.searchForm}>
                  <div className={styles.formGroup}>
                    <label>শিক্ষার্থীর আইডি</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="যেমন: STU-2025-001"
                      value={searchStudentId}
                      onChange={(e) => setSearchStudentId(e.target.value)}
                    />
                  </div>
                  <button
                    className={styles.searchBtn}
                    onClick={handleSearch}
                    disabled={!searchStudentId || isSearching}
                  >
                    {isSearching ? (
                      "অনুসন্ধান হচ্ছে..."
                    ) : (
                      <>
                        <FaSearch /> অনুসন্ধান
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Enter Results */}
        {activeTab === "marks" && foundStudent && (
          <div className={styles.marksSection}>
            {/* Student & Exam Info Card */}
            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <div className={styles.infoItem}>
                  <FaUserGraduate className={styles.infoIcon} />
                  <div>
                    <label>শিক্ষার্থীর নাম</label>
                    <span>{foundStudent.studentName}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <MdClass className={styles.infoIcon} />
                  <div>
                    <label>শ্রেণি ও রোল</label>
                    <span>
                      {foundStudent.className} - রোল: {foundStudent.classRoll}
                    </span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <FaCalendarAlt className={styles.infoIcon} />
                  <div>
                    <label>শিক্ষার্থী আইডি</label>
                    <span>{foundStudent.studentID}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Selection */}
            <div className={styles.examCard}>
              <h3 className={styles.sectionTitle}>
                <FaCalendarAlt /> পরীক্ষা নির্বাচন করুন
              </h3>
              <div className={styles.examList}>
                {availableExams.map((exam) => (
                  <button
                    key={exam._id}
                    className={`${styles.examBtn} ${selectedExam?._id === exam._id ? styles.selected : ""}`}
                    onClick={() => handleExamSelect(exam)}
                  >
                    <div className={styles.examName}>{exam.name} Exam</div>
                    <div className={styles.examYear}>{exam.academicYear}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Behavioral Marks Section */}
            {selectedExam && (
              <>
                <div className={styles.behavioralCard}>
                  <h3 className={styles.sectionTitle}>
                    <FaInfoCircle /> আচরণগত মূল্যায়ন (সর্বোচ্চ ২০ মার্ক)
                  </h3>
                  <div className={styles.behavioralGrid}>
                    <div className={styles.behavioralItem}>
                      <label>📅 উপস্থিতি</label>
                      <div className={styles.rangeInput}>
                        <input
                          type="number"
                          min={0}
                          max={attendanceDays.total}
                          value={attendanceDays.present}
                          onChange={(e) => {
                            let value = Number(e.target.value);
                            // ✅ Lock between 0 and total
                            if (value < 0) value = 0;
                            if (value > attendanceDays.total)
                              value = attendanceDays.total;
                            setAttendanceDays({
                              ...attendanceDays,
                              present: value,
                            });
                          }}
                        />
                        <span>/ {attendanceDays.total} দিন</span>
                      </div>
                      <span className={styles.marksPreview}>
                        মার্ক:{" "}
                        {(
                          (attendanceDays.present / attendanceDays.total) * 5 ||
                          0
                        ).toFixed(1)}
                        /৫
                      </span>
                    </div>

                    <div className={styles.behavioralItem}>
                      <label>👪 অভিভাবক সভা</label>
                      <div className={styles.rangeInput}>
                        <input
                          type="number"
                          min={0}
                          max={meetingAttendance.total}
                          value={meetingAttendance.total}
                          onChange={(e) => {
                            let value = Number(e.target.value);
                            if (isNaN(value)) value = 0;
                            if (value < 0) value = 0;
                            if (value > meetingAttendance.total)
                              value = meetingAttendance.total;
                            setMeetingAttendance({
                              ...meetingAttendance,
                              attended: value,
                            });
                          }}
                        />
                        <span>/ {meetingAttendance.total} টি</span>
                      </div>
                      <span className={styles.marksPreview}>
                        মার্ক:{" "}
                        {(
                          (meetingAttendance.attended /
                            meetingAttendance.total) *
                            5 || 0
                        ).toFixed(1)}
                        /৫
                      </span>
                    </div>

                    <div className={styles.behavioralItem}>
                      <label>💰 ফি প্রদান</label>
                      <div className={styles.rangeInput}>
                        <input
                          type="number"
                          min={0}
                          max={feeMonths.total}
                          value={feeMonths.total}
                          onChange={(e) => {
                            let value = Number(e.target.value);
                            // ✅ Lock between 0 and total
                            if (value < 0) value = 0;
                            if (value > feeMonths.total)
                              value = feeMonths.total;
                            setFeeMonths({
                              ...feeMonths,
                              paid: value,
                            });
                          }}
                        />
                        <span>/ {feeMonths.total} মাস</span>
                      </div>
                      <span className={styles.marksPreview}>
                        মার্ক:{" "}
                        {((feeMonths.paid / feeMonths.total) * 5 || 0).toFixed(
                          1,
                        )}
                        /৫
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subject Marks Entry */}
                <div className={styles.subjectsCard}>
                  <h3 className={styles.sectionTitle}>
                    <MdSubject /> বিষয়ভিত্তিক প্রাপ্ত নম্বর
                  </h3>

                  {classSubjects.map((subject) => {
                    const subjectMark = subjectMarks.find(
                      (m) => m.subjectId === subject._id,
                    );
                    const subjectResult = subjectMark
                      ? calculateSubjectResult(
                          subjectMark.academicMarks,
                          subjectMark.behavioralMarks,
                          subjectMark.disciplineMarks,
                          subject,
                        )
                      : null;

                    return (
                      <div key={subject._id} className={styles.subjectEntry}>
                        <div className={styles.subjectHeader}>
                          <div className={styles.subjectInfo}>
                            <strong>{subject.nameBn}</strong>
                            <span className={styles.subjectCode}>
                              {subject.code}
                            </span>
                          </div>
                          <div className={styles.subjectTotal}>
                            মোট: {subject.totalMarks}
                          </div>
                        </div>

                        <div className={styles.marksGrid}>
                          <SubjectMarksInput
                            label="একাডেমিক"
                            value={subjectMark?.academicMarks || 0}
                            maxValue={subject.academicMarks}
                            onChange={(value) =>
                              updateSubjectMark(
                                subject._id,
                                "academicMarks",
                                value,
                              )
                            }
                          />

                          {subject.behavioralMarks > 0 &&
                            subject.totalMarks > 50 && (
                              <SubjectMarksInput
                                label="বিহেভিওরাল"
                                value={subjectMark?.behavioralMarks || 0}
                                maxValue={subject.behavioralMarks}
                                onChange={(value) =>
                                  updateSubjectMark(
                                    subject._id,
                                    "behavioralMarks",
                                    value,
                                  )
                                }
                              />
                            )}

                          {subject.behavioralMarks > 0 &&
                            subject.totalMarks > 50 && (
                              <SubjectMarksInput
                                label="শৃঙ্খলা"
                                value={subjectMark?.disciplineMarks || 5}
                                maxValue={5}
                                onChange={(value) =>
                                  updateSubjectMark(
                                    subject._id,
                                    "disciplineMarks",
                                    value,
                                  )
                                }
                                step={0.5}
                              />
                            )}

                          {subjectResult && (
                            <div className={styles.subjectGrade}>
                              <span className={styles.gradeBadge}>
                                {subjectResult.grade}
                              </span>
                              <span className={styles.gpaBadge}>
                                জিপিএ: {subjectResult.gpa.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Card */}
                <div className={styles.summaryCard}>
                  <h3 className={styles.sectionTitle}>ফলাফলের সারসংক্ষেপ</h3>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <label>মোট বিষয়</label>
                      <span>{classSubjects.length} টি</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <label>মোট প্রাপ্ত নম্বর</label>
                      <span>{summary.totalObtained}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <label>মোট পূর্ণমান</label>
                      <span>{summary.totalMax}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <label>শতকরা হার</label>
                      <span>{summary.percentage.toFixed(2)}%</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <label>গ্রেড</label>
                      <span className={styles.finalGrade}>
                        {summary.grade.grade}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <label>জিপিএ</label>
                      <span>{summary.grade.gpa.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <div className={styles.formActions}>
                      <button
                        className={styles.previewBtn}
                        onClick={handlePreview}
                      >
                        <FaEye /> প্রিভিউ
                      </button>
                      <button
                        className={styles.submitBtn}
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                      >
                        <FaSave />{" "}
                        {isSubmitting ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {/* // Add modal in JSX */}
      {showPreview && previewData && (
        <ResultPreview
          data={previewData}
          onClose={() => setShowPreview(false)}
          onConfirm={() => {
            setShowPreview(false);
            handleSubmit(); // Call your submit function
          }}
        />
      )}
    </>
  );
};

export default CreateResult;
