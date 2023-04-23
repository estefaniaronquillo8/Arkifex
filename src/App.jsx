import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GlobalProvider } from "./contexts/GlobalContext";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
// User
import { Login, Register, UserEdit, UserIndex } from './pages/users/Users';
// Cost
import { CostCreate } from './pages/costs/Costs';
// Resource
import { ResourceCreate } from './pages/resources/Resources';

function App() {
  return (
    <Router>
      <GlobalProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<UserIndex />} />
          <Route path="/users/edit/:id" element={<UserEdit />} />
          
          <Route path="/costs/create" element={<CostCreate />} />
          
          <Route path="/resources/create" element={<ResourceCreate />} />
        </Routes>
        <ToastContainer />
      </div>
      </GlobalProvider>
    </Router>
  );
}

export default App;
