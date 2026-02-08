import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="home-container">
        <Link to="/dashboard" className="dashboard-button">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;
