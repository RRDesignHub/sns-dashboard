import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome, FaRedoAlt, FaSadTear } from "react-icons/fa";
import styles from "../styles/ErrorPage.module.scss";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className={styles.errorPage}>
      {/* Background Decoration */}
      <div className={styles.bgDecoration}>
        <div className={styles.bgCircle1}></div>
        <div className={styles.bgCircle2}></div>
        <div className={styles.bgCircle3}></div>
      </div>

      <div className={styles.errorContainer}>
        {/* Error Icon */}
        <div className={styles.errorIconWrapper}>
          <div className={styles.iconBg}>
            <FaSadTear className={styles.errorIcon} /> <span>404</span>
          </div>
        </div>

        {/* Error Message */}
        <div className={styles.errorContent}>
          <h1 className={styles.errorTitle}>পেজ পাওয়া যায়নি</h1>
        </div>

        {/* Action Buttons */}
        <div className={styles.errorActions}>
          <button
            onClick={handleGoBack}
            className={`${styles.actionButton} ${styles.backButton}`}
          >
            <FaArrowLeft />
            <span>পিছনে যান</span>
          </button>

          <button
            onClick={handleGoHome}
            className={`${styles.actionButton} ${styles.homeButton}`}
          >
            <FaHome />
            <span>হোম পেজে যান</span>
          </button>

          <button
            onClick={handleRetry}
            className={`${styles.actionButton} ${styles.retryButton}`}
          >
            <FaRedoAlt />
            <span>পুনরায় চেষ্টা করুন</span>
          </button>
        </div>

        {/* Help Text */}
        <div className={styles.helpText}>
          <p>
            যদি সমস্যাটি থেকে থাকে, অনুগ্রহ করে আমাদের
            <a href="https://ripanulalam.netlify.app"> সাপোর্ট টিম </a>
            এর সাথে যোগাযোগ করুন।
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
