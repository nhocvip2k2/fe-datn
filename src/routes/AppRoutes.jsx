import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import AccountsAdmin from "../components/admin/AccountsAdmin"
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
import Order from "../components/customer/Order"
import OrderAdmin from "../components/admin/OrderAdmin"
import AddProducts from "../components/admin/AddProducts"
import Return  from "../components/customer/Return"
import OrderDetails  from "../components/customer/OrderDetails"
import CategoryAdmin from "../components/admin/CategoryAdmin"
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
        <Route path="/Order" element={<Order />} />
        <Route path="/AddProducts" element={<AddProducts/>} />
        <Route path="/Return" element={<Return/>} />
        <Route path="/OrderDetails" element={<OrderDetails/>} />
        <Route path="/admin/CategoryAdmin" element={<CategoryAdmin/>} />
        <Route
          path="/admin/Accounts"
          element={
            <RequireAuth requiredRole="admin">
              <AccountsAdmin />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/Products"
          element={
            <RequireAuth requiredRole="admin">
              <Products />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/role"
          element={
            <RequireAuth requiredRole="admin">
              <Role />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/order"
          element={
            <RequireAuth requiredRole="admin">
              <OrderAdmin />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/adminchat"
          element={
            <RequireAuth requiredRole="admin">
              <AdminChat />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/Dashboard"
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
