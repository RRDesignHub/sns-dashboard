// components/StatsCards.tsx
import React from "react";
import styles from "../../styles/DashboardPages/AssignClassSub.module.scss";

interface StatsCardsProps {
  totalClasses: number;
  configuredClasses: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalClasses,
  configuredClasses,
}) => {
  return (
    <div className={styles.statsContainer}>
      <div className={styles.statCard}>
        <div className={styles.statValue}>{totalClasses}</div>
        <div className={styles.statLabel}>মোট ক্লাস</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statValue}>{configuredClasses}</div>
        <div className={styles.statLabel}>বিষয় নির্ধারিত ক্লাস</div>
      </div>
    </div>
  );
};

export default StatsCards;
