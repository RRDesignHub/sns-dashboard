// components/ClassSelectForm.tsx
import React, { useMemo } from "react";
import { FaSave, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import styles from "../../styles/DashboardPages/AssignClassSub.module.scss";
import type { Subject } from "../../types/loginTypes/subjectTypes";

interface ClassSelectFormProps {
  selectedClass: string;
  selectedSubjectIds: string[];
  subjects: Subject[];
  existingConfigSubjects?: Subject[]; // Already assigned subjects for this class
  onClassSelect: (classId: string) => void;
  onSubjectToggle: (subjectId: string) => void;
  onSubmit: (config: any) => void;
  onReset: () => void;
}

const classes = [
  { id: "class-play", name: "Play", section: "primary" },
  { id: "class-nursery", name: "Nursery", section: "primary" },
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

const ClassSelectForm: React.FC<ClassSelectFormProps> = ({
  selectedClass,
  selectedSubjectIds,
  subjects,
  existingConfigSubjects = [],
  onClassSelect,
  onSubjectToggle,
  onSubmit,
}) => {
  // Get IDs of already assigned subjects (excluding currently selected ones)
  const assignedSubjectIds = useMemo(() => {
    return existingConfigSubjects.map((s) => s._id).filter(Boolean);
  }, [existingConfigSubjects]);

  // Filter available subjects: exclude already assigned ones
  const availableSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      // If subject is already assigned and NOT in current selection, hide it
      if (
        assignedSubjectIds.includes(subject._id) &&
        !selectedSubjectIds.includes(subject._id!)
      ) {
        return false;
      }
      return true;
    });
  }, [subjects, assignedSubjectIds, selectedSubjectIds]);

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

    onSubmit(config);
  };

  return (
    <div className={styles.formCard}>
      <h3 className={styles.formTitle}>
        <FaPlus /> ক্লাসের বিষয় নির্ধারণ / সম্পাদনা
      </h3>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>
            ক্লাস নির্বাচন করুন <span>*</span>
          </label>
          <select
            value={selectedClass}
            onChange={(e) => onClassSelect(e.target.value)}
            className={styles.selectInput}
          >
            <option value="">-- একটি ক্লাস নির্বাচন করুন --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {selectedClass && (
          <>
            <div className={styles.formGroup}>
              {availableSubjects.length > 0 && (
                <label>বিষয় নির্বাচন করুন (একাধিক নির্বাচন করতে পারেন)</label>
              )}

              {/* Show warning if no available subjects */}
              {availableSubjects.length === 0 && (
                <div className={styles.warningBox}>
                  <p>
                    ⚠️ এই ক্লাসের জন্য সকল বিষয় ইতিমধ্যে নির্ধারণ করা হয়েছে।
                  </p>
                </div>
              )}

              {availableSubjects.length > 0 && (
                <div className={styles.subjectChecklist}>
                  {availableSubjects?.map((subject) => (
                    <label key={subject._id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedSubjectIds.includes(subject._id!)}
                        onChange={() => onSubjectToggle(subject._id!)}
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
              )}
            </div>

            {selectedSubjectIds.length > 0 && availableSubjects.length > 0 && (
              <div className={styles.selectedPreview}>
                <div className={styles.previewHeader}>
                  <strong>নির্বাচিত বিষয়সমূহ:</strong>
                  <span>{selectedSubjectIds.length} টি বিষয়</span>
                </div>
                <div className={styles.previewList}>
                  {selectedSubjectIds.map((subjectId) => {
                    const subject = subjects.find((s) => s._id === subjectId);
                    return subject ? (
                      <div key={subjectId} className={styles.previewItem}>
                        <span>
                          {subject.nameBn} ({subject.code})
                        </span>
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => onSubjectToggle(subjectId)}
                          title="সরান"
                        >
                          ✕
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>
                <FaSave /> সংরক্ষণ করুন
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default ClassSelectForm;
