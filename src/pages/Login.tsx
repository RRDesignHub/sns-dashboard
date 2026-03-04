import React, { useState } from "react";
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
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

    if (!validateForm()) return;

    // setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/api/users/login`,
        { email: formData.email, password: formData.password },
      );

      console.log(data);
    } catch (err) {
      console.log(err);
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
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
              disabled={isLoading}
            >
              {isLoading ? (
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
