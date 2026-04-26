import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaSave,
  FaTimes,
  FaSchool,
  FaSearch,
  FaCheckDouble,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import { MdClass, MdSubject } from "react-icons/md";
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
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingConfig, setEditingConfig] = useState<ClassConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all subjects
  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/subjects/all-subjects");
      return data.data || [];
    },
  });

  // Fetch class subject configurations
  const { data: classConfigs = [], refetch } = useQuery({
    queryKey: ["class-subjects"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/classes/all");
      return data.data || [];
    },
  });

  // Save class subject configuration
  const saveMutation = useMutation({
    mutationFn: async (config: any) => {
      const { data } = await axiosSecure.post(
        "/api/classes/subjects/assign",
        config,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-subjects"] });
      closeModal();
      Swal.fire("সফল!", "ক্লাসের বিষয় নির্ধারণ করা হয়েছে", "success");
    },
  });

  // Update class subject configuration
  const updateMutation = useMutation({
    mutationFn: async ({ id, config }: { id: string; config: any }) => {
      const { data } = await axiosSecure.put(
        `/api/classes/subjects/${id}`,
        config,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-subjects"] });
      closeModal();
      Swal.fire("সফল!", "ক্লাসের বিষয় হালনাগাদ করা হয়েছে", "success");
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

  const getSectionName = (section: string) => {
    switch (section) {
      case "primary":
        return "প্রাথমিক";
      case "secondary":
        return "মাধ্যমিক";
      default:
        return section;
    }
  };

  const handleSubjectToggle = (subjectId: string) => {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };

  const openModal = (config?: ClassConfig) => {
    if (config) {
      setEditingConfig(config);
      setSelectedClass(config.classId);
      setSelectedSubjects(config.subjects.map((s) => s.subjectId));
    } else {
      setEditingConfig(null);
      setSelectedClass("");
      setSelectedSubjects([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingConfig(null);
    setSelectedClass("");
    setSelectedSubjects([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClass) {
      Swal.fire("সতর্কতা!", "দয়া করে একটি ক্লাস নির্বাচন করুন", "warning");
      return;
    }

    if (selectedSubjects.length === 0) {
      Swal.fire(
        "সতর্কতা!",
        "দয়া করে কমপক্ষে একটি বিষয় নির্বাচন করুন",
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
      subjects: selectedSubjects.map((subjectId, index) => ({
        subjectId,
        order: index,
        isActive: true,
      })),
    };

    if (editingConfig?._id) {
      updateMutation.mutate({ id: editingConfig._id, config });
    } else {
      saveMutation.mutate(config);
    }
  };

  const getAssignedSubjects = (config: ClassConfig) => {
    const subjectIds = config.subjects.map((s) => s.subjectId);
    return subjects.filter((s: Subject) => subjectIds.includes(s._id));
  };

  // Filter subjects for the left panel
  const filteredSubjects = subjects.filter(
    (subject: Subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.nameBn.includes(searchTerm) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
              প্রতিটি ক্লাসের জন্য কোন বিষয় পড়ানো হবে তা নির্ধারণ করুন। সাধারণ
              বিষয় তালিকা থেকে নির্বাচন করুন।
            </p>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className={styles.toolbar}>
        <button className={styles.addButton} onClick={() => openModal()}>
          <FaPlus />
          <span>ক্লাসের বিষয় নির্ধারণ</span>
        </button>
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
        <div className={styles.statCard}>
          <div className={styles.statValue}>{subjects.length}</div>
          <div className={styles.statLabel}>উপলব্ধ বিষয়</div>
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className={styles.classGrid}>
        {classes.map((cls) => {
          const config = classConfigs.find(
            (c: ClassConfig) => c.classId === cls.id,
          );
          const assignedCount = config?.subjects.length || 0;
          const isConfigured = !!config;

          return (
            <div key={cls.id} className={styles.classCard}>
              <div className={styles.classCardHeader}>
                <FaSchool className={styles.classIcon} />
                <h3>{cls.name}</h3>
                <span className={styles.sectionBadge}>
                  {getSectionName(cls.section)}
                </span>
              </div>
              <div className={styles.classCardBody}>
                {isConfigured ? (
                  <>
                    <div className={styles.subjectList}>
                      {getAssignedSubjects(config)
                        .slice(0, 4)
                        .map((sub: Subject) => (
                          <span key={sub._id} className={styles.subjectTag}>
                            {sub.nameBn}
                          </span>
                        ))}
                      {assignedCount > 4 && (
                        <span className={styles.subjectMore}>
                          +{assignedCount - 4}
                        </span>
                      )}
                    </div>
                    <div className={styles.classCardFooter}>
                      <span className={styles.subjectCount}>
                        {assignedCount} টি বিষয়
                      </span>
                      <button
                        className={styles.editClassBtn}
                        onClick={() => openModal(config)}
                      >
                        <FaEdit /> সম্পাদনা
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={styles.emptyState}>
                    <p>কোন বিষয় নির্ধারণ করা হয়নি</p>
                    <button
                      className={styles.assignBtn}
                      onClick={() => openModal()}
                    >
                      বিষয় নির্ধারণ করুন
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Assign Subjects */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalLarge}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>
                {editingConfig
                  ? `${editingConfig.className} - বিষয় সম্পাদনা`
                  : "ক্লাসের জন্য বিষয় নির্ধারণ"}
              </h3>
              <button className={styles.closeBtn} onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>
                  ক্লাস নির্বাচন করুন <span>*</span>
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  required
                >
                  <option value="">-- একটি ক্লাস নির্বাচন করুন --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({getSectionName(cls.section)})
                    </option>
                  ))}
                </select>
              </div>

              {selectedClass && (
                <>
                  <div className={styles.subjectSelection}>
                    <div className={styles.selectionHeader}>
                      <MdSubject />
                      <span>বিষয় নির্বাচন করুন</span>
                    </div>

                    <div className={styles.searchInputWrapper}>
                      <FaSearch className={styles.searchIcon} />
                      <input
                        type="text"
                        placeholder="বিষয় অনুসন্ধান..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className={styles.subjectChecklist}>
                      {filteredSubjects.map((subject: Subject) => (
                        <label
                          key={subject._id}
                          className={styles.checkboxLabel}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSubjects.includes(subject._id)}
                            onChange={() => handleSubjectToggle(subject._id)}
                          />
                          <span className={styles.checkboxText}>
                            <strong>{subject.nameBn}</strong>
                            <small>{subject.code}</small>
                            <span
                              className={`${styles.marksTag} ${
                                subject.totalMarks === 100
                                  ? styles.marks100
                                  : styles.marks50
                              }`}
                            >
                              {subject.totalMarks}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>

                    {selectedSubjects.length > 0 && (
                      <div className={styles.selectionSummary}>
                        <FaCheckDouble />
                        <span>
                          {selectedSubjects.length} টি বিষয় নির্বাচিত হয়েছে
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={styles.infoBox}>
                    <p>
                      <strong>বিঃ দ্রঃ</strong> নির্বাচিত বিষয়গুলো এই ক্লাসের
                      জন্য যুক্ত হবে। পরে বিষয়গুলোর ক্রম পরিবর্তন ও প্রয়োজনমতো
                      মার্কস কাস্টমাইজ করা যাবে।
                    </p>
                  </div>
                </>
              )}

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
                  className={styles.submitBtn}
                  disabled={!selectedClass || selectedSubjects.length === 0}
                >
                  <FaSave />
                  {editingConfig ? "হালনাগাদ করুন" : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSubjectAssignment;
