import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
          <button onClick={handleLogout} className="text-white">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
