import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="home-container">
        <Link to="/dashboard/overview" className="dashboard-button">
          ড্যাশবোর্ডে যান
        </Link>

        <Link to="/result" className="dashboard-button">
          ফলাফল দেখুন
        </Link>
      </div>
    </div>
  );
};

export default Home;
