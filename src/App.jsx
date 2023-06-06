import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GlobalProvider } from "./contexts/GlobalContext";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// User
import { Login, Register, UserEdit, UserIndex } from "./pages/users/Users";
// Resource
import { ResourceCreate, ResourceIndex, ResourceEdit, } from "./pages/resources/Resources";
// Project
import { ProjectCreate, ProjectIndex, ProjectEdit, ProjectDetails, } from "./pages/projects/Projects";
// Locations
import { LocationCreate, LocationIndex, LocationEdit, MapPage, } from "./pages/location/Location";
// ResourceAssignment
import { ResourceAssignmentCreate, ResourceAssignmentIndex, ResourceAssignmentEdit, } from "./pages/resourceAssignment/ResourceAssignments";

function App() {
  return (
    <Router>
      <GlobalProvider>
        <div className="App">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/users" element={<UserIndex />} />
                <Route path="/users/edit/:id" element={<UserEdit />} />

                <Route path="/resources" element={<ResourceIndex />} />
                <Route path="/resources/create" element={<ResourceCreate />} />
                <Route path="/resources/edit/:id" element={<ResourceEdit />} />

                <Route path="/projects" element={<ProjectIndex />} />
                <Route path="/projects/create" element={<ProjectCreate />} />
                <Route path="/projects/edit/:id" element={<ProjectEdit />} />
                <Route path="/projects/details/:id" element={<ProjectDetails />} />

                <Route path="/locations" element={<LocationIndex />} />
                <Route path="/locations/create" element={<LocationCreate />} />
                <Route path="/locations/edit/:id" element={<LocationEdit />} />
                <Route path="/locations/map/" element={<MapPage />} />

                <Route path="/resourceAssignments" element={<ResourceAssignmentIndex />} />
                <Route path="/resourceAssignments/create" element={<ResourceAssignmentCreate />} />
                <Route path="/resourceAssignments/edit/:id" element={<ResourceAssignmentEdit />} />
              </Routes>
            </div>
          </div>

          <ToastContainer />
        </div>
      </GlobalProvider>
    </Router>
  );
}

export default App;
