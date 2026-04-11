import { Link, Outlet } from "react-router-dom";
import styles from "../styles/layouts/Dashboard.module.scss";
import SidebarNav from "../components/DashboardComponents/SidebarNav";
import useAuth from "../hooks/useAuth";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
const DashboardLayout = () => {
  const { user, logout } = useAuth();
  return (
    <section className={styles.dashboardParent}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <SidebarNav />
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.dashboardHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.brand}>
              <img src="/logo.png" alt="SNS_logo" />
              <div className={styles.brandText}>
                <h2>Dashboard</h2>
              </div>
            </div>
          </div>

          <div className={styles.headerRight}>
            {/* Home Button */}
            <Link to="/" className={styles.iconButton}>
              <FaHome />
              <span>হোম পেজ</span>
            </Link>

            {/* Logout Button */}
            <button className={styles.iconButton} onClick={() => logout()}>
              <FaSignOutAlt />
              <span>লগআউট</span>
            </button>

            {/* User Profile Dropdown */}
            <div className={styles.userDropdown}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className={styles.userDetails}>
                  <span className={styles.userName}>
                    {user?.name || "User"}
                  </span>
                  <span className={styles.userRole}>
                    {user?.role === "admin"
                      ? "অ্যাডমিন"
                      : user?.role === "teacher"
                        ? "শিক্ষক"
                        : user?.role === "accountant"
                          ? "হিসাবরক্ষক"
                          : "ব্যবহারকারী"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </main>
    </section>
  );
};

export default DashboardLayout;
