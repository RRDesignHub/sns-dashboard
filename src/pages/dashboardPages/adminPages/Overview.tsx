import { HiUsers, HiSpeakerphone } from "react-icons/hi";
import { PiStudentFill, PiUsersFourFill } from "react-icons/pi";
import { FaUsersGear } from "react-icons/fa6";
import { GiPapers } from "react-icons/gi";
import { IoMdPersonAdd } from "react-icons/io";
import { TiUserAdd } from "react-icons/ti";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import styles from "./../../../styles/components/Overview.module.scss";
import { MdAttachMoney, MdBarChart, MdCalendarMonth } from "react-icons/md";
import { FiTrendingUp } from "react-icons/fi";
import { BiBell, BiBookOpen } from "react-icons/bi";

const Overview: React.FC = () => {
  // Dummy data for cards
  const statsCards = [
    {
      id: 1,
      title: "মোট শিক্ষার্থী",
      value: "560",
      change: "+12%",
      icon: <PiUsersFourFill size={24} />, // Replaced Users
      color: "primary",
      bgColor: "var(--card-bg-primary)",
    },
    {
      id: 2,
      title: "মোট শিক্ষক",
      value: "14",
      change: "+2",
      icon: <TiUserAdd size={24} />, // Replaced UserCheck
      color: "success",
      bgColor: "var(--card-bg-success)",
    },
    {
      id: 3,
      title: "মোট ব্যবহারকারী",
      value: "5",
      change: "0",
      icon: <FaUsersGear size={24} />, // Replaced UserCog
      color: "warning",
      bgColor: "var(--card-bg-warning)",
    },
    {
      id: 4,
      title: "মোট নোটিশ",
      value: "11",
      change: "+2",
      icon: <HiSpeakerphone size={24} />, // Replaced Bell
      color: "info",
      bgColor: "var(--card-bg-info)",
    },
    {
      id: 5,
      title: "মাসিক আয়",
      value: "৳ 56,650",
      change: "+3%",
      icon: <MdAttachMoney size={24} />, // Replaced DollarSign
      color: "secondary",
      bgColor: "var(--card-bg-secondary)",
    },
    {
      id: 6,
      title: "একাডেমিক ক্লাস",
      value: "22",
      change: "0",
      icon: <PiStudentFill size={24} />, // Replaced GraduationCap
      color: "accent",
      bgColor: "var(--card-bg-accent)",
    },
  ];

  // Dummy data for class-based student distribution (Play to Class 10)
  const classDistribution = [
    { className: "Play", ছেলে: 45, মেয়ে: 40, মোট: 85 },
    { className: "Nursery", ছেলে: 48, মেয়ে: 44, মোট: 92 },
    { className: "One", ছেলে: 62, মেয়ে: 58, মোট: 120 },
    { className: "Two", ছেলে: 60, মেয়ে: 55, মোট: 115 },
    { className: "Three", ছেলে: 57, মেয়ে: 53, মোট: 110 },
    { className: "Four", ছেলে: 56, মেয়ে: 52, মোট: 108 },
    { className: "Five", ছেলে: 54, মেয়ে: 51, মোট: 105 },
    { className: "Six", ছেলে: 50, মেয়ে: 48, মোট: 98 },
    { className: "Seven", ছেলে: 49, মেয়ে: 46, মোট: 95 },
    { className: "Eight", ছেলে: 47, মেয়ে: 43, মোট: 90 },
    { className: "Nine", ছেলে: 44, মেয়ে: 41, মোট: 85 },
    { className: "Ten", ছেলে: 42, মেয়ে: 38, মোট: 80 },
  ];

  const admissionTrendData = [
    { month: "জুলাই", admissions: 45 },
    { month: "আগস্ট", admissions: 52 },
    { month: "সেপ্টেম্বর", admissions: 48 },
    { month: "অক্টোবর", admissions: 60 },
    { month: "নভেম্বর", admissions: 55 },
    { month: "ডিসেম্বর", admissions: 65 },
  ];

  // Dummy data for gender pie chart
  const genderData = [
    { gender: "ছেলে", value: 680, percentage: 55, color: "#16a34a" },
    { gender: "মেয়ে", value: 565, percentage: 45, color: "#22c55e" },
  ];

  // Recent activity from logs
  const recentActivities = [
    {
      id: 1,
      action: "নতুন শিক্ষার্থী যুক্ত",
      user: "amran033a@gmail.com",
      details: "Md. Imran Hossain কে Play শ্রেণীতে সংযুক্ত করেছেন",
      time: "১০ মিনিট আগে",
      icon: <HiUsers size={16} />, // Replaced Users
    },
    {
      id: 2,
      action: "ফলাফল আপডেট",
      user: "ratree@teacher.com",
      details: "Class Five এর বার্ষিক পরীক্ষার ফলাফল আপডেট করেছেন",
      time: "৩০ মিনিট আগে",
      icon: <GiPapers size={16} />, // Replaced FileText
    },
    {
      id: 3,
      action: "নতুন নোটিশ",
      user: "ripanulalam2000@gmail.com",
      details: "ঈদের ছুটির বিজ্ঞপ্তি প্রকাশ করেছেন",
      time: "২ ঘন্টা আগে",
      icon: <HiSpeakerphone size={16} />, // Replaced Bell
    },
    {
      id: 4,
      action: "শিক্ষক যোগ",
      user: "ripanulalam2000@gmail.com",
      details: "Ratree Chowdhury কে Assistant Teacher হিসাবে নিয়োগ দিয়েছেন",
      time: "৫ ঘন্টা আগে",
      icon: <IoMdPersonAdd size={16} />, // Replaced UserCheck
    },
  ];

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label} শ্রেণী</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className={styles.tooltipItem}>
              <span
                className={styles.tooltipDot}
                style={{ backgroundColor: entry.color }}
              ></span>
              {entry.name}: <strong>{entry.value} জন</strong>
            </p>
          ))}
          <p className={styles.tooltipTotal}>
            মোট: <strong>{payload[0]?.payload?.মোট || 0} জন</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{payload[0].name}</p>
          <p className={styles.tooltipItem}>
            শিক্ষার্থী: <strong>{payload[0].value} জন</strong>
          </p>
          <p className={styles.tooltipItem}>
            শতকরা: <strong>{payload[0].payload.percentage}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for line chart
  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          <p className={styles.tooltipItem}>
            নতুন ভর্তি: <strong>{payload[0].value} জন</strong>
          </p>
        </div>
      );
    }
    return null;
  };
  return (
    <div className={styles.overview}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <MdBarChart size={32} /> {/* Replaced BarChart3 */}
          <span>ড্যাশবোর্ড ওভারভিউ</span>
        </h1>
        <div className={styles.headerActions}>
          <button className={styles.dateFilter}>
            <MdCalendarMonth size={18} /> {/* Replaced Calendar */}
            <span>জানুয়ারি ২০২৬</span>
          </button>
        </div>
      </div>

      {/* Section 1: Stats Cards */}
      <section className={styles.statsSection}>
        <h2 className={styles.sectionTitle}>
          <FiTrendingUp size={20} />
          <span>সামগ্রিক পরিসংখ্যান</span>
        </h2>
        <div className={styles.statsGrid}>
          {statsCards.map((card) => (
            <div
              key={card.id}
              className={styles.statsCard}
              style={{ "--card-bg": card.bgColor } as React.CSSProperties}
            >
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles[card.color]}`}>
                  {card.icon}
                </div>
                <div className={styles.cardTrend}>
                  <span className={styles.trendValue}>{card.change}</span>
                  <span className={styles.trendLabel}>গত মাস</span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <div className={styles.cardValue}>{card.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Charts Section */}
      <section className={styles.chartsSection}>
        {/* Left Column: Class Distribution Bar Chart */}
        <div className={styles.chartContainer}>
          <h2 className={styles.sectionTitle}>
            <BiBookOpen size={20} />
            <span>শ্রেণীভিত্তিক শিক্ষার্থী বণ্টন</span>
          </h2>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={classDistribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="className"
                  stroke="#000000a1"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#000000a1"
                  fontSize={12}
                  tickLine={false}
                  label={{
                    value: "শিক্ষার্থী সংখ্যা",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    style: { fill: "#00000070", fontSize: 12 },
                  }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Bar
                  dataKey="ছেলে"
                  fill="#039e63ff"
                  name="ছেলে"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="মেয়ে"
                  fill="#e94200ff"
                  name="মেয়ে"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Pie Chart and Line Chart */}
        <div className={styles.chartsRightColumn}>
          {/* Gender Pie Chart */}
          <div className={styles.chartContainer}>
            <h2 className={styles.sectionTitle}>
              {/* <PieChartIcon size={20} /> */}
              <span>লিঙ্গভিত্তিক বণ্টন</span>
            </h2>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={(entry) => `${entry.name}: ${entry.percent}%`}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.pieLegend}>
                {genderData.map((item, index) => (
                  <div key={index} className={styles.legendItem}>
                    <div className={styles.legendInfo}>
                      <span
                        className={styles.legendDot}
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className={styles.legendGender}>{item.gender}</span>
                    </div>
                    <div className={styles.legendStats}>
                      <span className={styles.legendValue}>
                        {item.value} জন
                      </span>
                      <span className={styles.legendPercentage}>
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Admission Trend */}
          {/* <div className={styles.chartContainer}>
            <h2 className={styles.sectionTitle}>
              <FiTrendingUp size={20} />
              <span>মাসিক ভর্তি প্রবণতা</span>
            </h2>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={admissionTrendData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={11}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="admissions"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#22c55e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div> */}
        </div>
      </section>

      {/* Section 3: Recent Activities */}
      <section className={styles.activitiesSection}>
        <div className={styles.activitiesContainer}>
          <h2 className={styles.sectionTitle}>
            <BiBell size={20} />
            <span>সাম্প্রতিক কার্যক্রম</span>
          </h2>
          <div className={styles.activitiesList}>
            {recentActivities.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>{activity.icon}</div>
                <div className={styles.activityContent}>
                  <div className={styles.activityHeader}>
                    <span className={styles.activityAction}>
                      {activity.action}
                    </span>
                    <span className={styles.activityTime}>{activity.time}</span>
                  </div>
                  <p className={styles.activityDetails}>{activity.details}</p>
                  <span className={styles.activityUser}>- {activity.user}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
