import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../styles/layouts/Dashboard.module.scss";
import SidebarNav from "../components/DashboardComponents/SidebarNav";
import useAuth from "../hooks/useAuth";
import { FaHome, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false); // Close sidebar on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isSidebarOpen || !isMobile) return;

    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.querySelector(`.${styles.sidebar}`);
      const toggleBtn = document.querySelector(`.${styles.mobileMenuToggle}`);

      if (
        sidebar &&
        !sidebar.contains(e.target as Node) &&
        toggleBtn &&
        !toggleBtn.contains(e.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen, isMobile]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Get user role in Bangla
  const getUserRoleInBangla = (role: string | undefined) => {
    switch (role) {
      case "admin":
        return "অ্যাডমিন";
      case "teacher":
        return "শিক্ষক";
      case "accountant":
        return "হিসাবরক্ষক";
      default:
        return "ব্যবহারকারী";
    }
  };

  // Get user initial for avatar
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <section className={styles.dashboardParent}>
      {/* Sidebar Overlay (mobile only) */}
      <div
        className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.visible : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}
      >
        <button onClick={closeSidebar}>
          <SidebarNav />
        </button>
      </aside>

      {/* Mobile Menu Toggle Button (FAB) */}
      <button
        className={styles.mobileMenuToggle}
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

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

            {/* User Profile */}
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>{getUserInitial()}</div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user?.name || "User"}</span>
                <span className={styles.userRole}>
                  {getUserRoleInBangla(user?.role)}
                </span>
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
