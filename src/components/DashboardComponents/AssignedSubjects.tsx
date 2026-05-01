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
            // subjectId is populated, so we can access its properties directly
            const subject = assigned.subjectId as any; // The populated subject object

            return (
              <div key={idx} className={styles.assignedItem}>
                <div className={styles.assignedNumber}>{idx + 1}</div>
                <div className={styles.assignedInfo}>
                  <div className={styles.assignedName}>
                    <strong>{subject.nameBn || subject.name}</strong>
                    <span className={styles.assignedCode}>{subject.code}</span>
                  </div>
                  <div className={styles.assignedMarks}>
                    <span
                      className={
                        subject.totalMarks === 100
                          ? styles.marks100
                          : styles.marks50
                      }
                    >
                      {subject.totalMarks}
                    </span>
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
