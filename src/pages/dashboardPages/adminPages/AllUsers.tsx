import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FaUserEdit,
  FaUserShield,
  FaUserTie,
  FaEnvelope,
  FaCalendarAlt,
  FaTimesCircle,
  FaFilter,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaTrashAlt,
  FaEye,
  FaUserPlus,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import Swal from "sweetalert2";
// import { format } from "date-fns";
// import { useAxiosSec } from "../../../Hooks/useAxiosSec";
import styles from "../../../styles/DashboardPages/AllUsers.module.scss";
import Loading from "../../../components/shared/Loading";
import { GiMoneyStack, GiTeacher } from "react-icons/gi";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  // all users data for admin and teachers dashboard

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"], // Changed from "students" to "users"
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/api/users`); // Use the instance
      return data || [];
    },
  });

  console.log(users);
  return <h1>All students</h1>;
  // const axiosSecure = useAxiosSec();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortField, setSortField] = useState("joinedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
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

      console.log(result);
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
    const filtered = users.filter((user) => {
      // Search filter
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase());

      // Role filter
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });

    return filtered;
  }, [users, searchTerm, roleFilter, sortField, sortOrder]);

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
              <span className={styles.statValue}>{users.length} জন</span>
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
                {users.filter((u) => u.role === "Admin").length} জন
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
                {users.filter((u) => u.role === "Teacher").length} জন
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
                {users.filter((u) => u.role === "Accountant").length} জন
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
      {users.length === 0 ? (
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
                    paginatedUsers.map((user, idx: number) => (
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
