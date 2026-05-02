import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/shared/Loading";
import styles from "../../../styles/DashboardPages/ManageExams.module.scss";
import Swal from "sweetalert2";
import type { Exam, ExamFormData } from "../../../types/examTypes";

const ManageExams: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [formData, setFormData] = useState<ExamFormData>({
    name: "",
    examType: "semester",
    section: "primary",
    academicYear: new Date().getFullYear().toString(),
    startDate: "",
    endDate: "",
    totalWorkdays: 0,
    totalGuardianMeetings: 0,
    feeMonths: 0,
  });

  // Fetch all exams
  const { data: exams = [], isLoading } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/exams/all");
      return data.data || [];
    },
  });

  // Create exam
  const createMutation = useMutation({
    mutationFn: async (newExam: ExamFormData) => {
      const { data } = await axiosSecure.post("/api/exams/create", newExam);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      closeModal();
      Swal.fire("সফল!", "পরীক্ষা তৈরি করা হয়েছে", "success");
    },
    onError: (error: any) => {
      Swal.fire(
        "ত্রুটি!",
        error.response?.data?.message || "পরীক্ষা তৈরি করতে ব্যর্থ হয়েছে",
        "error",
      );
    },
  });

  // Delete exam
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosSecure.delete(`/api/exams/delete/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      Swal.fire("সফল!", "পরীক্ষা মুছে ফেলা হয়েছে", "success");
    },
    onError: (error: any) => {
      Swal.fire(
        "ত্রুটি!",
        error.response?.data?.message || "পরীক্ষা মুছতে ব্যর্থ হয়েছে",
        "error",
      );
    },
  });

  const openModal = (exam?: Exam) => {
    if (exam) {
      setFormData({
        name: exam.name,
        examType: exam.examType,
        section: exam.section,
        academicYear: exam.academicYear,
        startDate: exam.startDate.split("T")[0],
        endDate: exam.endDate.split("T")[0],
        totalWorkdays: exam.totalWorkdays,
        totalGuardianMeetings: exam.totalGuardianMeetings,
        feeMonths: exam.feeMonths,
      });
    } else {
      setFormData({
        name: "",
        examType: "semester",
        section: "primary",
        academicYear: new Date().getFullYear().toString(),
        startDate: "",
        endDate: "",
        totalWorkdays: 0,
        totalGuardianMeetings: 0,
        feeMonths: 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate(formData);
  };

  const handleDelete = (exam: Exam) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `${exam.name} পরীক্ষাটি মুছে ফেলা হবে!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#16a34a",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল করুন",
    }).then((result) => {
      if (result.isConfirmed && exam._id) {
        deleteMutation.mutate(exam._id);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <span className={styles.statusUpcoming}>আসন্ন</span>;
      case "ongoing":
        return <span className={styles.statusOngoing}>চলমান</span>;
      case "completed":
        return <span className={styles.statusCompleted}>সমাপ্ত</span>;
      default:
        return null;
    }
  };

  const filteredExams = exams.filter((exam: Exam) => {
    if (filterStatus === "all") return true;
    return exam.status === filterStatus;
  });

  return (
    <div className={styles.manageExams}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <FaCalendarAlt />
          </div>
          <div>
            <h1 className={styles.pageTitle}>পরীক্ষা ব্যবস্থাপনা</h1>
            <p className={styles.pageSubtitle}>
              পরীক্ষা তৈরি, সম্পাদনা ও ব্যবস্থাপনা করুন
            </p>
          </div>
        </div>
      </div>
      {isLoading && <Loading />}

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          <label>স্ট্যাটাস: </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">সকল</option>
            <option value="upcoming">আসন্ন</option>
            <option value="ongoing">চলমান</option>
            <option value="completed">সমাপ্ত</option>
          </select>
        </div>
        <button className={styles.addButton} onClick={() => openModal()}>
          <FaPlus /> নতুন পরীক্ষা যোগ করুন
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{exams.length}</div>
          <div className={styles.statLabel}>মোট পরীক্ষা</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {exams.filter((e: Exam) => e.currentStatus === "upcoming").length}
          </div>
          <div className={styles.statLabel}>আসন্ন</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {exams.filter((e: Exam) => e.currentStatus === "ongoing").length}
          </div>
          <div className={styles.statLabel}>চলমান</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {exams.filter((e: Exam) => e.currentStatus === "completed").length}
          </div>
          <div className={styles.statLabel}>সমাপ্ত</div>
        </div>
      </div>

      {/* Exams Table */}
      <div className={styles.tableContainer}>
        {filteredExams.length === 0 ? (
          <tr>
            <td colSpan={8} className={styles.noData}>
              <p>কোন পরীক্ষা পাওয়া যায়নি</p>
              <button onClick={() => openModal()} className={styles.noDataBtn}>
                নতুন পরীক্ষা যোগ করুন
              </button>
            </td>
          </tr>
        ) : (
          <>
            <div className={styles.tableHeader}>
              <h3>পরীক্ষার তালিকা</h3>
              <span>{filteredExams.length} টি পরীক্ষা</span>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.examTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>পরীক্ষার নাম</th>
                    <th>বিভাগ</th>
                    <th>শুরু তারিখ</th>
                    <th>শেষ তারিখ</th>
                    <th>স্ট্যাটাস</th>
                    <th>অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.map((exam: Exam, idx: number) => (
                    <tr key={exam._id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div>
                          <small>
                            {exam.name}-{exam.academicYear}
                          </small>
                        </div>
                      </td>
                      <td>
                        {exam.section === "primary"
                          ? "প্রাথমিক (প্লে - ৫ম)"
                          : "উচ্চ (৬ষ্ঠ - ১০ম)"}
                      </td>
                      <td>{new Date(exam.startDate).toLocaleDateString()}</td>
                      <td>{new Date(exam.endDate).toLocaleDateString()}</td>
                      <td>{getStatusBadge(exam?.currentStatus)}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(exam)}
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
          </>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{"নতুন পরীক্ষা তৈরি"}</h3>
              <button className={styles.closeBtn} onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {/* Basic Info Row */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    পরীক্ষার নাম (ইংরেজি) <span>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="যেমন: 1st Semester"
                    required
                  />
                </div>
              </div>

              {/* Class & Type Row */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    পরীক্ষার ধরন <span>*</span>
                  </label>
                  <select
                    value={formData.examType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        examType: e.target.value as "semester" | "yearly",
                      })
                    }
                  >
                    <option value="semester">সেমিস্টার</option>
                    <option value="yearly">বার্ষিক/চূড়ান্ত</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    বিভাগ <span>*</span>
                  </label>
                  <select
                    value={formData.section}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        section: e.target.value as "primary" | "secondary",
                      })
                    }
                  >
                    <option value="primary">প্রাথমিক (প্লে - ৫ম)</option>
                    <option value="secondary">উচ্চ (৬ষ্ঠ - ১০ম)</option>
                  </select>
                </div>
              </div>

              {/* Academic Info Row */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    একাডেমিক বছর <span>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) =>
                      setFormData({ ...formData, academicYear: e.target.value })
                    }
                    placeholder="যেমন: 2026"
                    required
                  />
                </div>
              </div>

              {/* Date Row */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    শুরু তারিখ <span>*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    শেষ তারিখ <span>*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Behavioral Marks Row */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    মোট কর্মদিবস <small>(হাজিরা ৫ মার্কের জন্য)</small>
                  </label>
                  <input
                    type="number"
                    value={formData.totalWorkdays}
                    min={0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalWorkdays: Number(e.target.value),
                      })
                    }
                    placeholder="যেমন: 90"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    মোট অভিভাবক সভা <small>(৫ মার্কের জন্য)</small>
                  </label>
                  <input
                    type="number"
                    value={formData.totalGuardianMeetings}
                    min={0}
                    max={15}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalGuardianMeetings: Number(e.target.value),
                      })
                    }
                    placeholder="যেমন: 3"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    ফি প্রদানের মাস <small>(৫ মার্কের জন্য)</small>
                  </label>
                  <input
                    type="number"
                    value={formData.feeMonths}
                    min={0}
                    max={15}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        feeMonths: Number(e.target.value),
                      })
                    }
                    placeholder="যেমন: 3"
                  />
                </div>
              </div>

              {/* Info Note */}
              <div className={styles.infoNote}>
                <p>
                  <strong>বিঃ দ্রঃ</strong> আচরণগত মূল্যায়নের ২০ মার্ক
                  নিম্নলিখিত ভাবে নির্ধারিত হবে:
                  <br />• হাজিরা: {formData.totalWorkdays} দিনে ভিত্তিতে
                  (সর্বোচ্চ ৫)
                  <br />• অভিভাবক সভায় উপস্থিতি:{" "}
                  {formData.totalGuardianMeetings} টি সভায় (সর্বোচ্চ ৫)
                  <br />• ফি প্রদানের নিয়মিততা: {formData.feeMonths} মাসে
                  (সর্বোচ্চ ৫)
                  <br />• শৃঙ্খলা ও পোষাক পরিচ্ছন্নতা: (সর্বোচ্চ ৫)
                </p>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={closeModal}
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={styles.submitBtn}
                >
                  <FaSave /> {isLoading ? "সংরক্ষণ" : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageExams;
