import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../services/user.api.routes";
import { useGlobalContext } from "../contexts/GlobalContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { users, setUsers } = useGlobalContext();

  const handleLogoutClick = () => {
    setUsers(null);
    handleLogout(navigate);
  };

  return (
    <nav className="bg-blue-500 p-6">
      <div className="flex items-center justify-between">
        <div>
          {!users ? (
            <>
              <Link to="/login" className="text-white mr-4">
                Login
              </Link>
              <Link to="/register" className="text-white mr-4">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/users" className="text-white mr-4">
                Users
              </Link>
              <Link to="/resources" className="text-white mr-4">
                Resources
              </Link>
              <Link to="/costs" className="text-white mr-4">
                Costs
              </Link>
              <Link to="/projects" className="text-white mr-4">
                Projects
              </Link>
              <Link to="/projectPlannings" className="text-white mr-4">
              Projects Plannings
              </Link>
              <button onClick={handleLogoutClick} className="text-white">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
