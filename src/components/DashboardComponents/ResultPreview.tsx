import React from "react";
import {
  FaUserGraduate,
  FaChartLine,
  FaBook,
  FaAward,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import styles from "../../styles/components/ResultPreview.module.scss";

interface PreviewData {
  student: {
    studentName: string;
    className: string;
    classRoll: number;
    studentId: string;
  };
  exam: {
    nameBn: string;
    academicYear: string;
  };
  behavioral: {
    attendance: { marks: string };
    meetings: { marks: string };
    fees: { marks: string };
    totalBehavioralMarks: string;
  };
  subjects: Array<{
    subjectName: string;
    subjectCode: string;
    academicObtained: number;
    academicMax: number;
    behavioralObtained: number;
    behavioralMax: number;
    disciplineObtained: number;
    totalObtained: number;
    totalMax: number;
    percentage: string;
    grade: string;
    gpa: string;
  }>;
  summary: {
    totalObtained: number;
    totalMax: number;
    percentage: string;
    grade: string;
    gpa: string;
  };
}

interface ResultPreviewProps {
  data: PreviewData;
  onClose: () => void;
  onConfirm: () => void;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({
  data,
  onClose,
  onConfirm,
}) => {
  const isPassed = data.summary.grade !== "F";

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <FaAward />
          </div>
          <h2>ফলাফলের প্রিভিউ</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Student Info Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <FaUserGraduate /> শিক্ষার্থীর তথ্য
            </h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>নাম:</span>
                <span className={styles.value}>{data.student.studentName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>শ্রেণি:</span>
                <span className={styles.value}>{data.student.className}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>রোল:</span>
                <span className={styles.value}>{data.student.classRoll}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>আইডি:</span>
                <span className={styles.value}>{data.student.studentId}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>পরীক্ষা:</span>
                <span className={styles.value}>
                  {data.exam.name} ({data.exam.academicYear})
                </span>
              </div>
            </div>
          </div>

          {/* Behavioral Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <FaChartLine /> আচরণগত মূল্যায়ন
            </h3>
            <div className={styles.behavioralGrid}>
              <div className={styles.behavioralItem}>
                <span className={styles.behavioralLabel}>📅 উপস্থিতি</span>
                <div className={styles.behavioralBar}>
                  <div
                    className={styles.behavioralFill}
                    style={{
                      width: `${(parseFloat(data.behavioral.attendance.marks) / 5) * 100}%`,
                    }}
                  />
                </div>
                <span className={styles.behavioralMark}>
                  {data.behavioral.attendance.marks}/৫
                </span>
              </div>
              <div className={styles.behavioralItem}>
                <span className={styles.behavioralLabel}>👪 অভিভাবক সভা</span>
                <div className={styles.behavioralBar}>
                  <div
                    className={styles.behavioralFill}
                    style={{
                      width: `${(parseFloat(data.behavioral.meetings.marks) / 5) * 100}%`,
                    }}
                  />
                </div>
                <span className={styles.behavioralMark}>
                  {data.behavioral.meetings.marks}/৫
                </span>
              </div>
              <div className={styles.behavioralItem}>
                <span className={styles.behavioralLabel}>💰 ফি প্রদান</span>
                <div className={styles.behavioralBar}>
                  <div
                    className={styles.behavioralFill}
                    style={{
                      width: `${(parseFloat(data.behavioral.fees.marks) / 5) * 100}%`,
                    }}
                  />
                </div>
                <span className={styles.behavioralMark}>
                  {data.behavioral.fees.marks}/৫
                </span>
              </div>
            </div>
            <div className={styles.behavioralTotal}>
              মোট আচরণগত মার্ক:{" "}
              <strong>{data.behavioral.totalBehavioralMarks}/২০</strong>
            </div>
          </div>

          {/* Subjects Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <FaBook /> বিষয়ভিত্তিক ফলাফল
            </h3>
            <div className={styles.subjectsTable}>
              <div className={styles.tableHeader}>
                <span>বিষয়</span>
                <span>একাডেমিক</span>
                <span>বিহেভিওরাল</span>
                <span>শৃঙ্খলা</span>
                <span>মোট</span>
                <span>গ্রেড</span>
                <span>জিপিএ</span>
              </div>
              {data.subjects.map((subject, idx) => (
                <div key={idx} className={styles.tableRow}>
                  <span className={styles.subjectName}>
                    <strong>{subject.subjectName}</strong>
                    <small>{subject.subjectCode}</small>
                  </span>
                  <span>
                    {subject.academicObtained}/{subject.academicMax}
                  </span>
                  <span>
                    {subject.behavioralObtained}/{subject.behavioralMax}
                  </span>
                  <span>{subject.disciplineObtained}/৫</span>
                  <span className={styles.totalMarks}>
                    {subject.totalObtained}/{subject.totalMax}
                  </span>
                  <span
                    className={
                      subject.grade === "F"
                        ? styles.failGrade
                        : styles.passGrade
                    }
                  >
                    {subject.grade}
                  </span>
                  <span>{subject.gpa}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <div className={`${styles.section} ${styles.summarySection}`}>
            <h3 className={styles.sectionTitle}>সারসংক্ষেপ</h3>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>মোট প্রাপ্ত নম্বর</span>
                <span className={styles.summaryValue}>
                  {data.summary.totalObtained}/{data.summary.totalMax}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>শতকরা হার</span>
                <span className={styles.summaryValue}>
                  {data.summary.percentage}%
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>গ্রেড</span>
                <span
                  className={`${styles.summaryGrade} ${isPassed ? styles.passed : styles.failed}`}
                >
                  {data.summary.grade}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>জিপিএ</span>
                <span className={styles.summaryValue}>{data.summary.gpa}</span>
              </div>
            </div>
            <div className={styles.resultStatus}>
              {isPassed ? (
                <>
                  <FaCheckCircle /> ফলাফল: পাশ
                </>
              ) : (
                <>
                  <FaTimesCircle /> ফলাফল: ফেল
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            বাতিল করুন
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            নিশ্চিত করুন ও সংরক্ষণ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPreview;
