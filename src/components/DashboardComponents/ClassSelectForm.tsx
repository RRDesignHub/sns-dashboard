import React, { useMemo, useState, useEffect } from "react";
import { FaSave, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import styles from "../../styles/DashboardPages/AssignClassSub.module.scss";
import type { Subject } from "../../types/loginTypes/subjectTypes";

// ============================================================
// PROPS INTERFACE
// ============================================================
interface ClassSelectFormProps {
  selectedClass: string; // Currently selected class ID
  selectedSubjectIds: string[]; // Array of selected subject IDs
  subjects: Subject[]; // All available subjects from master
  existingConfigSubjects?: Subject[]; // Subjects already assigned to this class (for edit mode)
  onClassSelect: (classId: string) => void; // Callback when class changes
  onSubjectToggle: (subjectId: string) => void; // Callback when subject checkbox toggled
  onSubmit: (config: any) => void; // Callback when form submitted
  onReset: () => void; // Callback to reset form
}

// ============================================================
// CLASS LIST CONSTANT
// ============================================================
// Defines all available classes with their IDs and sections
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

// ============================================================
// MAIN COMPONENT
// ============================================================
const ClassSelectForm: React.FC<ClassSelectFormProps> = ({
  selectedClass,
  selectedSubjectIds,
  subjects,
  existingConfigSubjects = [],
  onClassSelect,
  onSubjectToggle,
  onSubmit,
}) => {
  // ============================================================
  // STATE MANAGEMENT
  // ============================================================

  // STATE: customMarks
  // PURPOSE: Stores custom marks overrides for specific subjects
  // STRUCTURE: { [subjectId]: { totalMarks, academicMarks, behavioralMarks } }
  // USAGE: When user clicks ⚙️ button and changes marks for a subject
  const [customMarks, setCustomMarks] = useState<
    Record<
      string,
      {
        totalMarks: number;
        academicMarks: number;
        behavioralMarks: number;
      }
    >
  >({});

  // STATE: showOverrideFor
  // PURPOSE: Tracks which subject's custom marks panel is currently open
  // VALUE: subjectId (string) or null if none open
  // USAGE: Controls visibility of the custom marks input panel
  const [showOverrideFor, setShowOverrideFor] = useState<string | null>(null);

  // PURPOSE: Extracts IDs of subjects that are already assigned to this class
  // USAGE: Used to filter out already assigned subjects from available list
  const assignedSubjectIds = useMemo(() => {
    return existingConfigSubjects.map((s) => s._id).filter(Boolean);
  }, [existingConfigSubjects]);

  // PURPOSE: Filters subjects to show only those NOT already assigned
  // LOGIC:
  //   1. If subject is in assignedSubjectIds AND not in current selection → hide it
  //   2. Otherwise (new subject or already selected) → show it
  const availableSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      // Hide if already assigned AND not currently selected for editing
      if (
        assignedSubjectIds.includes(subject._id) &&
        !selectedSubjectIds.includes(subject._id!)
      ) {
        return false;
      }
      return true;
    });
  }, [subjects, assignedSubjectIds, selectedSubjectIds]);

  // ============================================================
  // SIDE EFFECTS
  // ============================================================

  // EFFECT: Load existing custom marks OR reset when class changes
  // PURPOSE:
  //   1. If editing existing class with custom marks → load them
  //   2. If switching to new class → reset all states
  useEffect(() => {
    setCustomMarks({});
    setShowOverrideFor(null);

    // ✅ LOAD: If editing existing configuration, load saved custom marks
    if (selectedClass && existingConfigSubjects.length > 0) {
      const loadedCustomMarks: Record<string, any> = {};

      existingConfigSubjects.forEach((subject: any) => {
        if (subject.customConfig) {
          loadedCustomMarks[subject._id!] = subject.customConfig;
        }
      });

      // Only update if there are custom marks to load
      if (Object.keys(loadedCustomMarks).length > 0) {
        setCustomMarks(loadedCustomMarks);
      }
    }
  }, [selectedClass, existingConfigSubjects]);

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  // HANDLER: handleCustomMarksChange
  // PURPOSE: Updates custom marks state when user modifies marks in override panel
  // PARAMS:
  //   - subjectId: ID of subject being modified
  //   - field: Which mark field is being changed (totalMarks/academicMarks/behavioralMarks)
  //   - value: New mark value
  // LOGIC:
  //   - Updates the specific field for the subject
  //   - If totalMarks changes, auto-populates academicMarks with same value
  //   - Validates marks (cannot be negative, total cannot exceed 100)
  const handleCustomMarksChange = (
    subjectId: string,
    field: "totalMarks" | "academicMarks" | "behavioralMarks",
    value: number,
  ) => {
    // Validation: prevent negative values
    if (value < 0) value = 0;
    // Validation: total marks cannot exceed 100
    if (field === "totalMarks" && value > 100) value = 100;

    setCustomMarks((prev) => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [field]: value,
        // If total marks changed, auto-set academic marks to same value
        // and behavioral marks to 0 (for non-100 marks subjects)
        ...(field === "totalMarks" && {
          academicMarks: value,
          behavioralMarks: 0,
        }),
      },
    }));
  };

  // HANDLER: handleSubmit
  // PURPOSE: Validates form and submits the class subject configuration
  // STEPS:
  //   1. Validate class is selected
  //   2. Validate at least one subject is selected
  //   3. Build config object with class info
  //   4. Add customConfig to subjects that have overridden marks
  //   5. Call onSubmit callback
  //   6. Reset custom marks state
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // VALIDATION: Check if class is selected
    if (!selectedClass) {
      Swal.fire("সতর্কতা!", "দয়া করে একটি ক্লাস নির্বাচন করুন", "warning");
      return;
    }

    // VALIDATION: Check if at least one subject is selected
    if (selectedSubjectIds.length === 0) {
      Swal.fire(
        "সতর্কতা!",
        "দয়া করে অন্তত একটি বিষয় নির্বাচন করুন",
        "warning",
      );
      return;
    }

    // Get class information from the classes array
    const classInfo = classes.find((c) => c.id === selectedClass);
    const currentYear = new Date().getFullYear().toString();

    // Build configuration object
    const config = {
      classId: selectedClass,
      className: classInfo?.name || "",
      section: classInfo?.section || "primary",
      academicYear: currentYear,
      // Map each selected subject to the format expected by API
      subjects: selectedSubjectIds.map((subjectId, index) => {
        const custom = customMarks[subjectId];
        return {
          subjectId,
          order: index,
          isActive: true,
          // Include customConfig ONLY if marks were overridden for this subject
          ...(custom && {
            customConfig: {
              totalMarks: custom.totalMarks,
              academicMarks: custom.academicMarks,
              behavioralMarks: custom.behavioralMarks,
            },
          }),
        };
      }),
    };

    // Submit the configuration
    onSubmit(config);

    // Reset custom marks state after successful submission
    setCustomMarks({});
    setShowOverrideFor(null);
  };

  // ============================================================
  // JSX RENDER - COMPONENT UI
  // ============================================================

  return (
    // Main form card container
    <div className={styles.formCard}>
      {/* ==================== FORM HEADER ==================== */}
      <h3 className={styles.formTitle}>
        <FaPlus /> ক্লাসের বিষয় নির্ধারণ / সম্পাদনা
      </h3>

      {/* ==================== FORM BODY ==================== */}
      <form onSubmit={handleSubmit}>
        {/* ========== SECTION 1: CLASS SELECTION ========== */}
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

        {/* ========== SECTION 2: SUBJECT SELECTION (only if class selected) ========== */}
        {selectedClass && (
          <>
            {/* Subject Selection Area */}
            <div className={styles.formGroup}>
              {/* Show label only if there are available subjects */}
              {availableSubjects.length > 0 && (
                <label>বিষয় নির্বাচন করুন (একাধিক নির্বাচন করতে পারেন)</label>
              )}

              {/* Warning when no subjects available to assign */}
              {availableSubjects.length === 0 && (
                <div className={styles.warningBox}>
                  <p>
                    ⚠️ এই ক্লাসের জন্য সকল বিষয় ইতিমধ্যে নির্ধারণ করা হয়েছে।
                  </p>
                </div>
              )}

              {/* ========== SUBJECT CHECKLIST ========== */}
              <div className={styles.subjectChecklist}>
                {availableSubjects.map((subject) => {
                  // Check if this subject is currently selected
                  const isSelected = selectedSubjectIds.includes(subject._id!);
                  // Check if this subject has custom marks override
                  const hasCustomMarks = customMarks[subject._id!];
                  // Check if the override panel is open for this subject
                  const isOverriding = showOverrideFor === subject._id;

                  return (
                    <div key={subject._id} className={styles.checkboxItem}>
                      {/* SUBJECT CHECKBOX */}
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={isSelected}
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

                      {/* OVERRIDE BUTTON - Gear icon to open custom marks panel */}
                      {/* Only visible when subject is selected */}
                      {isSelected && (
                        <button
                          type="button"
                          className={styles.overrideBtn}
                          onClick={() =>
                            setShowOverrideFor(
                              isOverriding ? null : subject._id!,
                            )
                          }
                          title="মার্কস কাস্টমাইজ করুন"
                        >
                          ⚙️
                        </button>
                      )}

                      {/* CUSTOM MARKS PANEL - Shows when user clicks gear icon */}
                      {isSelected && isOverriding && (
                        <div className={styles.customMarksPanel}>
                          {/* Panel Header */}
                          <div className={styles.customMarksHeader}>
                            <span>{subject.nameBn} - কাস্টম মার্কস</span>
                            <button
                              type="button"
                              onClick={() => {
                                // Clear custom marks and close panel
                                setCustomMarks((prev) => {
                                  const newMarks = { ...prev };
                                  delete newMarks[subject._id!];
                                  return newMarks;
                                });
                                setShowOverrideFor(null);
                              }}
                            >
                              ✕
                            </button>
                          </div>

                          {/* Custom Marks Input Fields */}
                          <div className={styles.customMarksRow}>
                            {/* Total Marks Field */}
                            <div>
                              <label>মোট মার্কস</label>
                              <input
                                type="number"
                                value={
                                  hasCustomMarks?.totalMarks ||
                                  subject.totalMarks
                                }
                                onChange={(e) =>
                                  handleCustomMarksChange(
                                    subject._id!,
                                    "totalMarks",
                                    Number(e.target.value),
                                  )
                                }
                              />
                            </div>

                            {/* Academic Marks Field */}
                            <div>
                              <label>একাডেমিক</label>
                              <input
                                type="number"
                                value={
                                  hasCustomMarks?.academicMarks ||
                                  subject.academicMarks
                                }
                                onChange={(e) =>
                                  handleCustomMarksChange(
                                    subject._id!,
                                    "academicMarks",
                                    Number(e.target.value),
                                  )
                                }
                              />
                            </div>

                            {/* Behavioral Marks Field */}
                            <div>
                              <label>বিহেভিওরাল</label>
                              <input
                                type="number"
                                value={
                                  hasCustomMarks?.behavioralMarks ||
                                  subject.behavioralMarks
                                }
                                onChange={(e) =>
                                  handleCustomMarksChange(
                                    subject._id!,
                                    "behavioralMarks",
                                    Number(e.target.value),
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========== SECTION 3: SELECTED SUBJECTS PREVIEW ========== */}
            {/* Shows all selected subjects with option to remove */}
            {selectedSubjectIds.length > 0 && availableSubjects.length > 0 && (
              <div className={styles.selectedPreview}>
                {/* Preview Header with count */}
                <div className={styles.previewHeader}>
                  <strong>নির্বাচিত বিষয়সমূহ:</strong>
                  <span>{selectedSubjectIds.length} টি বিষয়</span>
                </div>

                {/* Preview List - Each selected subject with remove button */}
                <div className={styles.previewList}>
                  {selectedSubjectIds.map((subjectId) => {
                    const subject = subjects.find((s) => s._id === subjectId);
                    return subject ? (
                      <div key={subjectId} className={styles.previewItem}>
                        <span>
                          {subject.nameBn} ({subject.code})
                          {/* Show custom marks badge if this subject has overridden marks */}
                          {customMarks[subjectId] && (
                            <span className={styles.customBadge}>
                              {customMarks[subjectId].totalMarks} Marks
                            </span>
                          )}
                        </span>
                        {/* Remove button to deselect subject */}
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

            {/* ========== SECTION 4: SUBMIT BUTTON ========== */}
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
