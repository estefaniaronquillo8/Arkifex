import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { handleLogout } from "../services/user.api.routes";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { AiOutlineUsergroupAdd, AiFillProject } from "react-icons/ai";
import { MdAssignmentAdd } from "react-icons/md";
import { ImLocation } from "react-icons/im";
import { FaMoneyCheckAlt, FaWindowRestore } from "react-icons/fa";
import { HiMenuAlt3 } from "react-icons/hi";
import { RiLogoutBoxFill } from "react-icons/ri";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menus = [
    { name: "Users", link: "/users", icon: AiOutlineUsergroupAdd },
    { name: "Resources", link: "/resources", icon: FaWindowRestore },
    {
      name: "Resource Assignments",
      link: "/resourceAssignments",
      icon: MdAssignmentAdd,
    },
    { name: "Projects", link: "/projects", icon: AiFillProject },
    {
      name: "Projects Plannings",
      link: "/projectPlannings",
      icon: BsFillCalendarCheckFill,
    },
    { name: "Locations", link: "/locations", icon: ImLocation },
    { name: "Costs", link: "/costs", icon: FaMoneyCheckAlt },
  ];

  const [open, setOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const sessionId = localStorage.getItem("token");

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const handleLogoutClick = () => {
    handleLogout(navigate);
  };

  const isActive = (link) => {
    return currentPath === link;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setOpen(false);
        setShowSidebar(false);
      } else {
        setIsMobile(false);
        setOpen(true);
        setShowSidebar(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex">
      {!sessionId ? (
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
          <section className="flex h-screen gap-6">
            {showSidebar && (
              <div
                className={`bg-[#122949] ${
                  open ? "w-72" : "w-16"
                } duration-500 text-gray-100 flex flex-col`}
              >
                <div className="py-3 flex justify-center">
                  <HiMenuAlt3
                    size={28}
                    className="cursor-pointer"
                    onClick={() => setOpen(!open)}
                  />
                </div>

                <div className="mt-4 flex flex-col gap-5 relative flex-grow">
                  {menus?.map((menu, i) => (
                    <Link
                      to={menu?.link}
                      key={i}
                      className={`group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md ${
                        isActive(menu?.link) ? "bg-blue-900" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8">
                        {React.createElement(menu?.icon, {
                          size: "30",
                          color: isActive(menu?.link) ? "#ffffff" : "#6B7280",
                        })}
                      </div>
                      <h2
                        style={{
                          transitionDelay: `${i + 3}00ms`,
                        }}
                        className={`text-xl font-normal text-white whitespace-pre duration-500 ${
                          !open && "opacity-0 translate-x-28 overflow-hidden"
                        }`}
                      >
                        {menu?.name}
                      </h2>
                      <h2
                        className={`${
                          open && "hidden"
                        } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                      >
                        {menu?.name}
                      </h2>
                    </Link>
                  ))}

                  <br />
                  <button
                    onClick={handleLogoutClick}
                    className="text-white flex items-center justify-center"
                  >
                    <RiLogoutBoxFill size={30} className="mr-2" />
                  </button>
                </div>
              </div>
            )}

            {!showSidebar && (
              <div className="py-3 flex justify-center">
                <HiMenuAlt3
                  size={28}
                  className="cursor-pointer"
                  onClick={() => setShowSidebar(true)}
                />
              </div>
            )}

            <div className={`m-3 text-x1 text-gray-900 font-semibold ${!showSidebar && 'hidden'}`}></div>
          </section>
        </>
      )}
    </div>
  );
};

export default Sidebar;
