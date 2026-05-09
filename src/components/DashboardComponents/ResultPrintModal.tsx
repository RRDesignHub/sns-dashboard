import React, { useEffect, useRef, useState } from "react";
import {
  FaUserGraduate,
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaIdCard,
  FaPrint,
  FaTimes,
  FaHandSparkles,
} from "react-icons/fa";
import { MdClass, MdSubject } from "react-icons/md";
import { useAxiosSecure } from "../../hooks/useAxiosSecure";
import styles from "../../styles/DashboardPages/ResultPrint.module.scss";
import Swal from "sweetalert2";
import type {
  ResultData,
  ResultPrintModalProps,
} from "../../types/ResultTypes";
import Loading from "../shared/Loading";

const ResultPrintModal: React.FC<ResultPrintModalProps> = ({
  resultId,
  onClose,
}) => {
  const axiosSecure = useAxiosSecure();
  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      const { data } = await axiosSecure.get(`/api/result/${resultId}`);
      setResult(data.data);
    } catch (error) {
      console.error("Error fetching result:", error);
      Swal.fire("ত্রুটি!", "ফলাফল লোড করতে ব্যর্থ হয়েছে", "error");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    // ১. অরিজিনাল টাইটেল সেভ করে রাখা (পিডিএফ ফাইলের নাম হিসেবে সেভ হবে)
    const originalTitle = document.title;
    document.title = `${result?.studentSnapshot.studentName} - ফলাফল`;

    // ২. ব্রাউজারের প্রিন্ট ডায়ালগ ওপেন করা
    // যেহেতু আমরা SCSS-এ @media print লিখেছি, ব্রাউজার অটোমেটিক বাকি সব হাইড করে দিবে
    window.print();

    // ৩. প্রিন্ট শেষ হলে টাইটেল আগের অবস্থায় ফিরিয়ে আনা
    document.title = originalTitle;
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!result) return null;

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
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2>ফলাফল প্রিভিউ</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Print Content */}
        <div className={styles.printContent} id="print-area">
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
              {/* উপস্থিতি - with present/total days */}
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

              {/* অভিভাবক সভা - with attended/total meetings */}
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

              {/* ফি প্রদান - with paid/total months */}
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

              {/* শৃঙ্খলা */}
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
                    // Calculate behavioral marks (only for 100-mark subjects)
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
                        <td className={styles.slNo}>{idx + 1}</td>

                        <td className={styles.subjectName}>{subject.nameBn}</td>

                        {/* Academic/Written Marks */}
                        <td className={styles.academicMarks}>
                          {subject.obtainedAcademic}/{subject.academicMarks}
                        </td>

                        {/* Behavioral Marks */}
                        <td className={styles.behavioralMarks}>
                          {subject.totalMarks === 100 ? (
                            <span>
                              {behavioralMarks}/{behavioralMax}
                            </span>
                          ) : (
                            <span className={styles.notApplicable}>—</span>
                          )}
                        </td>

                        {/* Total Obtained */}
                        <td className={styles.obtainedMarks}>
                          {subject.obtainedTotal}
                        </td>

                        {/* Total Marks */}
                        <td className={styles.totalMarks}>
                          {subject.totalMarks}
                        </td>

                        {/* Percentage */}
                        <td className={styles.percentage}>
                          {(
                            (subject.obtainedTotal / subject.totalMarks) *
                            100
                          ).toFixed(1)}
                          %
                        </td>

                        {/* Grade */}
                        <td className={styles.grade}>
                          <span
                            className={`${styles.gradeBadge} ${getGradeBadgeClass(subject.grade)}`}
                          >
                            {subject.grade}
                          </span>
                        </td>

                        {/* GPA */}
                        <td className={styles.gpa}>{subject.gpa}</td>
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

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.printBtn} onClick={handlePrint}>
            <FaPrint /> প্রিন্ট করুন
          </button>
          <button className={styles.closeModalBtn} onClick={onClose}>
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPrintModal;
