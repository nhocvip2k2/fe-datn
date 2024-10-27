import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Home from "../components/Home";
import ListUsers from "../components/ListUsers"
import Register from "../components/Register"
import Client from "../components/Client"
import Role from "../components/Role"

import  ErrorMessage from "../components/ErrorMessage"
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ListUsers" element={<ListUsers />} />
        <Route path="/role" element={<Role />} />
        <Route path="/register" element={<Register />} />
        <Route path="/client" element={<Client />} />
       
       
        <Route path="/ErrorMessage" element={<ErrorMessage />} />
        
      </Routes>
    </Router>
  );
};

export default AppRoutes;
