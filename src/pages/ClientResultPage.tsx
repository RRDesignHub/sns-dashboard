import React, { useState } from "react";
import {
  FaSearch,
  FaSpinner,
  FaUserGraduate,
  FaAward,
  FaBookOpen,
  FaChevronDown,
  FaChartLine,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "../styles/ClientPagesStyles/ClientResultPages.module.scss";

const ClientResultPage = () => {
  const [className, setClassName] = useState("");
  const [classRoll, setClassRoll] = useState("");
  const [examName, setExamName] = useState("3rd Semester");
  const [academicYear, setAcademicYear] = useState("2026");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const classes = [
    { label: "প্লে", value: "Play" },
    { label: "নার্সারি", value: "Nursery" },
    { label: "প্রথম শ্রেণি", value: "1" },
    { label: "দ্বিতীয় শ্রেণি", value: "2" },
    { label: "তৃতীয় শ্রেণি", value: "3" },
    { label: "চতুর্থ শ্রেণি", value: "4" },
    { label: "পঞ্চম শ্রেণি", value: "5" },
  ];

  const exams = [
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
  ];

  const handleSearch = async () => {
    if (!className) {
      Swal.fire("সতর্কতা!", "শ্রেণি নির্বাচন করুন", "warning");
      return;
    }
    if (!classRoll.trim()) {
      Swal.fire("সতর্কতা!", "রোল নম্বর লিখুন", "warning");
      return;
    }
    if (!examName) {
      Swal.fire("সতর্কতা!", "পরীক্ষার নাম নির্বাচন করুন", "warning");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/api/result/public-search`,
        {
          params: {
            className,
            classRoll: classRoll.trim(),
            examName,
            academicYear,
          },
        },
      );

      if (data.success && data.data) {
        setResult(data.data);

        setTimeout(() => {
          document
            .getElementById("result-anchor")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        Swal.fire({
          icon: "info",
          title: "পাওয়া যায়নি",
          text: "এই তথ্য অনুযায়ী কোনো ফলাফল পাওয়া যায়নি।",
          confirmButtonColor: "#166534",
        });
      }
    } catch (error: any) {
      // Handle different error scenarios
      if (error.response?.status === 404) {
        Swal.fire({
          icon: "info",
          title: "পাওয়া যায়নি",
          text:
            error.response?.data?.message ||
            "শ্রেণি, রোল ও পরীক্ষার নাম সঠিকভাবে যাচাই করুন।",
          confirmButtonColor: "#166534",
        });
      } else if (error.response?.status === 400) {
        Swal.fire({
          icon: "warning",
          title: "তথ্য অসম্পূর্ণ",
          text:
            error.response?.data?.message ||
            "সব প্রয়োজনীয় তথ্য সঠিকভাবে দিন।",
          confirmButtonColor: "#166534",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "সার্ভার ত্রুটি",
          text: "ফলাফল আনতে ব্যর্থ হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।",
          confirmButtonColor: "#166534",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setClassName("");
    setClassRoll("");
    setExamName("3rd Semester");
    setResult(null);
  };

  return (
    <div className={styles.resultPage}>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>পরীক্ষার ফলাফল</h1>
        <p className={styles.heroSubtitle}>
          শিক্ষার্থীর শ্রেণি, রোল এবং পরীক্ষা নির্বাচন করে ফলাফল দেখুন
        </p>
        <div className={styles.heroDecor}></div>
      </section>

      {/* ============ SEARCH CARD ============ */}
      <section className={styles.searchSection}>
        <div className={styles.searchCard}>
          <div className={styles.searchCardHeader}>
            <div className={styles.searchCardIcon}>
              <FaSearch />
            </div>
            <h2>ফলাফল অনুসন্ধান</h2>
          </div>

          <div className={styles.searchGrid}>
            {/* Class */}
            <div className={styles.fieldGroup}>
              <label htmlFor="class">
                শ্রেণি <span className={styles.required}>*</span>
              </label>
              <div className={styles.selectWrap}>
                <select
                  id="class"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                >
                  <option value="">-- শ্রেণি নির্বাচন করুন --</option>
                  {classes.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <FaChevronDown className={styles.selectArrow} />
              </div>
            </div>

            {/* Roll */}
            <div className={styles.fieldGroup}>
              <label htmlFor="roll">
                রোল নম্বর <span className={styles.required}>*</span>
              </label>
              <input
                id="roll"
                type="number"
                min={0}
                inputMode="numeric"
                value={classRoll}
                onChange={(e) => setClassRoll(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="যেমন: ৮"
              />
            </div>

            {/* Exam */}
            <div className={styles.fieldGroup}>
              <label htmlFor="exam">
                পরীক্ষার নাম <span className={styles.required}>*</span>
              </label>
              <div className={styles.selectWrap}>
                <select
                  id="exam"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                >
                  {exams.map((ex) => (
                    <option key={ex} value={ex}>
                      {ex}
                    </option>
                  ))}
                </select>
                <FaChevronDown className={styles.selectArrow} />
              </div>
            </div>

            {/* search button */}
            <div className={styles.fieldGroup}>
              <label htmlFor="exam">
                <span className={styles.required}>*</span>
              </label>
              <button
                className={styles.searchBtn}
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className={styles.spin} /> খোঁজা হচ্ছে...
                  </>
                ) : (
                  <>
                    <FaSearch /> ফলাফল দেখুন
                  </>
                )}
              </button>

              {result && (
                <button className={styles.resetBtn} onClick={handleReset}>
                  নতুনভাবে খুঁজুন
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ RESULT DISPLAY ============ */}
      {result && (
        <section id="result-anchor" className={styles.resultSection}>
          <div className={styles.resultCard}>
            {/* Ribbon / Header */}
            <div className={styles.resultRibbon}>
              <div className={styles.ribbonLeft}>
                <div className={styles.avatarBadge}>
                  <FaUserGraduate />
                </div>
                <div>
                  <h2>{result.studentSnapshot.studentName}</h2>
                  <p>
                    {result.examSnapshot.name} Exam• {academicYear}
                  </p>
                </div>
              </div>
            </div>

            {/* Student Info Grid */}
            <div className={styles.infoStrip}>
              <div className={styles.infoCell}>
                <span>শ্রেণি</span>
                <strong>{result.studentSnapshot.className}</strong>
              </div>
              <div className={styles.infoCell}>
                <span>রোল</span>
                <strong>{result.studentSnapshot.classRoll}</strong>
              </div>

              <div className={styles.infoCell}>
                <span>পরীক্ষা</span>
                <strong>{result.examSnapshot.name}</strong>
              </div>
              <div className={styles.infoCell}>
                <span>শিক্ষাবর্ষ</span>
                <strong>{academicYear}</strong>
              </div>
            </div>

            {/* Subjects Table */}
            <div className={styles.tableBlock}>
              <div className={styles.tableBlockHeader}>
                <FaBookOpen />
                <h3>বিষয়ভিত্তিক ফলাফল</h3>
              </div>
              <div className={styles.tableScroll}>
                <table className={styles.subjectTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>বিষয়</th>
                      <th>প্রাপ্ত</th>
                      <th>মোট</th>
                      <th>গ্রেড</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.subjectResults.map((s: any, i: number) => (
                      <tr key={i}>
                        <td className={styles.slNo}>{i + 1}</td>
                        <td className={styles.subjectName}>{s.nameBn}</td>
                        <td className={styles.marks}>{s.obtainedTotal}</td>
                        <td className={styles.marks}>{s.totalMarks}</td>
                        <td className={styles.gpaParent}>
                          <span
                            className={`${styles.gradeChip} ${
                              s.grade === "F"
                                ? styles.gradeFail
                                : styles.gradePass
                            }`}
                          >
                            {s.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ✅ NEW: Head Teacher's Message */}
            {result.headTeacherMessage && (
              <div
                className={`${styles.teacherMessageCard} ${
                  result.summary.isPassed
                    ? styles.teacherPass
                    : styles.teacherFail
                }`}
              >
                <div className={styles.teacherMessageDecor}></div>

                <div className={styles.teacherMessageHeader}>
                  <div className={styles.teacherMessageIcon}>
                    <img
                      src="https://i.ibb.co.com/3ySTt4gN/Hasan-Sir.jpg"
                      alt="Head_Teacer_Img"
                      className={styles.headTeacherImg}
                    />
                  </div>
                  <div>
                    <h3>প্রধান শিক্ষকের বাণী</h3>
                    <p>Head Teacher's Note</p>
                  </div>
                </div>

                <blockquote className={styles.teacherMessageQuote}>
                  "{result.headTeacherMessage}"
                </blockquote>

                <div className={styles.teacherMessageSignature}>
                  <div className={styles.teacherSignatureLine}></div>
                  <span>— প্রধান শিক্ষক,</span>
                  <span>মোঃ আবুল হাসান</span>
                </div>
              </div>
            )}

            {/* Summary Strip */}
            <div className={styles.summaryStrip}>
              {/* Total Marks */}
              <div className={`${styles.summaryBox} ${styles.boxMarks}`}>
                <div className={styles.summaryIcon}>
                  <FaBookOpen />
                </div>
                <div className={styles.summaryContent}>
                  <span>মোট প্রাপ্ত</span>
                  <strong>
                    {result.summary.totalObtainedMarks}
                    <small>/{result.summary.totalMaxMarks}</small>
                  </strong>
                </div>
                <div className={styles.summaryAccent}></div>
              </div>

              {/* Percentage */}
              <div className={`${styles.summaryBox} ${styles.boxPercent}`}>
                <div className={styles.summaryIcon}>
                  <FaChartLine />
                </div>
                <div className={styles.summaryContent}>
                  <span>শতকরা হার</span>
                  <strong>
                    {result.summary.overallPercentage}
                    <small>%</small>
                  </strong>
                </div>
                <div className={styles.summaryAccent}></div>
              </div>

              {/* Grade */}
              <div className={`${styles.summaryBox} ${styles.boxGrade}`}>
                <div className={styles.summaryIcon}>
                  <FaAward />
                </div>
                <div className={styles.summaryContent}>
                  <span>গ্রেড</span>
                  <strong>{result.summary.finalGrade}</strong>
                </div>
                <div className={styles.summaryAccent}></div>
              </div>

              {/* GPA */}
              <div className={`${styles.summaryBox} ${styles.boxGpa}`}>
                <div className={styles.summaryIcon}>
                  <FaStar />
                </div>
                <div className={styles.summaryContent}>
                  <span>জিপিএ</span>
                  <strong>{result.summary.averageGPA}</strong>
                </div>
                <div className={styles.summaryAccent}></div>
              </div>

              {/* Status (Pass/Fail) */}
              <div
                className={`${styles.summaryBox} ${styles.summaryStatus} ${
                  result.summary.isPassed ? styles.pass : styles.fail
                }`}
              >
                <div className={styles.summaryIcon}>
                  {result.summary.isPassed ? (
                    <FaCheckCircle />
                  ) : (
                    <FaTimesCircle />
                  )}
                </div>
                <div className={styles.summaryContent}>
                  <span>ফলাফল</span>
                  <strong>{result.summary.isPassed ? "পাস" : "ফেল"}</strong>
                </div>
                <div className={styles.summaryAccent}></div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ClientResultPage;
