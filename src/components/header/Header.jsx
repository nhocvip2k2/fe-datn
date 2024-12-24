import React, { useState, useEffect } from "react";
import "../../headerUser.css";
import CartSidebar from "../customer/CartSideBar";
import { logOut } from "../../services/authenticationService";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import Chat from "../customer/Chat";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [keyword, setKeyword] = useState(""); // Từ khóa tìm kiếm
  const [unreadCount, setUnreadCount] = useState(0); // Số lượng tin nhắn chưa đọc
  const [isChatOpen, setIsChatOpen] = useState(false); // Trạng thái pop-up chat

  const customerId = 2; // Thay đổi theo ID khách hàng thực tế

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleOrder = () => {
    window.location.href = "/admin/order";
  };
  const handleLogout = () => {
    logOut();
    window.location.href = "/login";
  };


  const handleSearch = () => {
    if (keyword.trim()) {
      window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
    }
  };

  const handleChatClick = () => {
    window.location.href = "/admin/adminchat";
    setUnreadCount(0); // Reset số lượng tin nhắn chưa đọc sau khi mở chat
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

  // Kết nối WebSocket để lắng nghe tin nhắn mới
  useEffect(() => {
    const socket = new SockJS("https://backend-h1zl.onrender.com/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/customer/send/admin`, (message) => {
        const data = JSON.parse(message.body);
        if (data) {
          setUnreadCount((prevCount) => prevCount + 1); // Tăng số lượng tin nhắn chưa đọc
        }
      });
    });

    return () => {
      stompClient.disconnect();
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className="logo">
          <a href="/admin/dashboard">PTIT STORE</a>
        </div>
        <div className="header-center">
          {/* Ô tìm kiếm */}
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            <i className="fas fa-search"></i>
          </button>
        </div>
        <div className="header-right">
          {/* Biểu tượng chat */}
          <div className="chat-icon" onClick={handleChatClick}>
            <i className="fas fa-comments"></i>
            {unreadCount > 0 && (
              <span className="chat-count">{unreadCount}</span>
            )}
          </div>
          {/* Biểu tượng đơn hàng */}
          <div className="order-icon" onClick={toggleOrder}>
            <i className="fas fa-file-alt"></i> {/* Biểu tượng đơn hàng */}
          </div>

          {/* Biểu tượng người dùng */}
          <div className="user-icon" onClick={toggleMenu}>
            <i className="fas fa-user-circle"></i>
            {isMenuOpen && (
              <div className="dropdown-menu">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

    </>
  );
};

export default Header;
