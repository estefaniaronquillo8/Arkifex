import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GlobalProvider } from "./contexts/GlobalContext";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
// User
import { Login, Register, UserEdit, UserIndex } from './pages/users/Users';
// Resource
import { ResourceCreate, ResourceIndex, ResourceEdit } from './pages/resources/Resources';
// Cost
import { CostCreate, CostIndex, CostEdit } from './pages/costs/Costs';
// Project
import { ProjectCreate, ProjectIndex } from './pages/projects/Projects';
// ProjectPlanning
import { ProjectPlanningCreate, ProjectPlanningIndex } from './pages/projectPlanning/ProjectPlanning';

function App() {
  return (
    <Router>
      <GlobalProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<UserIndex />} />
          <Route path="/users/edit/:id" element={<UserEdit />} />
          
          <Route path="/resources" element={<ResourceIndex />} />
          <Route path="/resources/create" element={<ResourceCreate />} />
          <Route path="/resources/edit/:id" element={<ResourceEdit />} />
          
          <Route path="/costs" element={<CostIndex />} />
          <Route path="/costs/create" element={<CostCreate />} />
          <Route path="/costs/edit/:id" element={<CostEdit />} />

          <Route path="/projectPlannings" element={<ProjectPlanningIndex />} />
          <Route path="/projectPlannings/create" element={<ProjectPlanningCreate />} />

          <Route path="/projects" element={<ProjectIndex />} />
          <Route path="/projects/create" element={<ProjectCreate />} />
          
        </Routes>
        <ToastContainer />
      </div>
      </GlobalProvider>
    </Router>
  );
}

export default App;
