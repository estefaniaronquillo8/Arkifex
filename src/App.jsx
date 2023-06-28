import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GlobalProvider } from "./contexts/GlobalContext";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";

// User
import { Login, Register, UserCreate, UserEdit, UserIndex } from "./pages/users/Users";
// Resource
import { ResourceCreate, ResourceIndex, ResourceEdit } from "./pages/resources/Resources";
// Project Planning
import { ProjectPlanningCreate, ProjectPlanningDetails, ProjectPlanningEdit } from "./pages/projectPlanning/ProjectPlanning";
// Project
import { ProjectCreate, ProjectIndex, ProjectEdit, ProjectDetails, ProjectDashboards } from "./pages/projects/Projects";
// Locations
import { LocationCreate, LocationIndex, LocationEdit, LocationDetails } from "./pages/location/Location";
// ResourceAssignment
import { ResourceAssignmentCreate, ResourceAssignmentIndex, ResourceAssignmentEdit } from "./pages/resourceAssignment/ResourceAssignments";
// Templates
import { TemplateCreate, TemplateIndex, TemplateDetails } from "./pages/templates/Templates";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setShowSidebar(
      location.pathname !== "/login" && location.pathname !== "/register"
    );
  }, [location]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <div className="flex">
        {showSidebar && <Sidebar />}
        <div className="flex-1">
          <Routes>
            <Route path="/users" element={<UserIndex />} />
            <Route path="/users/create" element={<UserCreate />} />
            <Route path="/users/edit/:id" element={<UserEdit />} />

            <Route path="/resources" element={<ResourceIndex />} />
            <Route path="/resources/create" element={<ResourceCreate />} />
            <Route path="/resources/edit/:id" element={<ResourceEdit />} />

            <Route path="/projectPlannings/create" element={<ProjectPlanningCreate />} />
            <Route path="/projectPlannings/edit/:id" element={<ProjectPlanningEdit />} />
            <Route path="/projectPlannings/details/:id" element={<ProjectPlanningDetails />} />

            <Route path="/projects" element={<ProjectIndex />} />
            <Route path="/projects/create" element={<ProjectCreate />} />
            <Route path="/projects/edit/:id" element={<ProjectEdit />} />
            <Route path="/projects/details/:id" element={<ProjectDetails />} />
            <Route path="/projects/dashboards/:id" element={<ProjectDashboards />} />

            <Route path="/templates" element={<TemplateIndex />} />
            <Route path="/templates/create" element={<TemplateCreate />} />
            <Route path="/templates/details/:id" element={<TemplateDetails />} />

            <Route path="/locations" element={<LocationIndex />} />
            <Route path="/locations/create" element={<LocationCreate />} />
            <Route path="/locations/edit/:id" element={<LocationEdit />} />
            <Route path="/locations/details/:id" element={<LocationDetails />} />

            <Route path="/resourceAssignments" element={<ResourceAssignmentIndex />} />
            <Route path="/resourceAssignments/create" element={<ResourceAssignmentCreate />} />
            <Route path="/resourceAssignments/edit/:id" element={<ResourceAssignmentEdit />} />
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </Router>
  );
}

export default AppWithRouter;
