import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import "../../headerUser.css";
import { logOut } from "../../services/authenticationService";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import Chat from "../customer/Chat";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleOrder = () => {
    window.location.href = "/admin/order";
  };
  const handleLogout = () => {
    logOut();
    
    window.location.href = "/login";
  };

  const handleChatClick = () => {
    window.location.href = "/admin/adminchat";
    setUnreadCount(0);
  };

  const handleSearch = () => {
    if (keyword.trim()) {
      window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
    }
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
      stompClient.subscribe(`/customer/send/admin/2`, (message) => {
        const data = JSON.parse(message.body);
        if (data) {
          setUnreadCount((prevCount) => prevCount + 1);
        }
      });
    });

    return () => {
      stompClient.disconnect();
    };
  }, []);

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
      <a className="navbar-brand text-decoration-none" href="/admin/dashboard">
  PTIT STORE
</a>

        <div className="collapse navbar-collapse">
          <div className="d-flex mx-auto w-100 justify-content-center">
            <div className="input-group w-75">
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
        </div>
        <div className="d-flex ms-auto justify-content-between align-items-center w-10">
          <div className="position-relative ms-3" onClick={handleChatClick}>
            <i className="fas fa-comments fs-4"></i>
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="ms-3" onClick={toggleOrder}>
            <i className="fas fa-file-alt fs-4"></i>
          </div>
          <div className="dropdown ms-3">
            <button
              className="btn btn-link text-decoration-none"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen ? "true" : "false"}
            >
              <i className="fas fa-user-circle fs-4"></i>
            </button>
            {isMenuOpen && (
              <ul className="dropdown-menu show custom-dropdown c-dropdown">
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
