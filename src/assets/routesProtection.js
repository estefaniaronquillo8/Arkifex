import { useNavigate } from "react-router-dom";

export const routesProtection = () => {
  /* const navigate = useNavigate();
    const token = localStorage.getItem("token");
    
    if (!token) navigate("/login"); */

  const token = localStorage.getItem("token");
  return token !== null;
};
