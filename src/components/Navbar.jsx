import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogout } from "../services/auth.api.routes";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout(navigate);
  };

  return (
    <nav className="bg-blue-500 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/users" className="text-white mr-4">
            Users
          </Link>
          <Link to="/login" className="text-white mr-4">
            Login
          </Link>
          <Link to="/register" className="text-white mr-4">
            Register
          </Link>
          <button onClick={handleLogoutClick} className="text-white">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
