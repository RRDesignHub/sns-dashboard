import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaSearch,
  FaTrash,
  FaPrint,
  FaDownload,
  FaFilter,
  FaSchool,
  FaCalendarAlt,
  FaGraduationCap,
} from "react-icons/fa";
import { MdClass } from "react-icons/md";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";
import styles from "../../../styles/DashboardPages/CLassBasedResult.module.scss";
import Swal from "sweetalert2";
import type {
  ResultListItem,
  ResultFilters,
} from "../../../types/ClassBasedResult";

const ClassBasedResults: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  // Filter states
  const [filters, setFilters] = useState<ResultFilters>({
    className: "",
    academicYear: new Date().getFullYear().toString(),
    examId: "",
    status: "",
  });

  const classes = [
    { id: "Play", name: "Play", dbValue: "Play" },
    { id: "Nursery", name: "Nursery", dbValue: "Nursery" },
    { id: "1", name: "Class 1", dbValue: "1" },
    { id: "2", name: "Class 2", dbValue: "2" },
    { id: "3", name: "Class 3", dbValue: "3" },
    { id: "4", name: "Class 4", dbValue: "4" },
    { id: "5", name: "Class 5", dbValue: "5" },
    { id: "6", name: "Class 6", dbValue: "6" },
    { id: "7", name: "Class 7", dbValue: "7" },
    { id: "8", name: "Class 8", dbValue: "8" },
    { id: "9", name: "Class 9", dbValue: "9" },
    { id: "10", name: "Class 10", dbValue: "10" },
  ];

  // When sending filter, use dbValue
  const handleFilterChange = (key: keyof ResultFilters, value: string) => {
    if (key === "className") {
      const selectedClass = classes.find((c) => c.id === value);
      setFilters((prev) => ({
        ...prev,
        className: selectedClass?.dbValue || "",
      }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };
  // Available academic years (last 5 years including current)
  const academicYears = ["2026", "2025", "2024", "2023", "2022"];

  // Available exams (fetched based on class)
  const { data: exams = [] } = useQuery({
    queryKey: ["exams", filters.className],
    queryFn: async () => {
      if (!filters.className) return [];
      const { data } = await axiosSecure.get("/api/exams/class", {
        params: {
          className: filters.className,
          academicYear: filters.academicYear,
        },
      });
      return data.data || [];
    },
    enabled: !!filters.className,
  });

  // Fetch results based on filters
  const {
    data: results = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["results", filters],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/result/filter", {
        params: {
          className: filters.className,
          academicYear: filters.academicYear,
          examId: filters.examId || undefined,
          status: filters.status || undefined,
        },
      });
      return data.data || [];
    },
    enabled: !!filters.className && !!filters.academicYear,
  });

  // Delete result mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosSecure.delete(`/api/result/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      Swal.fire("সফল!", "ফলাফল মুছে ফেলা হয়েছে", "success");
    },
    onError: (error: any) => {
      Swal.fire(
        "ত্রুটি!",
        error.response?.data?.message || "মুছতে ব্যর্থ হয়েছে",
        "error",
      );
    },
  });

  // Handle delete
  const handleDelete = (result: ResultListItem) => {
    const id = result._id;
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `${result.studentName} এর ফলাফল মুছে যাবে!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#16a34a",
      confirmButtonText: "হ্যাঁ, মুছুন",
      cancelButtonText: "বাতিল করুন",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const getPrintHTML = (result: any) => {
    // Calculate behavioral marks as integers
    const attendanceMark = Math.round(result.behavioralData.attendance.marks);
    const meetingMark = Math.round(result.behavioralData.meetings.marks);
    const feeMark = Math.round(result.behavioralData.fees.marks);
    const disciplineMark = Math.round(result.behavioralData.discipline.marks);
    const totalBehavioral =
      attendanceMark + meetingMark + feeMark + disciplineMark;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${result.studentSnapshot.studentName} - ফলাফল</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Nikosh', 'Siyam Rupali', 'Bangla', 'Noto Sans Bengali', Arial, sans-serif;
          padding: 10px;
          background: white;
          font-size: 11px;
        }
        
        .print-container {
          max-width: 100%;
          margin: 0 auto;
          background: white;
        }
        
        /* School Header - Compact */
        .school-header {
          text-align: center;
          border-bottom: 1px solid #166534;
          padding-bottom: 8px;
          margin-bottom: 10px;
        }
        
        .school-name {
          font-size: 16px;
          font-weight: bold;
          color: #166534;
        }
        
        .school-address {
          font-size: 9px;
          color: #555;
        }
        
        .result-title {
          font-size: 12px;
          font-weight: bold;
          margin-top: 5px;
        }
        
        .result-subtitle {
          font-size: 10px;
          color: #333;
        }
        
        /* Section Styles - Compact */
        .section {
          margin-bottom: 12px;
        }
        
        .section-title {
          font-size: 12px;
          font-weight: bold;
          color: #166534;
          border-left: 3px solid #166534;
          padding-left: 8px;
          margin-bottom: 8px;
        }
        
        /* Info Grid - Compact 4 columns */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          background: #f8fafc;
          padding: 8px;
          border-radius: 4px;
        }
        
        .info-item {
          display: flex;
          align-items: center;
          font-size: 10px;
        }
        
        .info-label {
          font-weight: bold;
          width: 65px;
        }
        
        /* Behavioral Grid - Compact 2x2 Table */
        .behavioral-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 8px;
        }
        
        .behavioral-table td {
          border: 1px solid #ddd;
          padding: 4px 6px;
          font-size: 10px;
        }
        
        .behavioral-label {
          font-weight: bold;
          width: 40%;
        }
        
        .behavioral-value {
          text-align: center;
          width: 10%;
          font-weight: bold;
          color: #166534;
        }
        
        .behavioral-total {
          text-align: right;
          padding: 6px;
          background: #f0fdf4;
          font-weight: bold;
          font-size: 10px;
        }
        
        /* Subject Table - Compact */
        .subjects-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
        }
        
        .subjects-table th,
        .subjects-table td {
          border: 1px solid #d1d5db;
          padding: 4px 4px;
          text-align: center;
        }
        
        .subjects-table th {
          background: #f3f4f6;
          font-weight: bold;
          font-size: 9px;
        }
        
        .subject-name {
          text-align: left;
          font-weight: bold;
        }
        
        .pass-grade {
          color: #16a34a;
          font-weight: bold;
        }
        
        .fail-grade {
          color: #dc2626;
          font-weight: bold;
        }
        
        /* Summary - Simple No BG */
        .summary-section {
          margin-top: 10px;
          padding: 8px 0;
          border-top: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          text-align: center;
          font-size: 10px;
        }
        
        .summary-label {
          font-weight: bold;
          display: block;
        }
        
        .result-status {
          text-align: center;
          margin-top: 8px;
          font-size: 10px;
          font-weight: bold;
        }
        
        /* Signature Section - Compact */
        .signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        
        .signature-box {
          text-align: center;
          width: 120px;
        }
        
        .signature-line {
          border-top: 1px solid #000;
          margin-top: 25px;
          margin-bottom: 4px;
        }
        
        .signature-title {
          font-size: 8px;
          color: #555;
        }
        
        /* Seal - Smaller */
        .school-seal {
          text-align: center;
          margin-top: 15px;
        }
        
        .seal {
          display: inline-block;
          border: 1px solid #dc2626;
          border-radius: 50%;
          padding: 4px 12px;
          color: #dc2626;
          font-weight: bold;
          font-size: 8px;
          transform: rotate(-5deg);
        }
        
        .footer-note {
          text-align: center;
          margin-top: 10px;
          font-size: 7px;
          color: #999;
        }
        
        @media print {
          body {
            padding: 0;
            margin: 0;
          }
          @page {
            size: A4;
            margin: 8mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-container">
        <!-- School Header -->
        <div class="school-header">
          <div class="school-name">শাহ নেয়ামত (রহ:) কেজি এন্ড হাই স্কুল</div>
          <div class="school-address">১নং বোর্ড বাজার, চরলক্ষ্যা, কর্ণফুলী, চট্টগ্রাম</div>
          <div class="result-subtitle">${result.examSnapshot.name} পরীক্ষা - ${result.academicYear}</div>
        </div>

        <!-- Student Info Section - Compact 4 Column -->
        <div class="section">
          <div class="info-grid">
            <div class="info-item"><span class="info-label">নাম:</span><span>${result.studentSnapshot.studentName}</span></div>
            <div class="info-item"><span class="info-label">শ্রেণি:</span><span>${result.studentSnapshot.className}</span></div>
            <div class="info-item"><span class="info-label">রোল:</span><span>${result.studentSnapshot.classRoll}</span></div>
            <div class="info-item"><span class="info-label">আইডি:</span><span>${result.studentSnapshot.studentId}</span></div>
          </div>
        </div>

        <!-- Behavioral Section - 2x2 Table Format -->
        <div class="section">
          <div class="section-title">আচরণগত মূল্যায়ন (সর্বোচ্চ ২০ মার্ক)</div>
          <table class="behavioral-table">
            <tr>
              <td class="behavioral-label">📅 উপস্থিতি | ${result.behavioralData.attendance.present}/${result.behavioralData.attendance.total}</td>
              <td class="behavioral-value">${attendanceMark}/5</td>
              <td class="behavioral-label">👪 অভিভাবক সভা</td>
              <td class="behavioral-value">${meetingMark}/5</td>
            </tr>
            <tr>
              <td class="behavioral-label">💰 ফি প্রদান</td>
              <td class="behavioral-value">${feeMark}/5</td>
              <td class="behavioral-label">🎯 শৃঙ্খলা</td>
              <td class="behavioral-value">${disciplineMark}/5</td>
            </tr>
            <tr>
              <td colspan="3" class="behavioral-total">মোট আচরণগত মার্ক:</td>
              <td class="behavioral-value">${totalBehavioral}/20</td>
            </tr>
          </table>
        </div>

        <!-- Subject Results Table -->
        <div class="section">
          <div class="section-title">বিষয়ভিত্তিক ফলাফল</div>
          <table class="subjects-table">
            <thead>
              <tr>
                <th>#</th>
                <th>বিষয়</th>
                <th>প্রাপ্ত</th>
                <th>মোট</th>
                <th>গ্রেড</th>
                <th>জিপিএ</th>
              </tr>
            </thead>
            <tbody>
              ${result.subjectResults
                .map(
                  (subject: any, idx: number) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td class="subject-name">${subject.nameBn}</td>
                  <td>${subject.obtainedTotal}</td>
                  <td>${subject.totalMarks}</td>
                  <td class="${subject.grade === "F" ? "fail-grade" : "pass-grade"}">${subject.grade}</td>
                  <td>${subject.gpa}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr style="background: #f3f4f6; font-weight: bold;">
                <td colspan="2">সর্বমোট</td>
                <td>${result.summary.totalObtainedMarks}</td>
                <td>${result.summary.totalMaxMarks}</td>
                <td>${result.summary.finalGrade}</td>
                <td>${result.summary.averageGPA}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Summary Section - Simple No BG -->
        <div class="summary-section">
          <div class="summary-grid">
            <div><span class="summary-label">মোট প্রাপ্ত</span><span>${result.summary.totalObtainedMarks}/${result.summary.totalMaxMarks}</span></div>
            <div><span class="summary-label">শতকরা</span><span>${result.summary.overallPercentage}%</span></div>
            <div><span class="summary-label">গ্রেড</span><span>${result.summary.finalGrade}</span></div>
            <div><span class="summary-label">জিপিএ</span><span>${result.summary.averageGPA}</span></div>
          </div>
          <div class="result-status">ফলাফল: ${result.summary.isPassed ? "পাস" : "ফেল"}</div>
        </div>

        <!-- Signature Section -->
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-title">শ্রেণি শিক্ষক</div>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-title">অভিভাবক</div>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-title">প্রধান শিক্ষক</div>
          </div>
        </div>

        <!-- School Seal -->
        <div class="school-seal">
          <div class="seal">প্রাতিষ্ঠানিক সিল</div>
        </div>
        
        <!-- Footer Note -->
        <div class="footer-note">
          এই ফলাফল কম্পিউটার জেনারেটেড, স্বাক্ষর ব্যতীত বৈধ নয়।
        </div>
      </div>
    </body>
    </html>
  `;
  };

  const handlePrintPreview = async (result: ResultListItem) => {
    try {
      const { data } = await axiosSecure.get(`/api/result/${result._id}`);
      const fullResult = data.data;

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        Swal.fire(
          "ত্রুটি!",
          "পপ-আপ ব্লকার সক্রিয় আছে। দয়া করে পপ-আপ ব্লকার বন্ধ করুন।",
          "error",
        );
        return;
      }

      printWindow.document.write(getPrintHTML(fullResult));
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      };
    } catch (error) {
      console.error("Print error:", error);
      Swal.fire("ত্রুটি!", "প্রিন্ট করতে ব্যর্থ হয়েছে", "error");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!results.length) {
      Swal.fire("সতর্কতা!", "কোন ফলাফল নেই", "warning");
      return;
    }

    const headers = [
      "শিক্ষার্থীর নাম",
      "রোল",
      "পরীক্ষা",
      "প্রাপ্ত নম্বর",
      "মোট নম্বর",
      "শতকরা",
      "গ্রেড",
      "জিপিএ",
      "স্ট্যাটাস",
    ];
    const csvData = results.map((result: ResultListItem) => [
      result.studentName,
      result.studentRoll,
      result.examName,
      result.totalObtained,
      result.totalMax,
      `${result.percentage}%`,
      result.grade,
      result.gpa,
      result.status === "published" ? "প্রকাশিত" : "ড্রাফট",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `results_${filters.className}_${filters.academicYear}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className={styles.classBasedResults}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <FaGraduationCap />
            </div>
            <div>
              <h1 className={styles.pageTitle}>শ্রেণিভিত্তিক ফলাফল</h1>
              <p className={styles.pageSubtitle}>
                ক্লাস এবং শিক্ষাবর্ষ অনুযায়ী ফলাফল দেখুন ও ব্যবস্থাপনা করুন
              </p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className={styles.filterSection}>
          <div className={styles.filterCard}>
            <h3 className={styles.filterTitle}>
              <FaFilter /> ফিল্টার
            </h3>

            <div className={styles.filterGrid}>
              {/* Class Filter */}
              <div className={styles.filterGroup}>
                <label>
                  <MdClass /> শ্রেণি <span>*</span>
                </label>
                <select
                  value={filters.className}
                  onChange={(e) =>
                    handleFilterChange("className", e.target.value)
                  }
                  className={styles.filterSelect}
                  required
                >
                  <option value="">-- শ্রেণি নির্বাচন করুন --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.dbValue}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Academic Year Filter */}
              <div className={styles.filterGroup}>
                <label>
                  <FaCalendarAlt /> শিক্ষাবর্ষ <span>*</span>
                </label>
                <select
                  value={filters.academicYear}
                  onChange={(e) =>
                    handleFilterChange("academicYear", e.target.value)
                  }
                  className={styles.filterSelect}
                >
                  {academicYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Filter (optional) */}
              {filters.className && exams.length > 0 && (
                <div className={styles.filterGroup}>
                  <label>
                    <FaSchool /> পরীক্ষা
                  </label>
                  <select
                    value={filters.examId}
                    onChange={(e) =>
                      handleFilterChange("examId", e.target.value)
                    }
                    className={styles.filterSelect}
                  >
                    <option value="">-- সব পরীক্ষা --</option>
                    {exams.map((exam: any) => (
                      <option key={exam._id} value={exam._id}>
                        {exam.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Status Filter */}
              <div className={styles.filterGroup}>
                <label>স্ট্যাটাস</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="">-- সব স্ট্যাটাস --</option>
                  <option value="published">প্রকাশিত</option>
                  <option value="draft">ড্রাফট</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.filterActions}>
              <button
                className={styles.searchBtn}
                onClick={() => refetch()}
                disabled={!filters.className || !filters.academicYear}
              >
                <FaSearch /> ফলাফল দেখুন
              </button>

              {results.length > 0 && (
                <button className={styles.exportBtn} onClick={handleExportCSV}>
                  <FaDownload /> এক্সপোর্ট
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Table */}
        {filters.className && filters.academicYear && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <h3>
                {filters.className} - {filters.academicYear} শিক্ষাবর্ষের ফলাফল
                <span className={styles.resultCount}>
                  {results.length} জন শিক্ষার্থী
                </span>
              </h3>
            </div>

            {isLoading ? (
              <div className={styles.loading}>লোড হচ্ছে...</div>
            ) : results.length === 0 ? (
              <div className={styles.emptyState}>
                <FaGraduationCap />
                <p>কোন ফলাফল পাওয়া যায়নি</p>
                <p className={styles.emptyHint}>
                  {!filters.className
                    ? "দয়া করে একটি ক্লাস নির্বাচন করুন"
                    : "এই ক্লাসের জন্য এখনো কোন ফলাফল তৈরি করা হয়নি"}
                </p>
              </div>
            ) : (
              <div className={styles.tableContainer}>
                <div className={styles.tableWrapper}>
                  <table className={styles.resultTable}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>শিক্ষার্থীর নাম</th>
                        <th>রোল</th>
                        <th>পরীক্ষা</th>
                        <th>প্রাপ্ত নম্বর</th>
                        <th>শতকরা</th>
                        <th>গ্রেড</th>
                        <th>জিপিএ</th>
                        <th>স্ট্যাটাস</th>
                        <th>অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result: ResultListItem, idx: number) => (
                        <tr key={result._id} className={styles.resultRow}>
                          <td>{idx + 1}</td>
                          <td className={styles.studentName}>
                            {result.studentName}
                          </td>
                          <td>{result.studentRoll}</td>
                          <td>{result.examName}</td>
                          <td>
                            {result.totalObtained}/{result.totalMax}
                          </td>
                          <td>{result.percentage}%</td>
                          <td>
                            <span
                              className={`${styles.gradeBadge} ${result.grade === "F" ? styles.fail : styles.pass}`}
                            >
                              {result.grade}
                            </span>
                          </td>
                          <td>{result.gpa}</td>
                          <td>
                            <span
                              className={`${styles.statusBadge} ${result.status === "published" ? styles.published : styles.draft}`}
                            >
                              {result.status === "published"
                                ? "প্রকাশিত"
                                : "ড্রাফট"}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionButtons}>
                              <button
                                className={styles.printBtn}
                                onClick={() => handlePrintPreview(result)}
                                title="প্রিন্ট প্রিভিউ"
                              >
                                <FaPrint />
                              </button>
                              <button
                                className={styles.deleteBtn}
                                onClick={() => handleDelete(result)}
                                title="মুছে ফেলুন"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ClassBasedResults;
