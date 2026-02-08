import { Outlet } from "react-router-dom";
import styles from "../styles/layouts/Dashboard.module.scss";
import SidebarNav from "../components/DashboardComponents/SidebarNav";

const DashboardLayout = () => {
  return (
    <section className={styles.dashboardParent}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <SidebarNav />
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </section>
  );
};

export default DashboardLayout;
