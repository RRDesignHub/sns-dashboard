// components/ClassList.tsx
import React from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import styles from "../../styles/DashboardPages/AssignClassSub.module.scss";
import type { ClassConfig } from "../../types/loginTypes/subjectTypes";
import AssignedSubjects from "./AssignedSubjects";

interface ClassListProps {
  classConfigs: ClassConfig[];
  selectedClass: string;
  onClassClick: (config: ClassConfig) => void;
  onDelete: (config: ClassConfig) => void;
}

const ClassList: React.FC<ClassListProps> = ({
  classConfigs,
  selectedClass,
  onClassClick,
  onDelete,
}) => {
  const handleDeleteClick = (e: React.MouseEvent, config: ClassConfig) => {
    e.stopPropagation();

    // Show confirmation dialog
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      html: `
        <div style="text-align: left; margin-top: 20px;">
          <p><strong>${config.className}</strong> ক্লাসের জন্য নির্ধারিত</p>
          <p><strong>${config.subjects.length} টি বিষয়</strong> সম্পূর্ণ মুছে যাবে!</p>
          <p style="color: #dc2626; margin-top: 15px;">এই কাজটি পরে পূর্বাবস্থায় ফিরানো যাবে না।</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#16a34a",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল করুন",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(config);
      }
    });
  };

  if (classConfigs.length === 0) {
    return (
      <div className={styles.configListCard}>
        <h3 className={styles.formTitle}>নির্ধারিত ক্লাসের তালিকা</h3>
        <div className={styles.emptyList}>
          <p>কোন ক্লাসের বিষয় নির্ধারণ করা হয়নি</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.configListCard}>
        <h3 className={styles.formTitle}>নির্ধারিত ক্লাসের তালিকা</h3>
        <div className={styles.configList}>
          {classConfigs.map((config) => (
            <div
              key={config._id}
              className={`${styles.configItem} ${selectedClass === config.classId ? styles.active : ""}`}
              onClick={() => onClassClick(config)}
            >
              <div className={styles.configInfo}>
                <strong>{config.className}</strong>
                <span>{config.subjects.length} টি বিষয়</span>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={(e) => handleDeleteClick(e, config)}
                title="মুছে ফেলুন"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        {selectedClass && (
          <AssignedSubjects
            selectedClass={selectedClass}
            classConfigs={classConfigs}
          />
        )}
      </div>
    </>
  );
};

export default ClassList;
