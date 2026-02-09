import { NavLink } from "react-router-dom";
import styles from "./../../styles/components/Sidebar.module.scss";
import type { IconType } from "react-icons";
import {
  FaFileInvoiceDollar,
  FaRegIdCard,
  FaRegMoneyBillAlt,
  FaSitemap,
  FaTasks,
} from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";
import { GiPapers, GiTeacher } from "react-icons/gi";
import { HiDocumentReport, HiSpeakerphone } from "react-icons/hi";
import { IoMdPersonAdd } from "react-icons/io";
import {
  MdAddChart,
  MdDashboard,
  MdInventory,
  MdOutlineAddchart,
  MdReceipt,
} from "react-icons/md";
import { PiUsersFourFill } from "react-icons/pi";
import { RiBookShelfFill } from "react-icons/ri";
import { TiUserAdd } from "react-icons/ti";
import { AiOutlineTransaction } from "react-icons/ai";
import { ImCalculator } from "react-icons/im";
import { TbCoinTakaFilled } from "react-icons/tb";

type UserRole = {
  isAdmin: boolean;
  isTeacher: boolean;
  isAccountant: boolean;
};

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
  // TEMP: later this will come from Redux / Auth Context
  const userRole: UserRole = {
    isAdmin: true,
    isTeacher: false,
    isAccountant: false,
  };
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
        {
          name: "Create User",
          path: "/dashboard/create-user",
          icon: IoMdPersonAdd,
        },
        { name: "All User", path: "/dashboard/all-users", icon: FaUsersGear },
      ],
    },
    {
      heading: "Academic & Exam",
      links: [
        {
          name: "সকল শিক্ষার্থী",
          path: "/dashboard/students",
          icon: PiUsersFourFill,
        },
        { name: "শিক্ষক যোগ", path: "/dashboard/add-teacher", icon: TiUserAdd },
        {
          name: "সকল শিক্ষক",
          path: "/dashboard/all-teachers",
          icon: GiTeacher,
        },
        {
          name: "নোটিশ যোগ",
          path: "/dashboard/add-notice",
          icon: HiSpeakerphone,
        },
        {
          name: "বিষয়সমূহ",
          path: "/dashboard/subjects",
          icon: RiBookShelfFill,
        },
        {
          name: "এডমিট কার্ড",
          path: "/dashboard/class-admit-cards",
          icon: FaRegIdCard,
        },
        { name: "ফলাফল", path: "/dashboard/dashboard-results", icon: GiPapers },
        { name: "বিশেষ কাজ", path: "/dashboard/special-task", icon: FaTasks },
      ],
    },
  ];

  const teacherNavGroups: NavGroup[] = [
    {
      heading: "Overview",
      links: [
        { name: "ডেসবোর্ড", path: "/dashboard/overview", icon: MdDashboard },
      ],
    },
    {
      heading: "Student Management",
      links: [
        {
          name: "শিক্ষার্থী যোগ",
          path: "/dashboard/add-student",
          icon: IoMdPersonAdd,
        },
        {
          name: "সকল শিক্ষার্থী",
          path: "/dashboard/students",
          icon: PiUsersFourFill,
        },
      ],
    },
    {
      heading: "Academic & Results",
      links: [
        {
          name: "ফলাফল তৈরি",
          path: "/dashboard/add-result",
          icon: MdOutlineAddchart,
        },
        { name: "ফলাফল", path: "/dashboard/dashboard-results", icon: GiPapers },
        {
          name: "এডমিট কার্ড",
          path: "/dashboard/class-admit-cards",
          icon: FaRegIdCard,
        },
      ],
    },
    {
      heading: "Other Tasks",
      links: [
        { name: "বিশেষ কাজ", path: "/dashboard/special-task", icon: FaTasks },
      ],
    },
  ];

  const accountantNavGroups: NavGroup[] = [
    {
      heading: "Overview",
      links: [
        { name: "ডেসবোর্ড", path: "/dashboard/overview", icon: MdDashboard },
        {
          name: "সর্বশেষ লেনদেন",
          path: "/dashboard/recent-transactions",
          icon: AiOutlineTransaction,
        },
      ],
    },
    {
      heading: "Daily Accounts",
      links: [
        {
          name: "দৈনিক হিসাব",
          path: "/dashboard/daily-inout",
          icon: ImCalculator,
        },
        {
          name: "নগদ জমা",
          path: "/dashboard/cash-deposit",
          icon: FaRegMoneyBillAlt,
        },
        {
          name: "বকেয়া আদায়",
          path: "/dashboard/due-collection",
          icon: TbCoinTakaFilled,
        },
      ],
    },
    {
      heading: "Fee Management",
      links: [
        {
          name: "মাসিক বেতন",
          path: "/dashboard/monthly-salary",
          icon: TbCoinTakaFilled,
        },
        { name: "পরীক্ষার ফি", path: "/dashboard/exam-fees", icon: MdAddChart },
        { name: "বিবিধ ফি", path: "/dashboard/misc-fees", icon: MdReceipt },
      ],
    },
    {
      heading: "Reports & Statements",
      links: [
        {
          name: "হিসাব বিবরণী",
          path: "/dashboard/ledger-statement",
          icon: HiDocumentReport,
        },
        {
          name: "আয়-ব্যয় রিপোর্ট",
          path: "/dashboard/income-expense",
          icon: FaFileInvoiceDollar,
        },
        {
          name: "বকেয়া রিপোর্ট",
          path: "/dashboard/due-report",
          icon: HiDocumentReport,
        },
      ],
    },
    {
      heading: "Inventory & Sales",
      links: [
        { name: "পণ্য বিক্রি", path: "/dashboard/sales", icon: FaSitemap },
        {
          name: "মজুদ তালিকা",
          path: "/dashboard/inventory",
          icon: MdInventory,
        },
        {
          name: "ক্রয় রিপোর্ট",
          path: "/dashboard/purchase-report",
          icon: MdReceipt,
        },
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
          <span>
            {userRole.isAdmin
              ? "Admin"
              : userRole.isAdmin
                ? "Teacher"
                : "Accountant"}
          </span>
        </div>
      </div>
      <div className={styles.navDivider}></div>
      {/* 2. Navigation Flow - Logic Only */}
      <nav className={styles.navigation}>
        {/* Admin Navigation */}
        {userRole.isAdmin &&
          adminNavGroups.map((group) => (
            <div key={group.heading} className={styles.navGroup}>
              <h3 className={styles.subheading}>{group.heading}</h3>
              <ul className={styles.linkList}>
                {group.links.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        isActive ? styles.activeLink : styles.link
                      }
                    >
                      <link.icon className={styles.icon} />
                      <span>{link.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        {/* Teacher Navigation */}
        {userRole.isTeacher &&
          teacherNavGroups.map((group) => (
            <div key={group.heading} className={styles.navGroup}>
              <h3 className={styles.subheading}>{group.heading}</h3>
              <ul className={styles.linkList}>
                {group.links.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        isActive ? styles.activeLink : styles.link
                      }
                    >
                      <link.icon className={styles.icon} />
                      <span>{link.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        {/* Accountant Navigation */}
        {userRole.isAccountant &&
          accountantNavGroups.map((group) => (
            <div key={group.heading} className={styles.navGroup}>
              <h3 className={styles.subheading}>{group.heading}</h3>
              <ul className={styles.linkList}>
                {group.links.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        isActive ? styles.activeLink : styles.link
                      }
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
