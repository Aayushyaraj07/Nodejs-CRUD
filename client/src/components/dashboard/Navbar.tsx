import React from "react";
import { Tooltip } from "antd";
import { ImSwitch } from "react-icons/im";
import { useNavigate } from "react-router-dom"; // For navigation
import "./styles/Dashboard.scss";

interface NavbarProps {
  userName: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");

    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>OSP</h1>
      </div>
      <div className="navbar-right">
        <p>Hey {userName}!</p>
        <Tooltip title="Logout">
          <button
            className="circle-btn"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <ImSwitch size={24} color="#fff" />
          </button>
        </Tooltip>
      </div>
    </nav>
  );
};

export default Navbar;
