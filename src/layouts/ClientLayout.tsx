import { Outlet } from "react-router-dom";
import styles from "../styles/layouts/ClientLayout.module.scss";

const ClientLayout = () => {
  return (
    <div className={styles.clientLayout}>
      {/* ============ HEADER ============ */}
      <header className={styles.clientHeader}>
        <div className={styles.headerInner}>
          <div className={styles.headerRow}>
            {/* Left: Logo in gold-ringed glass card */}
            <div className={styles.logoWrap}>
              <img src={"./logo.png"} alt="School Logo" />
            </div>

            {/* Right: School Info */}
            <div className={styles.schoolInfo}>
              <h1>শাহ্ নেয়ামত (রহঃ) কেজি এন্ড হাই স্কুল</h1>
              <p>১নং বোর্ড বাজার, চরলক্ষ্যা, কর্ণফুলী, চট্টগ্রাম</p>
            </div>
          </div>
        </div>

        {/* Gold accent bar */}
        <div className={styles.accentBar}></div>
      </header>

      {/* ============ MAIN ============ */}
      <main className={styles.clientMain}>
        <Outlet />
      </main>

      {/* ============ FOOTER ============ */}
      <footer className={styles.clientFooter}>
        <div className={styles.footerInner}>
          <p>
            © {new Date().getFullYear()} শাহ্ নেয়ামত (রহঃ) কেজি এন্ড হাই স্কুল।
            সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
