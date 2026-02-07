import { Outlet } from "react-router-dom";
import SidebarNav from "../../../components/DashboardComponents/SidebarNav";
import styles from "./../../../styles/layouts/Dashboard.module.scss";

const DashboardLayout: React.FC = () => {
  return (
    <div className={styles.dashboardParent}>
      <aside className={styles.aside}>
        <SidebarNav />
      </aside>
      
      <main className={styles.mainContent}>
        {/* This is where Overview, AllUsers, etc. will render */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default DashboardLayout;