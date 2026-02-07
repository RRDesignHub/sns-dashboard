import { NavLink } from "react-router-dom";
import styles from './../../styles/components/Sidebar.module.scss';
import type { IconType } from "react-icons";
import { FaRegIdCard, FaTasks } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";
import { GiPapers, GiTeacher } from "react-icons/gi";
import { HiSpeakerphone } from "react-icons/hi";
import { IoMdPersonAdd } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { PiUsersFourFill } from "react-icons/pi";
import { RiBookShelfFill } from "react-icons/ri";
import { TiUserAdd } from "react-icons/ti";

// PRO-TIP: Move these interfaces to a separate types/sidebar.ts file later!
export interface NavLinkItem {
  name: string;
  path: string;
  icon: IconType;
}

export interface NavGroup {
  heading: string;
  links: NavLinkItem[];
}

const SidebarNav = () => {
  const adminNavGroups: NavGroup[] = [
    {
      heading: "Overview",
      links: [
        { name: "ড্যাশবোর্ড", path: "/dashboard/overview", icon: MdDashboard },
      ],
    },
    {
      heading: "User Management",
      links: [
        { name: "Create User", path: "/dashboard/create-user", icon: IoMdPersonAdd },
        { name: "All User", path: "/dashboard/all-user", icon: FaUsersGear },
        { name: "শিক্ষক যোগ", path: "/dashboard/add-teacher", icon: TiUserAdd },
        { name: "সকল শিক্ষক", path: "/dashboard/all-teacher", icon: GiTeacher },
      ],
    },
    {
      heading: "Academic & Exam",
      links: [
        { name: "সকল শিক্ষার্থী", path: "/dashboard/students", icon: PiUsersFourFill },
        { name: "নোটিশ যোগ", path: "/dashboard/add-notice", icon: HiSpeakerphone },
        { name: "বিষয়সমূহ", path: "/dashboard/subjects", icon: RiBookShelfFill },
        { name: "এডমিট কার্ড", path: "/dashboard/class-admit-cards", icon: FaRegIdCard },
        { name: "ফলাফল", path: "/dashboard/dashboard-results", icon: GiPapers },
        { name: "বিশেষ কাজ", path: "/dashboard/special-task", icon: FaTasks },
      ],
    },
  ];

  return (
    <div className={styles.sidebarWrapper}>
      {/* 1. Branding Section - Now inside the wrapper for proper styling */}
      <div className={styles.brand}>
        <img src="/logo.png" alt="SNS_logo" />
        <div className={styles.brandText}>
            <h2>Dashboard</h2>
            <span>Admin</span>
        </div>
      </div>
    <div className={styles.navDivider}></div>
      {/* 2. Navigation Flow - Logic Only */}
      <nav className={styles.navigation}>
        {adminNavGroups.map((group) => (
          <div key={group.heading} className={styles.navGroup}>
            <h3 className={styles.subheading}>{group.heading}</h3>
            
            <ul className={styles.linkList}>
              {group.links.map((link) => (
                <li key={link.path}>
                  <NavLink 
                    to={link.path} 
                    className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                  >
                    <link.icon className={styles.icon} />
                    <span>{link.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default SidebarNav;