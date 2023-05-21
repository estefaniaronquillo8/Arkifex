import { useNavigate } from "react-router-dom";

export const routesProtection = () => {
  /* const navigate = useNavigate();
    const sessionId = localStorage.getItem("token");
    
    if (!sessionId) navigate("/login"); */

  const sessionId = localStorage.getItem("token");
  return sessionId !== null;
};
