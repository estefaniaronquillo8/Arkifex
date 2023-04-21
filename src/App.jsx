import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
//import UserIndex from "./pages/users/Index1";
import UserEdit from "./pages/users/Edit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import UserIndex from "./pages/users/Index";
import { GlobalProvider } from "./contexts/GlobalContext";

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
        </Routes>
        <ToastContainer />
      </div>
      </GlobalProvider>
    </Router>
  );
}

export default App;
