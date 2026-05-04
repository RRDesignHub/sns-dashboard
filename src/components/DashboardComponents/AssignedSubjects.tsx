// components/AssignedSubjects.tsx
import React from "react";
import styles from "../../styles/DashboardPages/AssignClassSub.module.scss";
import type { ClassConfig } from "../../types/loginTypes/subjectTypes";

interface AssignedSubjectsProps {
  selectedClass: string;
  classConfigs: ClassConfig[];
}

const AssignedSubjects: React.FC<AssignedSubjectsProps> = ({
  selectedClass,
  classConfigs,
}) => {
  if (!selectedClass) return null;

  const selectedConfig = classConfigs.find((c) => c.classId === selectedClass);

  if (!selectedConfig) return null;

  // Helper function to get effective marks (check customConfig first)
  const getEffectiveMarks = (assigned: any) => {
    const defaultSubject = assigned.subjectId;
    const customConfig = assigned.customConfig;

    if (customConfig) {
      // ✅ Custom marks exist - use them
      return {
        totalMarks: customConfig.totalMarks,
        academicMarks: customConfig.academicMarks,
        behavioralMarks: customConfig.behavioralMarks,
        isOverridden: true,
        defaultTotalMarks: defaultSubject.totalMarks,
      };
    } else {
      // ❌ No custom marks - use default
      return {
        totalMarks: defaultSubject.totalMarks,
        academicMarks: defaultSubject.academicMarks,
        behavioralMarks: defaultSubject.behavioralMarks,
        isOverridden: false,
        defaultTotalMarks: defaultSubject.totalMarks,
      };
    }
  };

  return (
    <div className={styles.assignedSubjectsCard}>
      <h3 className={styles.formTitle}>
        {selectedConfig.className} - নির্ধারিত বিষয়সমূহ
      </h3>

      {selectedConfig.subjects.length === 0 ? (
        <div className={styles.emptyAssigned}>
          <p>এই ক্লাসের জন্য কোন বিষয় নির্ধারণ করা হয়নি</p>
        </div>
      ) : (
        <div className={styles.assignedList}>
          {selectedConfig.subjects.map((assigned, idx) => {
            // subjectId is populated from SubjectMaster
            const subject = assigned.subjectId as any;
            const effectiveMarks = getEffectiveMarks(assigned);

            return (
              <div key={idx} className={styles.assignedItem}>
                {/* Serial Number */}
                <div className={styles.assignedNumber}>{idx + 1}</div>

                {/* Subject Info */}
                <div className={styles.assignedInfo}>
                  <div className={styles.assignedName}>
                    <strong>{subject.nameBn || subject.name}</strong>
                    <span className={styles.assignedCode}>{subject.code}</span>

                    {/* Show badge if marks are overridden */}
                    {effectiveMarks.isOverridden && (
                      <span className={styles.overriddenBadge}>
                        ⚡ Changed Marks
                      </span>
                    )}
                  </div>

                  {/* Marks Display */}
                  <div className={styles.assignedMarks}>
                    {/* Show effective marks with tooltip */}
                    <div className={styles.marksContainer}>
                      <span
                        className={
                          effectiveMarks.totalMarks === 100
                            ? styles.marks100
                            : effectiveMarks.totalMarks === 50
                              ? styles.marks50
                              : styles.marksCustom
                        }
                      >
                        {effectiveMarks.totalMarks}
                      </span>
                    </div>

                    {/* Academic & Behavioral breakdown */}
                    <div className={styles.marksBreakdown}>
                      <span className={styles.academicMarks}>
                        📝 {effectiveMarks.academicMarks}
                      </span>
                      <span className={styles.behavioralMarks}>
                        🎯 {effectiveMarks.behavioralMarks}
                      </span>
                    </div>

                    {/* Order & Status */}
                    <span className={styles.assignedOrder}>
                      ক্রম: {assigned.order + 1}
                    </span>

                    {assigned.isActive ? (
                      <span className={styles.activeBadge}>সক্রিয়</span>
                    ) : (
                      <span className={styles.inactiveBadge}>নিষ্ক্রিয়</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignedSubjects;
