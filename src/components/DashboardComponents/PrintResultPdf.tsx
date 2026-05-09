import React from "react";
import {
  FaUserGraduate,
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaIdCard,
  FaHandSparkles,
} from "react-icons/fa";
import { MdClass, MdSubject } from "react-icons/md";
import styles from "../../styles/DashboardPages/ResultPrint.module.scss";
import type { ResultData } from "../../types/ResultTypes";

interface ResultPrintComponentProps {
  result: ResultData;
}

const ResultPrintComponent = React.forwardRef<
  HTMLDivElement,
  ResultPrintComponentProps
>(({ result }, ref) => {
  const getGradeBadgeClass = (grade: string) => {
    if (grade === "A+") return styles.gradeAplus;
    if (grade === "A") return styles.gradeA;
    if (grade === "A-") return styles.gradeAminus;
    if (grade === "B") return styles.gradeB;
    if (grade === "C") return styles.gradeC;
    if (grade === "D") return styles.gradeD;
    return styles.gradeF;
  };

  return (
    <div ref={ref} className={styles.printContainer}>
      {/* School Header */}
      <div className={styles.schoolHeader}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Logo" />
        </div>
        <div>
          <h1>শাহ নেয়ামত (রহ:) কেজি ও হাই স্কুল</h1>
          <p className={styles.address}>
            1no Board Bazar, Charlakshya, Karnafully, Ctg.
          </p>
        </div>
      </div>

      <div className={styles.divider}></div>

      {/* Result Title */}
      <div className={styles.resultTitle}>
        <h2>
          {result.examSnapshot.name} পরীক্ষার ফলাফল - {result.academicYear}
        </h2>
      </div>

      {/* Student Info Card */}
      <div className={styles.infoCard}>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <FaUserGraduate />
            <div>
              <label>শিক্ষার্থীর নাম</label>
              <span>{result.studentSnapshot.studentName}</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <MdClass />
            <div>
              <label>শ্রেণি</label>
              <span>{result.studentSnapshot.className}</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <FaIdCard />
            <div>
              <label>রোল নম্বর</label>
              <span>{result.studentSnapshot.classRoll}</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <FaIdCard />
            <div>
              <label>শিক্ষার্থী আইডি</label>
              <span>{result.studentSnapshot.studentId}</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <FaCalendarAlt />
            <div>
              <label>শিক্ষাবর্ষ</label>
              <span>{result.academicYear}</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <FaChartLine />
            <div>
              <label>পরীক্ষার ধরণ</label>
              <span>
                {result.examSnapshot.examType === "semester"
                  ? "সেমিস্টার"
                  : "বার্ষিক"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Behavioral Marks Section */}
      <div className={styles.behavioralSection}>
        <h3>
          <FaHandSparkles /> আচরণগত মূল্যায়ন (সর্বোচ্চ ২০ মার্ক)
        </h3>
        <div className={styles.behavioralGrid}>
          <div className={styles.behavioralItem}>
            <span>📅 উপস্থিতি</span>
            <div className={styles.behavioralDetails}>
              <span className={styles.behavioralStats}>
                {result.behavioralData.attendance.present}/
                {result.behavioralData.attendance.total} দিন
              </span>
              <span className={styles.behavioralMark}>
                {result.behavioralData.attendance.marks}/৫
              </span>
            </div>
          </div>

          <div className={styles.behavioralItem}>
            <span>👪 অভিভাবক সভা</span>
            <div className={styles.behavioralDetails}>
              <span className={styles.behavioralStats}>
                {result.behavioralData.meetings.attended}/
                {result.behavioralData.meetings.total} টি
              </span>
              <span className={styles.behavioralMark}>
                {result.behavioralData.meetings.marks}/৫
              </span>
            </div>
          </div>

          <div className={styles.behavioralItem}>
            <span>💰 ফি প্রদান</span>
            <div className={styles.behavioralDetails}>
              <span className={styles.behavioralStats}>
                {result.behavioralData.fees.paid}/
                {result.behavioralData.fees.total} মাস
              </span>
              <span className={styles.behavioralMark}>
                {result.behavioralData.fees.marks}/৫
              </span>
            </div>
          </div>

          <div className={styles.behavioralItem}>
            <span>🎯 শৃঙ্খলা</span>
            <div className={styles.behavioralDetails}>
              <span className={styles.behavioralMark}>
                {result.behavioralData.discipline.marks}/৫
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Results Table */}
      <div className={styles.subjectSection}>
        <h3>
          <MdSubject /> বিষয়ভিত্তিক ফলাফল
        </h3>
        <div className={styles.tableWrapper}>
          <table className={styles.resultTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>বিষয়</th>
                <th>লিখিত</th>
                <th>আচরণগত</th>
                <th>মোট প্রাপ্ত</th>
                <th>মোট নম্বর</th>
                <th>শতকরা</th>
                <th>গ্রেড</th>
                <th>জিপিএ</th>
              </tr>
            </thead>
            <tbody>
              {result.subjectResults.map((subject, idx) => {
                const behavioralMarks =
                  subject.totalMarks === 100
                    ? subject.obtainedTotal - subject.obtainedAcademic
                    : 0;
                const behavioralMax =
                  subject.totalMarks === 100
                    ? subject.totalMarks - subject.academicMarks
                    : 0;

                return (
                  <tr key={subject.subjectId}>
                    <td>{idx + 1}</td>
                    <td className={styles.subjectName}>{subject.nameBn}</td>
                    <td>
                      {subject.obtainedAcademic}/{subject.academicMarks}
                    </td>
                    <td>
                      {subject.totalMarks === 100 ? (
                        `${behavioralMarks}/${behavioralMax}`
                      ) : (
                        <span className={styles.notApplicable}>—</span>
                      )}
                    </td>
                    <td className={styles.obtainedMarks}>
                      {subject.obtainedTotal}
                    </td>
                    <td>{subject.totalMarks}</td>
                    <td>
                      {(
                        (subject.obtainedTotal / subject.totalMarks) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                    <td>
                      <span
                        className={`${styles.gradeBadge} ${getGradeBadgeClass(subject.grade)}`}
                      >
                        {subject.grade}
                      </span>
                    </td>
                    <td>{subject.gpa}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className={styles.totalRow}>
                <td colSpan={4}>
                  <strong>সর্বমোট</strong>
                </td>
                <td>
                  <strong>{result.summary.totalObtainedMarks}</strong>
                </td>
                <td>
                  <strong>{result.summary.totalMaxMarks}</strong>
                </td>
                <td>
                  <strong>{result.summary.overallPercentage}%</strong>
                </td>
                <td>
                  <strong>{result.summary.finalGrade}</strong>
                </td>
                <td>
                  <strong>{result.summary.averageGPA}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Summary Card */}
      <div className={styles.summarySection}>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <label>মোট বিষয়</label>
            <span>{result.summary.totalSubjects} টি</span>
          </div>
          <div className={styles.summaryItem}>
            <label>পাসের হার</label>
            <span>
              {result.summary.passedSubjects}/{result.summary.totalSubjects}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <label>সামগ্রিক শতকরা</label>
            <span>{result.summary.overallPercentage}%</span>
          </div>
          <div className={styles.summaryItem}>
            <label>চূড়ান্ত গ্রেড</label>
            <span
              className={`${styles.finalGrade} ${getGradeBadgeClass(result.summary.finalGrade)}`}
            >
              {result.summary.finalGrade}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <label>গড় জিপিএ</label>
            <span>{result.summary.averageGPA}</span>
          </div>
          <div className={styles.summaryItem}>
            <label>ফলাফল</label>
            <span
              className={
                result.summary.isPassed ? styles.passed : styles.failed
              }
            >
              {result.summary.isPassed ? (
                <>
                  <FaCheckCircle /> পাস
                </>
              ) : (
                <>
                  <FaTimesCircle /> ফেল
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.signatureSection}>
          <div className={styles.signature}>
            <div className={styles.signatureLine}></div>
            <p>শিক্ষক স্বাক্ষর</p>
          </div>
          <div className={styles.signature}>
            <div className={styles.signatureLine}></div>
            <p>প্রধান শিক্ষকের স্বাক্ষর</p>
          </div>
          <div className={styles.dateStamp}>
            <div className={styles.signatureLine}></div>
            <p>তারিখ</p>
          </div>
        </div>
        <div className={styles.seal}>
          <div className={styles.stamp}>প্রাতিষ্ঠানিক সিল</div>
        </div>
      </div>
    </div>
  );
});

ResultPrintComponent.displayName = "ResultPrintComponent";

export default ResultPrintComponent;
