import React, { useState, useEffect } from "react";
import "../../headerUser.css";
import CartSidebar from "../customer/CartSideBar";
import { logOut } from "../../services/authenticationService";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import Chat from "../customer/Chat";
import { getToken } from "../../services/Cookies";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const token = getToken();
  const customerId = 2;

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const toggleOrder = () => (window.location.href = "/order");
  const handleLogout = () => {
    logOut();
    window.location.href = "/login";
  };
  const handleProfile = () => (window.location.href = "/profile");
  const handleChangePassword = () => (window.location.href = "/ChangePassword");
  const handleSearch = () => {
    if (keyword.trim()) {
      window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
    }
  };
  const handleChatClick = () => {
    setIsChatOpen((prev) => !prev);
    setUnreadCount(0);
  };

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalCount);
    };

    document.addEventListener("cartUpdated", updateCartCount);
    updateCartCount();
    return () => document.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  useEffect(() => {
    const socket = new SockJS("https://datn.up.railway.app/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/admin/send/customer/${customerId}`, (message) => {
        const data = JSON.parse(message.body);
        if (data) {
          setUnreadCount((prevCount) => prevCount + 1);
        }
      });
    });

    return () => stompClient.disconnect();
  }, [customerId]);

  return (
    <>
      <header className="header navbar navbar-expand-lg navbar-light bg-light">
  <div className="container-fluid">
  <a className="navbar-brand fw-bold fs-3" href="/home">
  PTIT STORE
</a>

    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav me-auto">
        <li className="nav-item"><a className="nav-link" href="/search">Giới thiệu</a></li>
        <li className="nav-item"><a className="nav-link" href="/search">Sản phẩm</a></li>
        <li className="nav-item"><a className="nav-link" href="/search">Tin tức</a></li>
      </ul>
      <div className="d-flex align-items-center justify-content-between w-75">
        <div className="search-container mx-auto w-75">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm sản phẩm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn-outline-secondary" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {/* Các biểu tượng khác */}
        <div className="icon-container me-3" onClick={handleChatClick}>
          <i className="fas fa-comments"></i>
          {unreadCount > 0 && <span className="badge bg-danger">{unreadCount}</span>}
        </div>
        <div className="icon-container me-3" onClick={toggleOrder}>
          <i className="fas fa-file-alt"></i>
        </div>
        <div className="icon-container me-3" onClick={toggleCart}>
          <i className="fas fa-shopping-cart"></i>
          {cartCount > 0 && <span className="badge bg-primary">{cartCount}</span>}
        </div>
        <div className="dropdown">
          <button className="btn btn-outline-secondary dropdown-toggle" type="button" onClick={toggleMenu}>
            <i className="fas fa-user-circle"></i>
          </button>
          {isMenuOpen && (
            <ul className="dropdown-menu show custom-dropdown c-dropdown">
              <li><button className="dropdown-item" onClick={handleProfile}>Profile</button></li>
              <li><button className="dropdown-item" onClick={handleChangePassword}>Change Password</button></li>
              <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
            </ul>
          )}
        </div>
      </div>
    </div>
  </div>
</header>


      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={toggleCart} />

      {/* Chat Container */}
      <div className={`chat-container ${isChatOpen ? "open" : ""}`}>
        <Chat />
      </div>
    </>
  );
};

export default Header;
