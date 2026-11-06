import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  FaUserPlus,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaGraduationCap,
  FaUser,
  FaBookOpen,
  FaIdCard,
  FaPhone,
  FaImage,
  FaCalendarAlt,
  FaUserGraduate,
} from "react-icons/fa";
import styles from "../../../styles/DashboardPages/AddStudentFrom.module.scss";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";
import imageUpload from "../../../Utility/Utils";
import type { StudentFormData } from "../../../types/StudentDataTypes";

const PRIMARY_CLASSES = ["Play", "Nursery", "1", "2", "3", "4", "5"];
const HIGHER_CLASSES = ["6", "7", "8", "9", "10"];

const CLASS_LABELS: Record<string, string> = {
  Play: "প্লে",
  Nursery: "নার্সারি",
  "1": "প্রথম শ্রেণি",
  "2": "দ্বিতীয় শ্রেণি",
  "3": "তৃতীয় শ্রেণি",
  "4": "চতুর্থ শ্রেণি",
  "5": "পঞ্চম শ্রেণি",
  "6": "ষষ্ঠ শ্রেণি",
  "7": "সপ্তম শ্রেণি",
  "8": "অষ্টম শ্রেণি",
  "9": "নবম শ্রেণি",
  "10": "দশম শ্রেণি",
};

const GROUPS = [
  { value: "Science", label: "বিজ্ঞান" },
  { value: "Commerce", label: "বাণিজ্য" },
  { value: "Humanities", label: "মানবিক" },
  { value: "Vocational", label: "কারিগরি" },
];

