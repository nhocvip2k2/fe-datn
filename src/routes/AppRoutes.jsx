import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Accounts from "../components/admin/Accounts"
import Dashboard from "../components/admin/Dashboard"
import Register from "../components/Register"
import Client from "../components/Client"
import Role from "../components/admin/Role"
import AdminChat from "../components/admin/AdminChat"
import Products from "../components/admin/Products"
import RequireAuth from "../services/RequireAuth";
import  ErrorMessage from "../components/ErrorMessage"
import ProductDetails from "../components/Productdetails"
import Home from "../components/customer/Home"
import Details from "../components/customer/Details"
import Cart from "../components/customer/Cart"
import Checkout from "../components/customer/Checkout"
import PaymentQR from "../components/customer/PaymentQR"
import Search from "../components/customer/Search"
import Categories from "../components/customer/Categories"
import Profile from "../components/customer/Profile"
import ChangePassword from "../components/customer/ChangePassword"
import Test from "../components/customer/test"
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Role" element={<Role />} />
        <Route path="/register" element={<Register />} />
        <Route path="/client" element={<Client />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/product/details/:id" element={< ProductDetails />} />
        <Route path="/ErrorMessage" element={<ErrorMessage />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Details/:id" element={<Details />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/PaymentQR" element={<PaymentQR />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/Categories" element={<Categories />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route path="/Test" element={<Test />} />
        <Route path="/AdminChat" element={<AdminChat />} />
        <Route
          path="/Accounts"
          element={
            <RequireAuth requiredRole="admin">
              <Accounts />
            </RequireAuth>
          }
        />
        <Route
          path="/Dashboard"
          element={
            <RequireAuth requiredRole="admin">
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
