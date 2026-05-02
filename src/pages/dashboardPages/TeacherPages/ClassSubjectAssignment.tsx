import React, { useState } from "react";
import { useClassSubjects } from "../../../hooks/useClassSubjects";
import { MdClass } from "react-icons/md";
import styles from "../../../styles/DashboardPages/AssignClassSub.module.scss";
import PageHeader from "../../../components/DashboardComponents/PageHeader";
import StatsCards from "../../../components/DashboardComponents/StatsCards";
import ClassSelectForm from "../../../components/DashboardComponents/ClassSelectForm";
import ClassList from "../../../components/DashboardComponents/ClassLists";
import AssignedSubjects from "../../../components/DashboardComponents/AssignedSubjects";
import type { Subject } from "../../../types/loginTypes/subjectTypes";

const ClassSubjectAssignment: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  const { subjects, classConfigs, saveMutation, deleteMutation } =
    useClassSubjects();

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId);
    const existingConfig = classConfigs.find((c) => c.classId === classId);
    setSelectedSubjectIds(
      existingConfig ? existingConfig.subjects.map((s) => s.subjectId) : [],
    );
  };

  const resetForm = () => {
    setSelectedClass("");
    setSelectedSubjectIds([]);
  };

  return (
    <div className={styles.classSubjectPage}>
      {/* Header */}
      <PageHeader
        icon={<MdClass />}
        title="ক্লাসভিত্তিক বিষয় নির্ধারণ"
        subtitle="প্রতিটি ক্লাসের জন্য কোন বিষয় পড়ানো হবে তা নির্ধারণ করুন"
      />

      {/* Stats Cards */}
      <StatsCards totalClasses={12} configuredClasses={classConfigs.length} />

      {/* Class Selection & Form */}
      <div className={styles.formContainer}>
        <ClassSelectForm
          selectedClass={selectedClass}
          selectedSubjectIds={selectedSubjectIds}
          subjects={subjects}
          existingConfigSubjects={(() => {
            const config = classConfigs.find(
              (c) => c.classId === selectedClass,
            );
            return config?.subjects.map((s) => s.subjectId as Subject) || [];
          })()}
          onClassSelect={handleClassSelect}
          onSubjectToggle={(subjectId) => {
            setSelectedSubjectIds((prev) =>
              prev.includes(subjectId)
                ? prev.filter((id) => id !== subjectId)
                : [...prev, subjectId],
            );
          }}
          onSubmit={(config) => saveMutation.mutate(config)}
          onReset={resetForm}
        />
        {/* Existing Configurations List */}
        <ClassList
          classConfigs={classConfigs}
          selectedClass={selectedClass}
          onClassClick={(config) => {
            setSelectedClass(config.classId);
            setSelectedSubjectIds(config.subjects.map((s) => s.subjectId));
          }}
          onDelete={(config) => deleteMutation.mutate(config._id!)}
        />
        {/* Show Assigned Subjects for Selected Class */}
        {selectedClass && (
          <AssignedSubjects
            selectedClass={selectedClass}
            classConfigs={classConfigs}
          />
        )}
      </div>
    </div>
  );
};

export default ClassSubjectAssignment;
