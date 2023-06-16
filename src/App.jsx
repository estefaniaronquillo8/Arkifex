import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GlobalProvider } from "./contexts/GlobalContext";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";


// User
import { Login, Register, UserEdit, UserIndex } from './pages/users/Users';
// Resource
import { ResourceCreate, ResourceIndex, ResourceEdit, ResourceDetails } from './pages/resources/Resources';
// Cost
import { CostCreate, CostIndex, CostEdit } from './pages/costs/Costs';
// Project
import { ProjectCreate, ProjectIndex, ProjectEdit, ProjectDetails } from './pages/projects/Projects';
// ProjectPlanning
import { ProjectPlanningCreate, ProjectPlanningIndex, ProjectPlanningEdit } from './pages/projectPlanning/ProjectPlanning';
// Locations
import { LocationCreate, LocationIndex, LocationEdit,MapPage } from './pages/location/Location';
// ResourceAssignment
//import { ResourceAssignmentCreate, ResourceAssignmentIndex, ResourceAssignmentEdit } from './pages/resourceAssignment/ResourceAssignment';
import { ResourceAssignmentCreate, ResourceAssignmentIndex } from './pages/resourceAssignment/ResourceAssignment';




function App() {
 
  return (
    <Router>
      <GlobalProvider>
      <div className="App">
    {/* <Navbar /> */}
      <div className="flex">
{/* <Sidebar/>       */}
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
          <Route path="/resources/details/:id" element={<ResourceDetails />} />
          
          <Route path="/costs" element={<CostIndex />} />
          <Route path="/costs/create" element={<CostCreate />} />
          <Route path="/costs/edit/:id" element={<CostEdit />} />

          <Route path="/projectPlannings" element={<ProjectPlanningIndex />} />
          <Route path="/projectPlannings/create" element={<ProjectPlanningCreate />} />
          <Route path="/projectPlannings/edit/:id" element={<ProjectPlanningEdit />} />

          <Route path="/projects" element={<ProjectIndex />} />
          <Route path="/projects/create" element={<ProjectCreate />} />
          <Route path="/projects/edit/:id" element={<ProjectEdit />} />
          <Route path="/projects/details/:id" element={<ProjectDetails />} />
          
          <Route path="/locations" element={<LocationIndex />} />
          <Route path="/locations/create" element={<LocationCreate />} />
          <Route path="/locations/edit/:id" element={<LocationEdit />} />   
          <Route path="/locations/map/" element={<MapPage/>} />       

          <Route path="/resourceAssignments" element={<ResourceAssignmentIndex />} />
          <Route path="/resourceAssignments/create" element={<ResourceAssignmentCreate />} />

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
