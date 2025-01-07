import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import AccountsAdmin from "../components/admin/AccountsAdmin"
import Dashboard from "../components/admin/Dashboard"
import Register from "../components/Register"
import Client from "../components/Client"
import StatProduct from "../components/admin/StatProduct"
import RefundPaymentQR from "../components/admin/RefundPaymentQR"
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
import Invoice from "../components/customer/Invoice"
import OrderAdmin from "../components/admin/OrderAdmin"
import AddProducts from "../components/admin/AddProducts"
import Return  from "../components/customer/Return"
import OrderDetails  from "../components/customer/OrderDetails"
import CategoryAdmin from "../components/admin/CategoryAdmin"
import ProductsDetails from "../components/admin/ProductsDetails"
import OrderProduct from "../components/admin/OrderProduct"
import TraCoc from "../components/admin/TraCoc"
import Revenue from "../components/admin/Revenue";

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
        <Route path="/RefundPaymentQR" element={<RefundPaymentQR/>} />
        <Route path="/PaymentQR" element={<PaymentQR />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/Categories" element={<Categories />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route path="/Test" element={<Test />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/AddProducts" element={<AddProducts/>} />
        <Route path="/Return" element={<Return/>} />
        <Route path="/OrderDetails/:orderId" element={<OrderDetails/>} />
        <Route path="/OrderProduct/:orderDetailId" element={<OrderProduct/>} />
        <Route path="/admin/CategoryAdmin" element={<CategoryAdmin/>} />
        <Route path="/admin/ProductsDetails/:productId/:method" element={<ProductsDetails/>} />
        <Route path="/admin/TraCoc/:orderDetailId/:depositAmount/:userId" element={<TraCoc/>} />
        <Route path="/admin/revenue" element={<Revenue/>} />
        <Route path="/invoice/:productId/:orderDetailId" element={<Invoice/>} />
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
          path="/admin/statproduct"
          element={
            <RequireAuth requiredRole="admin">
              <StatProduct />
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
