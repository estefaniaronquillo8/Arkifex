import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserIndex from "./pages/users/Index";
import UserEdit from "./pages/users/Edit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
