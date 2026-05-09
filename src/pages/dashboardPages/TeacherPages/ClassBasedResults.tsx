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
import ResultPrintModal from "../../../components/DashboardComponents/ResultPrintModal";

const ClassBasedResults: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  // Add state
  const [showPrintModal, setShowPrintModal] = useState(false);
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

  // Handle print/preview
  const handlePrintPreview = (result: ResultListItem) => {
    setSelectedResultId(result._id);
    setShowPrintModal(true);
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

      {/* print result preview modal */}
      {showPrintModal && selectedResultId && (
        <ResultPrintModal
          resultId={selectedResultId}
          onClose={() => {
            setShowPrintModal(false);
            setSelectedResultId(null);
          }}
        />
      )}
    </>
  );
};

export default ClassBasedResults;
