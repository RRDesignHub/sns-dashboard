import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserEdit,
  FaUserShield,
  FaUserGraduate,
  FaUserTie,
  FaUserClock,
  FaEnvelope,
  FaCalendarAlt,
  FaIdCard,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaDownload,
  FaTrashAlt,
  FaEye,
  FaUserPlus,
} from "react-icons/fa";
import { MdDelete, MdMoreVert, MdAdminPanelSettings } from "react-icons/md";
import { GiTeacher, GiMoneyStack } from "react-icons/gi";
import Swal from "sweetalert2";
// import { format } from "date-fns";
// import { useAxiosSec } from "../../../Hooks/useAxiosSec";
import styles from "../../../styles/DashboardPages/AllUsers.module.scss";
import Loading from "../../../components/shared/Loading";
const dummyUsers = [
  {
    _id: "67d8f2b1a4e3f5c7d9b2a1e3",
    name: "রিপানুল আলম",
    email: "ripanul.alam@example.com",
    password: "Admin@2025",
    role: "Admin",
    status: "active",
    joinedAt: "2025-01-15T10:30:00.000Z",
    lastLogin: "2026-02-10T08:45:22.000Z",
    phone: "01712345678",
    profileImage: "https://i.pravatar.cc/150?img=1",
    department: "Administration",
    designation: "System Administrator",
  },
  {
    _id: "67d8f2b1a4e3f5c7d9b2a1e4",
    name: "রাত্রি চৌধুরী",
    email: "ratree.chowdhury@example.com",
    password: "Teacher@123",
    role: "Teacher",
    status: "active",
    joinedAt: "2025-01-29T04:15:00.000Z",
    lastLogin: "2026-02-09T14:20:10.000Z",
    phone: "01863117191",
    profileImage: "https://i.pravatar.cc/150?img=2",
    department: "Primary Section",
    designation: "Assistant Teacher",
    specialization: "Bangla & GK",
  },
  {
    _id: "67d8f2b1a4e3f5c7d9b2a1e5",
    name: "আমরান হোসেন",
    email: "amran033a@example.com",
    password: "Amran@2025",
    role: "Admin",
    status: "active",
    joinedAt: "2024-12-10T09:00:00.000Z",
    lastLogin: "2026-02-10T09:30:15.000Z",
    phone: "01987654321",
    profileImage: "https://i.pravatar.cc/150?img=3",
    department: "Administration",
    designation: "Senior Admin",
  },
  {
    _id: "67d8f2b1a4e3f5c7d9b2a1e6",
    name: "ফারজানা আক্তার",
    email: "farjana.akter@example.com",
    password: "Farjana@456",
    role: "Teacher",
    status: "active",
    joinedAt: "2025-02-05T06:45:00.000Z",
    lastLogin: "2026-02-08T11:15:30.000Z",
    phone: "01765432109",
    profileImage: "https://i.pravatar.cc/150?img=4",
    department: "Secondary Section",
    designation: "Senior Teacher",
    specialization: "Mathematics",
  },
  {
    _id: "67d8f2b1a4e3f5c7d9b2a1e7",
    name: "মাহমুদুল হাসান",
    email: "mahmudul.hasan@example.com",
    password: "Mahmud@789",
    role: "Accountant",
    status: "inactive",
    joinedAt: "2024-11-20T08:30:00.000Z",
    lastLogin: "2026-01-15T10:00:00.000Z",
    phone: "01678901234",
    profileImage: "https://i.pravatar.cc/150?img=5",
    department: "Accounts",
    designation: "Senior Accountant",
  },
  {
    _id: "67d8f2b1a4e3f5c7d9b2a1e8",
    name: "নাসরিন সুলতানা",
    email: "nasrin.sultana@example.com",
    password: "Nasrin@321",
    role: "Teacher",
    status: "active",
    joinedAt: "2025-03-12T07:15:00.000Z",
    lastLogin: "2026-02-09T16:45:50.000Z",
    phone: "01543210987",
    profileImage: "https://i.pravatar.cc/150?img=6",
    department: "Science Department",
    designation: "Lecturer",
    specialization: "Physics",
  },
  {
    _id: "67d8f2b1a4e3f5c7d9b2a1e9",
    name: "সাইফুল ইসলাম",
    email: "saiful.islam@example.com",
    password: "Saiful@654",
    role: "Admin",
    status: "active",
    joinedAt: "2024-09-18T11:20:00.000Z",
    lastLogin: "2026-02-10T07:55:12.000Z",
    phone: "01357924680",
    profileImage: "https://i.pravatar.cc/150?img=7",
    department: "Administration",
    designation: "IT Admin",
  },
  {
    _id: "67d8f2b1a4e3f5c7d9b2a1f0",
    name: "তাহমিনা বেগম",
    email: "tahmina.begum@example.com",
    password: "Tahmina@987",
    role: "Accountant",
    status: "active",
    joinedAt: "2025-01-05T05:50:00.000Z",
    lastLogin: "2026-02-08T13:20:45.000Z",
    phone: "01478523690",
    profileImage: "https://i.pravatar.cc/150?img=8",
    department: "Accounts",
    designation: "Junior Accountant",
  },
  {
    _id: "67d8f2b1a4e3f5c7d9b2a1f1",
    name: "কামরুল হাসান",
    email: "kamrul.hasan@example.com",
    password: "Kamrul@159",
    role: "Teacher",
    status: "inactive",
    joinedAt: "2024-10-25T09:40:00.000Z",
    lastLogin: "2026-01-20T12:10:30.000Z",
    phone: "01122334455",
    profileImage: "https://i.pravatar.cc/150?img=9",
    department: "Arts Department",
    designation: "Assistant Teacher",
    specialization: "English Literature",
  },
  {
    _id: "67d8f2b1a4e3f5c7d9b2a1f2",
    name: "শারমিন আক্তার",
    email: "sharmin.akter@example.com",
    password: "Sharmin@753",
    role: "Teacher",
    status: "active",
    joinedAt: "2025-02-18T08:00:00.000Z",
    lastLogin: "2026-02-09T10:35:20.000Z",
    phone: "01799887766",
    profileImage: "https://i.pravatar.cc/150?img=10",
    department: "Primary Section",
    designation: "Assistant Teacher",
    specialization: "Bangla",
  },
  {
    _id: "67d8f2b1a4e3f5c7d9b2a1f3",
    name: "রাশেদুল ইসলাম",
    email: "rashedul.islam@example.com",
    password: "Rashed@246",
    role: "Accountant",
    status: "active",
    joinedAt: "2024-12-01T10:15:00.000Z",
    lastLogin: "2026-02-07T15:40:55.000Z",
    phone: "01811223344",
    profileImage: "https://i.pravatar.cc/150?img=11",
    department: "Accounts",
    designation: "Accounts Officer",
  },
  {
    _id: "67d8f2b1a4e3f5c7d9b2a1f4",
    name: "নাজমা আক্তার",
    email: "najma.akter@example.com",
    password: "Najma@852",
    role: "Admin",
    status: "active",
    joinedAt: "2024-08-14T07:30:00.000Z",
    lastLogin: "2026-02-10T09:05:10.000Z",
    phone: "01955667788",
    profileImage: "https://i.pravatar.cc/150?img=12",
    department: "Administration",
    designation: "HR Admin",
  },
  {
    _id: "67d8f2b1a4e3f5c7d9b2a1f5",
    name: "জহির উদ্দিন",
    email: "jahir.uddin@example.com",
    password: "Jahir@369",
    role: "Teacher",
    status: "active",
    joinedAt: "2025-03-01T06:20:00.000Z",
    lastLogin: "2026-02-08T11:50:35.000Z",
    phone: "01556633447",
    profileImage: "https://i.pravatar.cc/150?img=13",
    department: "Science Department",
    designation: "Senior Teacher",
    specialization: "Chemistry",
  },
  {
    _id: "67d8f2b1a4e3f5c7d9b2a1f6",
    name: "রোকসানা বেগম",
    email: "roksana.begum@example.com",
    password: "Roksana@147",
    role: "Accountant",
    status: "inactive",
    joinedAt: "2024-11-11T09:55:00.000Z",
    lastLogin: "2026-01-18T14:25:40.000Z",
    phone: "01677889900",
    profileImage: "https://i.pravatar.cc/150?img=14",
    department: "Accounts",
    designation: "Cashier",
  },
  {
    _id: "67d8f2b1a4e3f5c7d9b2a1f7",
    name: "মিজানুর রহমান",
    email: "mizanur.rahman@example.com",
    password: "Mizan@258",
    role: "Teacher",
    status: "active",
    joinedAt: "2025-01-22T07:45:00.000Z",
    lastLogin: "2026-02-09T12:15:25.000Z",
    phone: "01744332211",
    profileImage: "https://i.pravatar.cc/150?img=15",
    department: "Secondary Section",
    designation: "Assistant Teacher",
    specialization: "Social Science",
  },
];
const AllUsers = () => {
  // const axiosSecure = useAxiosSec();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortField, setSortField] = useState("joinedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  // Add this to your AllUsers.tsx file or create a separate dummyData.ts file

  // const {
  //   data: users = [],
  //   isLoading,
  //   refetch,
  // } = useQuery({
  //   queryKey: ["users"],
  //   queryFn: async () => {
  //     const { data } = await axiosSecure.get(`/all-users`);
  //     return data || [];
  //   },
  // });

  const handleDelete = async (id: string, userName: string) => {
    try {
      const result = await Swal.fire({
        title: "আপনি কি নিশ্চিত?",
        html: `
          <div style="margin: 20px 0;">
            <p style="font-size: 16px; color: #1f2937; margin-bottom: 10px;">
              <strong>${userName}</strong> কে ডিলিট করা হবে
            </p>
            <p style="font-size: 14px; color: #ef4444;">
              ⚠️ এই ইউজার পুনরায় তৈরি করতে হবে!
            </p>
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#16a34a",
        confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
        cancelButtonText: "বাতিল করুন",
        background: "#f9fafb",
        backdrop: `
          rgba(0,0,0,0.4)
          url("/images/trash-animation.gif")
          left top
          no-repeat
        `,
      });

      // if (result.isConfirmed) {
      //   const { data } = await axiosSecure.delete(`/delete-user/${id}`);
      //   if (data?.deletedCount) {
      //     await Swal.fire({
      //       title: "ডিলিট সম্পন্ন!",
      //       text: "ইউজার সফলভাবে ডিলিট হয়েছে",
      //       icon: "success",
      //       confirmButtonColor: "#16a34a",
      //       timer: 2000,
      //       showConfirmButton: true,
      //     });
      //     refetch();
      //   }
      // }
    } catch (err) {
      console.log("Delete user Error--->", err);
      Swal.fire({
        title: "ত্রুটি!",
        text: "ইউজার ডিলিট করতে সমস্যা হয়েছে",
        icon: "error",
        confirmButtonColor: "#16a34a",
      });
    }
  };

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = dummyUsers.filter((user: any) => {
      // Search filter
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase());

      // Role filter
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });

    // Sort
    filtered.sort((a: any, b: any) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "joinedAt") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [dummyUsers, searchTerm, roleFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <MdAdminPanelSettings />;
      case "Teacher":
        return <GiTeacher />;
      case "Accountant":
        return <GiMoneyStack />;
      default:
        return <FaUserTie />;
    }
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return styles.roleAdmin;
      case "Teacher":
        return styles.roleTeacher;
      case "Accountant":
        return styles.roleAccountant;
      default:
        return styles.roleUser;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <span className={styles.statusActive}>
          <FaCheckCircle /> সক্রিয়
        </span>
      );
    }
    return (
      <span className={styles.statusInactive}>
        <FaTimesCircle /> নিষ্ক্রিয়
      </span>
    );
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <FaSort className={styles.sortIcon} />;
    return sortOrder === "asc" ? (
      <FaSortUp className={styles.sortIconActive} />
    ) : (
      <FaSortDown className={styles.sortIconActive} />
    );
  };

  return (
    <div className={styles.allUsersPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <FaUserShield size={32} />
          </div>
          <div className={styles.headerTitle}>
            <h1 className={styles.pageTitle}>সকল ইউজার</h1>
            <p className={styles.pageSubtitle}>
              সিস্টেমে নিবন্ধিত সকল ব্যবহারকারীর তালিকা
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ background: "rgba(59, 130, 246, 0.1)" }}
            >
              <FaUserShield style={{ color: "#3b82f6" }} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>মোট ইউজার</span>
              <span className={styles.statValue}>{dummyUsers.length} জন</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ background: "rgba(139, 92, 246, 0.1)" }}
            >
              <MdAdminPanelSettings style={{ color: "#8b5cf6" }} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>অ্যাডমিন</span>
              <span className={styles.statValue}>
                {dummyUsers.filter((u: any) => u.role === "Admin").length} জন
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ background: "rgba(16, 185, 129, 0.1)" }}
            >
              <GiTeacher style={{ color: "#10b981" }} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>শিক্ষক</span>
              <span className={styles.statValue}>
                {dummyUsers.filter((u: any) => u.role === "Teacher").length} জন
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ background: "rgba(245, 158, 11, 0.1)" }}
            >
              <GiMoneyStack style={{ color: "#f59e0b" }} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>হিসাবরক্ষক</span>
              <span className={styles.statValue}>
                {dummyUsers.filter((u: any) => u.role === "Accountant").length}{" "}
                জন
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="নাম, ইমেইল বা রোল অনুসন্ধান করুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <FaFilter className={styles.filterIcon} />
          <select
            className={styles.filterSelect}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">সকল রোল</option>
            <option value="Admin">অ্যাডমিন</option>
            <option value="Teacher">শিক্ষক</option>
            <option value="Accountant">হিসাবরক্ষক</option>
          </select>
        </div>

        <Link to="/dashboard/create-user" className={styles.addButton}>
          <FaUserPlus />
          <span>নতুন ইউজার</span>
        </Link>
      </div>

      {/* table of users */}
      {dummyUsers.length === 0 ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <h3 className={styles.tableTitle}>
                ইউজার তালিকা
                <span className={styles.userCount}>
                  {filteredUsers.length} জন
                </span>
              </h3>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.userTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th onClick={() => handleSort("name")}>
                      <span>নাম</span>
                      {getSortIcon("name")}
                    </th>
                    <th onClick={() => handleSort("email")}>
                      <span>ইমেইল</span>
                      {getSortIcon("email")}
                    </th>
                    <th onClick={() => handleSort("role")}>
                      <span>ভূমিকা</span>
                      {getSortIcon("role")}
                    </th>
                    <th>স্ট্যাটাস</th>
                    <th onClick={() => handleSort("joinedAt")}>
                      <span>যোগদানের তারিখ</span>
                      {getSortIcon("joinedAt")}
                    </th>
                    <th>অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user: any, idx: number) => (
                      <tr key={user._id} className={styles.userRow}>
                        <td className={styles.slNo}>
                          <span className={styles.slNumber}>
                            {(currentPage - 1) * itemsPerPage + idx + 1}
                          </span>
                        </td>

                        <td>
                          <div className={styles.userInfo}>
                            <div className={styles.userAvatar}>
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className={styles.userDetails}>
                              <span className={styles.userName}>
                                {user.name}
                              </span>
                              <span className={styles.userId}>
                                ID: {user._id.slice(-6)}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className={styles.userEmail}>
                            <FaEnvelope className={styles.emailIcon} />
                            <span>{user.email}</span>
                          </div>
                        </td>

                        <td>
                          <div
                            className={`${styles.roleBadge} ${getRoleColor(user.role)}`}
                          >
                            {getRoleIcon(user.role)}
                            <span>{user.role}</span>
                          </div>
                        </td>

                        <td>{getStatusBadge(user.status || "active")}</td>

                        <td>
                          <div className={styles.joinDate}>
                            <FaCalendarAlt className={styles.dateIcon} />
                            <span>
                              {/* {user.joinedAt &&
                                format(new Date(user.joinedAt), "MMM dd, yyyy")} */}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className={styles.actionButtons}>
                            <Link
                              to={`/dashboard/update-user/${user._id}`}
                              className={styles.editButton}
                              title="ইউজার এডিট"
                            >
                              <FaUserEdit />
                            </Link>
                            <button
                              className={styles.viewButton}
                              title="বিস্তারিত"
                            >
                              <FaEye />
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => handleDelete(user._id, user.name)}
                              title="ইউজার ডিলিট"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className={styles.noData}>
                        <div className={styles.emptyState}>
                          <FaUserShield size={48} />
                          <h3>কোন ইউজার পাওয়া যায়নি</h3>
                          <p>
                            অনুগ্রহ করে নতুন ইউজার তৈরি করুন অথবা ফিল্টার
                            পরিবর্তন করুন
                          </p>
                          <Link
                            to="/dashboard/create-user"
                            className={styles.emptyStateButton}
                          >
                            <FaUserPlus />
                            নতুন ইউজার তৈরি করুন
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                পূর্ববর্তী
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={i}
                    className={`${styles.paginationButton} ${currentPage === pageNum ? styles.active : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className={styles.paginationButton}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                পরবর্তী
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllUsers;
