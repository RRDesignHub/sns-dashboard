import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaUserShield,
  FaSpinner,
} from "react-icons/fa";
import { MdWarning } from "react-icons/md";
import styles from "../../../styles/DashboardPages/CreateUserPage.module.scss";

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

const CreateUser: React.FC = () => {
  // const axiosSecure = useAxiosSec();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState<PasswordValidation>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (pass: string) => {
    const newValidation = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*]/.test(pass),
    };

    setValidation(newValidation);
    setPassword(pass);
  };

  const isPasswordValid = () => {
    return Object.values(validation).every(Boolean);
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPasswordValid()) {
      Swal.fire({
        icon: "error",
        title: "পাসওয়ার্ড বৈধ নয়",
        text: "দয়া করে একটি শক্তিশালী পাসওয়ার্ড প্রদান করুন।",
        confirmButtonColor: "#166534",
      });
      return;
    }

    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const newUser = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: password,
      role: formData.get("role"),
    };

    form.reset();
    setPassword("");
    setValidation({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    });
    console.log(newUser);
    setIsSubmitting(false);

    // try {
    //   const { data } = await axiosSecure.post(`/create-user`, newUser);

    //   if (data?.message) {
    //     Swal.fire({
    //       icon: 'info',
    //       title: data.message,
    //       confirmButtonColor: '#166534'
    //     });
    //     return;
    //   }

    //   if (data.insertedId) {
    //     Swal.fire({
    //       position: "center",
    //       icon: "success",
    //       title: `${newUser.name}’কে সফলভাবে ${newUser.role}-এ অনুমতি দেয়া হয়েছে!`,
    //       showConfirmButton: true,
    //       confirmButtonColor: '#166534',
    //       timer: 1500,
    //     });
    //   }
    // } catch (err: any) {
    //   console.error(err);

    //   let errorMessage = "ইউজার তৈরিতে সমস্যা হয়েছে। পরে চেষ্টা করুন।";

    //   if (err.response?.data?.message) {
    //     errorMessage = err.response.data.message;
    //   } else if (err.response?.status === 409) {
    //     errorMessage = "এই ইমেইল ইতিমধ্যে রেজিস্টার্ড আছে।";
    //   }

    //   Swal.fire({
    //     icon: 'error',
    //     title: 'ত্রুটি',
    //     text: errorMessage,
    //     confirmButtonColor: '#166534'
    //   });
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className={styles.createUserPage}>
      {/* Header Section */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <FaUserPlus size={32} />
          </div>
          <div>
            <h1 className={styles.pageTitle}>নতুন ইউজার তৈরি করুন</h1>
            <p className={styles.pageSubtitle}>
              শিক্ষক/হিসাবরক্ষক/অ্যাডমিন রেজিস্ট্রেশনের জন্য নিচের ফর্ম পূরণ
              করুন।
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className={styles.formContainer}>
        <form onSubmit={handleCreateUser} className={styles.userForm}>
          {/* Name Field */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <FaUser size={18} />
              <span>পূর্ণ নাম</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                name="name"
                placeholder="আপনার পূর্ণ নাম লিখুন"
                className={styles.formInput}
                required
              />
              <div className={styles.inputIcon}>
                <FaUser size={18} />
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <FaEnvelope size={18} />
              <span>ইমেইল ঠিকানা</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                className={styles.formInput}
                required
              />
              <div className={styles.inputIcon}>
                <FaEnvelope size={18} />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <FaLock size={18} />
              <span>পাসওয়ার্ড</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => validatePassword(e.target.value)}
                placeholder="********"
                className={styles.formInput}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
              <div className={styles.inputIcon}>
                <FaLock size={18} />
              </div>
            </div>

            {/* Password Validation */}
            <div className={styles.passwordValidation}>
              <div className={styles.validationTitle}>
                <FaExclamationCircle size={16} />
                <span>পাসওয়ার্ড প্রয়োজনীয়তা:</span>
              </div>

              <div className={styles.validationList}>
                <div
                  className={`${styles.validationItem} ${validation.length ? styles.valid : ""}`}
                >
                  {validation.length ? (
                    <FaCheckCircle size={16} />
                  ) : (
                    <FaTimesCircle size={16} />
                  )}
                  <span>কমপক্ষে ৮টি অক্ষর</span>
                </div>

                <div
                  className={`${styles.validationItem} ${validation.uppercase ? styles.valid : ""}`}
                >
                  {validation.uppercase ? (
                    <FaCheckCircle size={16} />
                  ) : (
                    <FaTimesCircle size={16} />
                  )}
                  <span>একটি বড় হাতের অক্ষর (A-Z)</span>
                </div>

                <div
                  className={`${styles.validationItem} ${validation.lowercase ? styles.valid : ""}`}
                >
                  {validation.lowercase ? (
                    <FaCheckCircle size={16} />
                  ) : (
                    <FaTimesCircle size={16} />
                  )}
                  <span>একটি ছোট হাতের অক্ষর (a-z)</span>
                </div>

                <div
                  className={`${styles.validationItem} ${validation.number ? styles.valid : ""}`}
                >
                  {validation.number ? (
                    <FaCheckCircle size={16} />
                  ) : (
                    <FaTimesCircle size={16} />
                  )}
                  <span>একটি সংখ্যা (0-9)</span>
                </div>

                <div
                  className={`${styles.validationItem} ${validation.special ? styles.valid : ""}`}
                >
                  {validation.special ? (
                    <FaCheckCircle size={16} />
                  ) : (
                    <FaTimesCircle size={16} />
                  )}
                  <span>একটি বিশেষ চিহ্ন (!@#$%^&*)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <FaShieldAlt size={18} />
              <span>ভূমিকা নির্বাচন করুন</span>
            </label>
            <div className={styles.roleOptions}>
              {[
                {
                  value: "Teacher",
                  label: "শিক্ষক/শিক্ষিকা",
                  icon: <FaChalkboardTeacher size={24} />,
                  description: "ক্লাস ও রেজাল্ট ম্যানেজমেন্ট",
                },
                {
                  value: "Accountant",
                  label: "হিসাবরক্ষক",
                  icon: <FaMoneyBillWave size={24} />,
                  description: "ফাইন্যান্স ও একাউন্টস",
                },
                {
                  value: "Admin",
                  label: "অ্যাডমিন",
                  icon: <FaUserShield size={24} />,
                  description: "ফুল সিস্টেম কন্ট্রোল",
                },
              ].map((role) => (
                <div key={role.value} className={styles.roleOption}>
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    id={`role-${role.value}`}
                    className={styles.roleRadio}
                    required
                  />
                  <label
                    htmlFor={`role-${role.value}`}
                    className={styles.roleLabel}
                  >
                    <div className={styles.roleIcon}>{role.icon}</div>
                    <div className={styles.roleInfo}>
                      <span className={styles.roleName}>{role.label}</span>
                      <span className={styles.roleDescription}>
                        {role.description}
                      </span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || !isPasswordValid()}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className={styles.spinner} size={20} />
                  <span>ক্রিয়েট করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <FaUserPlus size={20} />
                  <span>ইউজার তৈরি করুন</span>
                </>
              )}
            </button>

            <button
              type="reset"
              className={styles.resetButton}
              onClick={() => {
                setPassword("");
                setValidation({
                  length: false,
                  uppercase: false,
                  lowercase: false,
                  number: false,
                  special: false,
                });
              }}
            >
              ফর্ম রিসেট করুন
            </button>
          </div>
        </form>

        {/* Form Side Info */}
        <div className={styles.formSideInfo}>
          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <FaShieldAlt size={24} />
              <h3 className={styles.infoTitle}>ইউজার ভূমিকা নির্দেশিকা</h3>
            </div>

            <div className={styles.infoContent}>
              <div className={styles.roleGuideline}>
                <div className={styles.roleBadge}>
                  <FaChalkboardTeacher size={24} />
                </div>
                <div>
                  <h4 className={styles.roleTitle}>শিক্ষক</h4>
                  <p className={styles.roleDesc}>
                    শিক্ষার্থী ম্যানেজমেন্ট, ফলাফল আপডেট, ক্লাস রুটিন
                  </p>
                </div>
              </div>

              <div className={styles.roleGuideline}>
                <div className={styles.roleBadge}>
                  <FaMoneyBillWave size={24} />
                </div>
                <div>
                  <h4 className={styles.roleTitle}>হিসাবরক্ষক</h4>
                  <p className={styles.roleDesc}>
                    ফি কালেকশন, বেতন ম্যানেজমেন্ট, আর্থিক রিপোর্ট
                  </p>
                </div>
              </div>

              <div className={styles.roleGuideline}>
                <div className={styles.roleBadge}>
                  <FaUserShield size={24} />
                </div>
                <div>
                  <h4 className={styles.roleTitle}>অ্যাডমিন</h4>
                  <p className={styles.roleDesc}>
                    সম্পূর্ণ সিস্টেম কন্ট্রোল, সকল ইউজার ম্যানেজমেন্ট
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
