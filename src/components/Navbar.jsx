import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineConstruction } from "react-icons/md";

const Navbar = () => {
  const sessionId = localStorage.getItem("token");

  return (
    <nav className="bg-[#122949] py-3 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MdOutlineConstruction className="text-4xl text-white mr-2" />
          <h1 className="text-4xl font-bold text-white">ARKIFEX</h1>
        </div>
        <div>
          {!sessionId && (
            <>
              <Link to="/login" className="text-white mr-4">
                Login
              </Link>
              <Link to="/register" className="text-white mr-4">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
