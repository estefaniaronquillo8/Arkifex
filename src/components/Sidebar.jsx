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
import { useGlobalContext } from "../contexts/GlobalContext";
import { MdBuild } from "react-icons/md";
import { getAllUsers, handleDelete } from "../services/user.api.routes";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roleInSession,userInSession } = useGlobalContext();
  const menus = [
    { name: "Usuarios", link: "/users", icon: AiOutlineUsergroupAdd },
    { name: "Recursos", link: "/resources", icon:  MdBuild},
    { name: "Proyectos", link: "/projects", icon: AiFillProject },
    { name: "Plantillas", link: "/templates", icon: FaWindowRestore},
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

  if (!sessionId) {
    return (
      <>
        {/* Código cuando no hay sesión */}
      </>
    );
  }

  return (
    <div className="flex">
      <>
        <section className="flex gap-6">
          {showSidebar && (
            <div
              className={`bg-gradient-to-tl from-[#032d50] to-[#031d31] sidebar-container ${
                open ? "w-72" : "w-16"
              } duration-500 text-gray-100 flex flex-col min-h-screen`}
            >
              <div className="py-3 flex justify-center">
                <HiMenuAlt3
                  size={28}
                  className="cursor-pointer"
                  onClick={() => setOpen(!open)}
                />
              </div>
              
          <h1 className="mt-10 text-center text-white font-bold my-4 ">
            Bienvenid@ <br />{userInSession.name} {userInSession.lastname}
          </h1>
       

              <div className="mt-10 flex flex-col gap-5 relative">
                {menus
                  ?.filter(
                    (menu) =>
                      (roleInSession &&
                        roleInSession.name === "superAdmin") ||
                      (roleInSession &&
                        roleInSession.name === "admin" &&
                        menu.name !== "Usuarios") ||
                      (roleInSession &&
                        roleInSession.name === "client" &&
                        menu.name !== "Usuarios" )
                        // dentro si se queire tapa&&menu.name !== "Resources"
                  )
                  .map((menu, i) => (
                    <Link
                      to={menu?.link}
                      key={i}
                      className={`group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md ${
                        isActive(menu?.link) ? "bg-white bg-opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center w-9 h-8">
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
                  className="text-white flex items-center justify-center mt-30"
                >
                <RiLogoutBoxFill size={30} className="mr-2" /> Salir
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

          <div className={`text-xl text-gray-900 font-semibold ${!showSidebar && 'hidden'}`}></div>
        </section>
      </>
    </div>
  );
};

export default Sidebar;