const SECTIONS = ["A", "B", "C", "D", "E"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const RELIGIONS = [
  { value: "Islam", label: "ইসলাম" },
  { value: "Hindu", label: "হিন্দু" },
  { value: "Christian", label: "খ্রিস্টান" },
  { value: "Buddhist", label: "বৌদ্ধ" },
  { value: "Other", label: "অন্যান্য" },
];

const YEARS = Array.from({ length: 5 }, (_, i) =>
  (new Date().getFullYear() - i).toString(),
);

const STEPS = [
  { id: 0, label: "একাডেমিক তথ্য", icon: FaBookOpen },
  { id: 1, label: "ব্যক্তিগত তথ্য", icon: FaUser },
  { id: 2, label: "অন্যান্য তথ্য", icon: FaIdCard },
];

export const AddStudent = () => {
  const axiosSecure = useAxiosSecure();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPosted, setIsPosted] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [largeFile, setLargeFile] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    defaultValues: {
      section: "primary",
      className: "Play",
      classRoll: "",
      groupName: "",
      sectionName: "",
      session: new Date().getFullYear().toString(),
      studentName: "",
      fatherName: "",
      motherName: "",
      mobileNo: "",
      birthRegNo: "",
      dateOfBirth: "",
      address: "",
      gender: "Male",
      bloodGroup: "A+",
      religion: "Islam",
    },
    mode: "onTouched",
  });

  const watchSection = watch("section");
  const watchClassName = watch("className");
  const watchGender = watch("gender");

  // Group is only for Higher + Class 9/10
  const showGroup =
    watchSection === "higher" && ["9", "10"].includes(watchClassName);

  // Image size validation
  useEffect(() => {
    if (imageFile && imageFile.size >= 40000) {
      setLargeFile("ছবি অবশ্যই ৪০ কিলোবাইট এর সমান বা ছোট হতে হবে!");
    } else {
      setLargeFile(null);
    }
  }, [imageFile]);

  // Image preview
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview("");
    }
  }, [imageFile]);

  const nextStep = async () => {
    let fields: (keyof StudentFormData)[] = [];

    if (currentStep === 0) {
      fields = ["section", "className", "classRoll", "session"];
    } else if (currentStep === 1) {
      fields = [
        "studentName",
        "fatherName",
        "motherName",
        "mobileNo",
        "dateOfBirth",
      ];
    }

    const ok = await trigger(fields);
    if (ok) setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: StudentFormData) => {
    if (imageFile && imageFile.size >= 40000) return;

    if (currentStep !== STEPS.length - 1) {
      await nextStep();
      return;
    }

    try {
      setIsPosted(true);

      let photoURL: string | undefined;
      if (imageFile) {
        photoURL = await imageUpload(imageFile);
      }

      const studentData = {
        ...data,
        studentID: `SN-${data.session}${
          data.birthRegNo.toString().slice(-4) || String(Date.now()).slice(-4)
        }`,
        image: photoURL || "https://i.ibb.co.com/V0jk4tCT/images.png",
        classRoll: data.classRoll.toString(),
        mobileNo: parseInt(data.mobileNo),
        groupName: showGroup ? data.groupName : "",
      };

      const { data: response } = await axiosSecure.post(
        `/api/students/add-student`,
        studentData,
      );

      if (response?.message && !response.insertedId) {
        Swal.fire({
          position: "center",
          icon: "info",
          title: response.message,
          showConfirmButton: false,
          timer: 1800,
        });
      }

      if (response.insertedId) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `${data.studentName} এর তথ্য সফলভাবে যুক্ত হয়েছে!`,
          showConfirmButton: false,
          timer: 1800,
        });
        reset();
        setImageFile(null);
        setImagePreview("");
        setCurrentStep(0);
      }
    } catch (err) {
      console.error("Student data adding Error -->", err);
      Swal.fire({
        icon: "error",
        title: "দুঃখিত!",
        text: "তথ্যটি সংরক্ষণ করা সম্ভব হয়নি। আবার চেষ্টা করুন।",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#166534",
      });
    } finally {
      setIsPosted(false);
    }
  };

  const handleFinalSubmit = () => {
    trigger().then((valid) => {
      if (valid) {
        handleSubmit(onSubmit)();
      } else {
        Swal.fire({
          icon: "warning",
          title: "তথ্য অসম্পূর্ণ",
          text: "সমস্ত প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।",
          confirmButtonColor: "#166534",
        });
      }
    });
  };

  const isFieldError = (field: keyof StudentFormData) => errors[field]?.message;

  return (
    <div className={styles.addStudentPage}>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <FaUserPlus />
        </div>
        <h1 className={styles.heroTitle}>শিক্ষার্থীর তথ্য সংযুক্তি</h1>
        <p className={styles.heroSubtitle}>
          ধাপে ধাপে শিক্ষার্থীর তথ্য পূরণ করুন — সহজ ও দ্রুত
        </p>
        <div className={styles.heroDecor}></div>
      </section>

      {/* ============ STEP INDICATOR ============ */}
      <div className={styles.stepIndicator}>
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentStep;
          const isDone = idx < currentStep;

          return (
            <div key={step.id} className={styles.stepWrapper}>
              <div
                className={`${styles.stepItem} ${
                  isActive ? styles.stepActive : ""
                } ${isDone ? styles.stepDone : ""}`}
              >
                <div className={styles.stepCircle}>
                  {isDone ? <FaCheck /> : <Icon />}
                </div>
                <span className={styles.stepLabel}>{step.label}</span>
              </div>

              {idx < STEPS.length - 1 && (
                <div
                  className={`${styles.stepConnector} ${
                    idx < currentStep ? styles.connectorDone : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ============ FORM CARD ============ */}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard}>
        <div className={styles.stepSlider}>
          <div
            className={styles.stepTrack}
            style={{ transform: `translateX(-${currentStep * 100}%)` }}
          >
            {/* ============ STEP 1 — ACADEMIC ============ */}
            <div className={styles.stepPane}>
              <div className={styles.paneHeader}>
                <div className={styles.paneHeaderIcon}>
                  <FaGraduationCap />
                </div>
                <div>
                  <h2>একাডেমিক তথ্য</h2>
                  <p>শিক্ষার্থীর শ্রেণি ও রোল সংক্রান্ত তথ্য</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                {/* Section */}
                <div className={styles.fieldGroup}>
                  <label>
                    শিক্ষার স্তর <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.sectionToggle}>
                    <label
                      className={`${styles.sectionOption} ${
                        watchSection === "primary" ? styles.sectionSelected : ""
                      }`}
                    >
                      <input
                        type="radio"
                        value="primary"
                        {...register("section", { required: true })}
                      />
                      <span>প্রাথমিক</span>
                      <small>(প্লে - ৫ম)</small>
                    </label>

                    <label
                      className={`${styles.sectionOption} ${
                        watchSection === "higher" ? styles.sectionSelected : ""
                      }`}
                    >
                      <input
                        type="radio"
                        value="higher"
                        {...register("section", { required: true })}
                      />
                      <span>উচ্চ</span>
                      <small>(৬ষ্ঠ - ১০ম)</small>
                    </label>
                  </div>
                </div>

                {/* Class */}
                <div className={styles.fieldGroup}>
                  <label>
                    শ্রেণি <span className={styles.required}>*</span>
                  </label>
                  <select
                    {...register("className", { required: true })}
                    className={styles.select}
                  >
                    {(watchSection === "primary"
                      ? PRIMARY_CLASSES
                      : HIGHER_CLASSES
                    ).map((cls) => (
                      <option key={cls} value={cls}>
                        {CLASS_LABELS[cls] || cls}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Roll */}
                <div className={styles.fieldGroup}>
                  <label>
                    রোল নম্বর <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder="যেমন: ১"
                    {...register("classRoll", {
                      required: "রোল নম্বর আবশ্যক",
                      min: { value: 1, message: "সর্বনিম্ন ১" },
                    })}
                    className={styles.input}
                  />
                  {isFieldError("classRoll") && (
                    <small className={styles.errorText}>
                      {isFieldError("classRoll")}
                    </small>
                  )}
                </div>

                {/* Group (conditional) */}
                {showGroup && (
                  <div className={styles.fieldGroup}>
                    <label>বিভাগ</label>
                    <select
                      {...register("groupName")}
                      className={styles.select}
                    >
                      <option value="">-- বিভাগ নির্বাচন করুন --</option>
                      {GROUPS.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Section */}
                <div className={styles.fieldGroup}>
                  <label>শাখা</label>
                  <select
                    {...register("sectionName")}
                    className={styles.select}
                  >
                    <option value="">-- শাখা নির্বাচন করুন --</option>
                    {SECTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Session */}
                <div className={styles.fieldGroup}>
                  <label>
                    শিক্ষাবর্ষ <span className={styles.required}>*</span>
                  </label>
                  <select
                    {...register("session", { required: true })}
                    className={styles.select}
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ============ STEP 2 — PERSONAL ============ */}
            <div className={styles.stepPane}>
              <div className={styles.paneHeader}>
                <div className={styles.paneHeaderIcon}>
                  <FaUser />
                </div>
                <div>
                  <h2>ব্যক্তিগত তথ্য</h2>
                  <p>শিক্ষার্থী ও পরিবারের তথ্য (ইংরেজিতে লিখুন)</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                {/* Student Name */}
                <div className={styles.fieldGroup}>
                  <label>
                    শিক্ষার্থীর নাম <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: Md. Rahim Uddin"
                    {...register("studentName", {
                      required: "শিক্ষার্থীর নাম আবশ্যক",
                    })}
                    className={styles.input}
                  />
                  {isFieldError("studentName") && (
                    <small className={styles.errorText}>
                      {isFieldError("studentName")}
                    </small>
                  )}
                </div>

                {/* Father's Name */}
                <div className={styles.fieldGroup}>
                  <label>
                    পিতার নাম <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: Md. Karim Uddin"
                    {...register("fatherName", {
                      required: "পিতার নাম আবশ্যক",
                    })}
                    className={styles.input}
                  />
                  {isFieldError("fatherName") && (
                    <small className={styles.errorText}>
                      {isFieldError("fatherName")}
                    </small>
                  )}
                </div>

                {/* Mother's Name */}
                <div className={styles.fieldGroup}>
                  <label>
                    মাতার নাম <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: Mrs. Fatima Begum"
                    {...register("motherName", {
                      required: "মাতার নাম আবশ্যক",
                    })}
                    className={styles.input}
                  />
                  {isFieldError("motherName") && (
                    <small className={styles.errorText}>
                      {isFieldError("motherName")}
                    </small>
                  )}
                </div>

                {/* Date of Birth */}
                <div className={styles.fieldGroup}>
                  <label>
                    <FaCalendarAlt className={styles.inlineIcon} /> জন্ম তারিখ{" "}
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    {...register("dateOfBirth", {
                      required: "জন্ম তারিখ আবশ্যক",
                    })}
                    className={styles.input}
                  />
                  {isFieldError("dateOfBirth") && (
                    <small className={styles.errorText}>
                      {isFieldError("dateOfBirth")}
                    </small>
                  )}
                </div>

                {/* Mobile */}
                <div className={styles.fieldGroup}>
                  <label>
                    <FaPhone className={styles.inlineIcon} /> মোবাইল নম্বর{" "}
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="যেমন: 01812345678"
                    {...register("mobileNo", {
                      required: "মোবাইল নম্বর আবশ্যক",
                      pattern: {
                        value: /^01[3-9]\d{8}$/,
                        message: "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন",
                      },
                    })}
                    className={styles.input}
                  />
                  {isFieldError("mobileNo") && (
                    <small className={styles.errorText}>
                      {isFieldError("mobileNo")}
                    </small>
                  )}
                </div>

                {/* Birth Reg No */}
                <div className={styles.fieldGroup}>
                  <label>
                    জন্ম নিবন্ধন নম্বর{" "}
                    <span className={styles.optional}>(ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="যেমন: 20161516124129538"
                    {...register("birthRegNo")}
                    className={styles.input}
                  />
                </div>

                {/* Address */}
                <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                  <label>
                    ঠিকানা <span className={styles.optional}>(ঐচ্ছিক)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="গ্রাম/শহর, ডাকঘর, উপজেলা, জেলা"
                    {...register("address")}
                    className={styles.textarea}
                  />
                </div>
              </div>
            </div>

            {/* ============ STEP 3 — OTHER ============ */}
            <div className={styles.stepPane}>
              <div className={styles.paneHeader}>
                <div className={styles.paneHeaderIcon}>
                  <FaIdCard />
                </div>
                <div>
                  <h2>অন্যান্য তথ্য</h2>
                  <p>শিক্ষার্থীর শারীরিক ও ব্যক্তিগত বিবরণ</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                {/* Gender */}
                <div className={styles.fieldGroup}>
                  <label>
                    লিঙ্গ <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.genderToggle}>
                    <label
                      className={`${styles.genderOption} ${
                        watchGender === "Male" ? styles.genderSelected : ""
                      }`}
                    >
                      <input
                        type="radio"
                        value="Male"
                        {...register("gender", { required: true })}
                      />
                      <span>ছেলে</span>
                    </label>
                    <label
                      className={`${styles.genderOption} ${
                        watchGender === "Female" ? styles.genderSelected : ""
                      }`}
                    >
                      <input
                        type="radio"
                        value="Female"
                        {...register("gender", { required: true })}
                      />
                      <span>মেয়ে</span>
                    </label>
                  </div>
                </div>

                {/* Blood Group */}
                <div className={styles.fieldGroup}>
                  <label>রক্তের গ্রুপ</label>
                  <select {...register("bloodGroup")} className={styles.select}>
                    {BLOOD_GROUPS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Religion */}
                <div className={styles.fieldGroup}>
                  <label>
                    ধর্ম <span className={styles.required}>*</span>
                  </label>
                  <select
                    {...register("religion", { required: true })}
                    className={styles.select}
                  >
                    {RELIGIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image Upload */}
                <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                  <label>
                    <FaImage className={styles.inlineIcon} /> শিক্ষার্থীর ছবি{" "}
                    <span className={styles.optional}>(ঐচ্ছিক)</span>
                  </label>
                  <div className={styles.imageUploadRow}>
                    <div className={styles.imagePreviewBox}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" />
                      ) : (
                        <FaUserGraduate />
                      )}
                    </div>
                    <div className={styles.imageInputWrapper}>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={(e) =>
                          setImageFile(e.target.files?.[0] || null)
                        }
                        className={styles.fileInput}
                        id="student-image"
                      />
                      <label
                        htmlFor="student-image"
                        className={styles.fileInputLabel}
                      >
                        ছবি আপলোড করুন
                      </label>
                      <small className={styles.helpText}>
                        jpg / jpeg / png — সর্বোচ্চ ৪০ কিলোবাইট
                      </small>
                      {largeFile && (
                        <small className={styles.errorText}>{largeFile}</small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ NAVIGATION ============ */}
        <div className={styles.formNavigation}>
          <button
            type="button"
            className={styles.prevBtn}
            onClick={prevStep}
            disabled={currentStep === 0 || isPosted}
          >
            <FaArrowLeft /> পূর্ববর্তী
          </button>

          <div className={styles.stepCounter}>
            ধাপ {currentStep + 1} / {STEPS.length}
          </div>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              className={styles.nextBtn}
              onClick={nextStep}
              disabled={isPosted}
            >
              পরবর্তী <FaArrowRight />
            </button>
          ) : (
            <button
              type="button"
              className={styles.submitBtn}
              onClick={handleFinalSubmit}
              disabled={isPosted}
            >
              {isPosted ? (
                <>
                  <span className={styles.spinner}></span>
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <FaCheck /> তথ্য সংরক্ষণ করুন
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
