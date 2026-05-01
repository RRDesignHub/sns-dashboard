// components/PageHeader.tsx
import React, { type ReactNode } from "react";
import styles from "../../styles/DashboardPages/AssignClassSub.module.scss";

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, title, subtitle }) => {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.headerContent}>
        <div className={styles.headerIcon}>{icon}</div>
        <div>
          <h1 className={styles.pageTitle}>{title}</h1>
          <p className={styles.pageSubtitle}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
