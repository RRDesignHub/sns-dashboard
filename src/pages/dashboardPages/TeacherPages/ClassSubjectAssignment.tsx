import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSave, FaPlus, FaTrash } from "react-icons/fa";
import { MdClass } from "react-icons/md";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";
import styles from "../../../styles/DashboardPages/AssignClassSub.module.scss";
import Swal from "sweetalert2";
import type {
  ClassConfig,
  Subject,
} from "../../../types/loginTypes/subjectTypes";

const ClassSubjectAssignment: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Simple state
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  // Fetch all subjects (from your subject master)
  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/subjects/all-subjects");
      return data.data || [];
    },
  });

  // Fetch existing class configurations
  const { data: classConfigs = [], refetch } = useQuery({
    queryKey: ["class-subjects"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/subjects/classes/all");
      return data.data || [];
    },
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (config: any) => {
      const { data } = await axiosSecure.post(
        "/api/subjects/classes/assign",
        config,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-subjects"] });
      resetForm();
      Swal.fire("সফল!", "ক্লাসের বিষয় নির্ধারণ করা হয়েছে", "success");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosSecure.delete(`/api/classes/subjects/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-subjects"] });
      Swal.fire("সফল!", "ক্লাসের বিষয় মুছে ফেলা হয়েছে", "success");
    },
  });

  const classes = [
    { id: "class-play", name: "Play", section: "primary" },
    { id: "class-nursery", name: "Nursery", section: "primary" },
    { id: "class-kg", name: "KG", section: "primary" },
    { id: "class-1", name: "Class 1", section: "primary" },
    { id: "class-2", name: "Class 2", section: "primary" },
    { id: "class-3", name: "Class 3", section: "primary" },
    { id: "class-4", name: "Class 4", section: "primary" },
    { id: "class-5", name: "Class 5", section: "primary" },
    { id: "class-6", name: "Class 6", section: "secondary" },
    { id: "class-7", name: "Class 7", section: "secondary" },
    { id: "class-8", name: "Class 8", section: "secondary" },
    { id: "class-9", name: "Class 9", section: "secondary" },
    { id: "class-10", name: "Class 10", section: "secondary" },
  ];

  const resetForm = () => {
    setSelectedClass("");
    setSelectedSubjectIds([]);
  };

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId);

    // Check if this class already has subjects assigned
    const existingConfig = classConfigs.data.find(
      (c: ClassConfig) => c.classId === classId,
    );
    if (existingConfig) {
      const subjectIds = existingConfig.subjects.map((s) => s.subjectId);
      setSelectedSubjectIds(subjectIds);
    } else {
      setSelectedSubjectIds([]);
    }
  };

  const handleSubjectToggle = (subjectId: string) => {
    if (selectedSubjectIds.includes(subjectId)) {
      setSelectedSubjectIds(
        selectedSubjectIds.filter((id) => id !== subjectId),
      );
    } else {
      setSelectedSubjectIds([...selectedSubjectIds, subjectId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClass) {
      Swal.fire("সতর্কতা!", "দয়া করে একটি ক্লাস নির্বাচন করুন", "warning");
      return;
    }

    if (selectedSubjectIds.length === 0) {
      Swal.fire(
        "সতর্কতা!",
        "দয়া করে অন্তত একটি বিষয় নির্বাচন করুন",
        "warning",
      );
      return;
    }

    const classInfo = classes.find((c) => c.id === selectedClass);
    const currentYear = new Date().getFullYear().toString();

    const config = {
      classId: selectedClass,
      className: classInfo?.name || "",
      section: classInfo?.section || "primary",
      academicYear: currentYear,
      subjects: selectedSubjectIds.map((subjectId, index) => ({
        subjectId,
        order: index,
        isActive: true,
      })),
    };

    saveMutation.mutate(config);
  };

  const handleDelete = (config: ClassConfig) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `${config.className} ক্লাসের সব বিষয় মুছে যাবে!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#16a34a",
      confirmButtonText: "হ্যাঁ, মুছুন",
      cancelButtonText: "বাতিল করুন",
    }).then((result) => {
      if (result.isConfirmed && config._id) {
        deleteMutation.mutate(config._id);
      }
    });
  };

  // Get assigned subjects count for each class
  const getAssignedCount = (classId: string) => {
    const config = classConfigs.find((c: ClassConfig) => c.classId === classId);
    return config?.subjects.length || 0;
  };

  return (
    <div className={styles.classSubjectPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <MdClass />
          </div>
          <div>
            <h1 className={styles.pageTitle}>ক্লাসভিত্তিক বিষয় নির্ধারণ</h1>
            <p className={styles.pageSubtitle}>
              প্রতিটি ক্লাসের জন্য কোন বিষয় পড়ানো হবে তা নির্ধারণ করুন
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{classes.length}</div>
          <div className={styles.statLabel}>মোট ক্লাস</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{classConfigs.length}</div>
          <div className={styles.statLabel}>বিষয় নির্ধারিত ক্লাস</div>
        </div>
      </div>

      {/* Class Selection & Form */}
      <div className={styles.formContainer}>
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>
            <FaPlus /> ক্লাসের বিষয় নির্ধারণ / সম্পাদনা
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Class Selection */}
            <div className={styles.formGroup}>
              <label>
                ক্লাস নির্বাচন করুন <span>*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => handleClassSelect(e.target.value)}
                className={styles.selectInput}
              >
                <option value="">-- একটি ক্লাস নির্বাচন করুন --</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - {getAssignedCount(cls.id)} টি বিষয় নির্ধারিত
                  </option>
                ))}
              </select>
            </div>

            {/* Subjects Selection - only show if class selected */}
            {selectedClass && (
              <>
                <div className={styles.formGroup}>
                  <label>
                    বিষয় নির্বাচন করুন (একাধিক নির্বাচন করতে পারেন)
                  </label>
                  <div className={styles.subjectChecklist}>
                    {subjects.map((subject: Subject) => (
                      <label key={subject._id} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={selectedSubjectIds.includes(subject._id)}
                          onChange={() => handleSubjectToggle(subject._id)}
                        />
                        <span>
                          <strong>{subject.nameBn}</strong>
                          <span className={styles.code}>{subject.code}</span>
                          <span
                            className={
                              subject.totalMarks === 100
                                ? styles.marks100
                                : styles.marks50
                            }
                          >
                            {subject.totalMarks}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Selected Count */}
                <div className={styles.selectedCount}>
                  নির্বাচিত: {selectedSubjectIds.length} টি বিষয়
                </div>

                {/* Submit Button */}
                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitBtn}>
                    <FaSave /> সংরক্ষণ করুন
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Existing Configurations List */}
        <div className={styles.configListCard}>
          <h3 className={styles.formTitle}>নির্ধারিত ক্লাসের তালিকা</h3>

          {classConfigs.length === 0 ? (
            <div className={styles.emptyList}>
              <p>কোন ক্লাসের বিষয় নির্ধারণ করা হয়নি</p>
            </div>
          ) : (
            <div className={styles.configList}>
              {classConfigs.map((config: ClassConfig) => (
                <div key={config._id} className={styles.configItem}>
                  <div className={styles.configInfo}>
                    <strong>{config.className}</strong>
                    <span>{config.subjects.length} টি বিষয়</span>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(config)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassSubjectAssignment;
