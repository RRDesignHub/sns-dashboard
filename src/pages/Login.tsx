import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaArrowLeft,
  FaSchool,
  FaSpinner,
} from "react-icons/fa";
import styles from "./../styles/Login.module.scss";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login, loader } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    // Email validation
    if (!formData.email) {
      newErrors.email = "ইমেইল ঠিকানা দিন";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "সঠিক ইমেইল ঠিকানা দিন";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "পাসওয়ার্ড দিন";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = formData.email;
    const password = formData.password;
    if (!validateForm()) return;

    // Start loadings
    setLoading(true);

    try {
      const response = await login({ email, password });

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "লগইন সফল হয়েছে",
          text: `স্বাগতম ${response.data.name}`,
          timer: 1500,
          showConfirmButton: false,
        });

        // Redirect based on role
        switch (response.data.role) {
          case "admin":
            navigate("/dashboard/overview");
            break;
          case "teacher":
            navigate("/teacher/dashboard");
            break;
          case "accountant":
            navigate("/accountant/dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "লগইন ব্যর্থ হয়েছে",
        text: error.response?.data?.message || "ইমেইল বা পাসওয়ার্ড ভুল",
        confirmButtonColor: "#166534",
      });
    } finally {
      // Stop loadings
      setLoading(false);
    }
  };
  return (
    <div className={styles.loginPage}>
      {/* Background Decoration */}
      <div className={styles.backgroundDecoration}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>

      <div className={styles.loginContainer}>
        {/* Back to Home Link */}
        <Link to="/" className={styles.backLink}>
          <FaArrowLeft />
          <span>হোম পৃষ্ঠায় ফিরুন</span>
        </Link>

        {/* Login Card */}
        <div className={styles.loginCard}>
          {/* Header */}
          <div className={styles.cardHeader}>
            <div className={styles.logoWrapper}>
              <FaSchool className={styles.logo} />
            </div>
            <h1 className={styles.title}>সাইন ইন করুন</h1>
            <p className={styles.subtitle}>
              আপনার একাউন্টে প্রবেশ করতে ইমেইল ও পাসওয়ার্ড দিন
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            {/* Email Field */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                <FaEnvelope className={styles.labelIcon} />
                <span>ইমেইল ঠিকানা</span>
              </label>
              <div
                className={`${styles.inputWrapper} ${errors.email ? styles.error : ""}`}
              >
                <FaEnvelope className={styles.inputIcon} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.formInput}
                  disabled={loading || loader}
                />
              </div>
              {errors.email && (
                <span className={styles.errorMessage}>{errors.email}</span>
              )}
            </div>

            {/* Password Field */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                <FaLock className={styles.labelIcon} />
                <span>পাসওয়ার্ড</span>
              </label>
              <div
                className={`${styles.inputWrapper} ${errors.password ? styles.error : ""}`}
              >
                <FaLock className={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.formInput}
                  disabled={loading || loader}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || loader}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <span className={styles.errorMessage}>{errors.password}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || loader}
            >
              {loading || loader ? (
                <>
                  <FaSpinner className={styles.spinner} />
                  <span>প্রবেশ করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  <span>সাইন ইন করুন</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
